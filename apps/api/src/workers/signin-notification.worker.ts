/**
 * Sign-In Notification Worker
 * 
 * Processes background jobs for sending email notifications on user sign-in
 */

import { Job } from 'bull';
import {
  signInNotificationQueue,
  SignInNotificationPayload,
  updateJobStatus,
  moveJobToDLQ,
} from '../services/queue.service';
import { sendEmail, generateSignInEmail, generateCustomEmail } from '../services/email.service';

/**
 * Process sign-in notification job
 */
async function processSignInNotification(
  job: Job<SignInNotificationPayload>
): Promise<void> {
  const startTime = Date.now();
  const { data } = job;

  console.log(`\n[Worker] Processing job ${data.jobId} (Attempt ${job.attemptsMade + 1}/${job.opts.attempts})`);
  console.log(`[Worker] User: ${data.email}, Provider: ${data.provider}`);

  try {
    // Update status to processing
    await updateJobStatus(data.jobId, 'processing');

    // Check if this is a custom email job
    const isCustomEmail = data.provider === 'custom' && (data as any).customSubject && (data as any).customBody;

    // Generate email content
    const emailPayload = isCustomEmail
      ? generateCustomEmail({
          to: data.email,
          subject: (data as any).customSubject,
          body: (data as any).customBody,
        })
      : generateSignInEmail({
          name: data.name,
          email: data.email,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          timestamp: data.timestamp,
          provider: data.provider,
        });

    // Send email (currently log-only)
    await sendEmail(emailPayload);

    // Update status to completed
    await updateJobStatus(data.jobId, 'completed');

    const duration = Date.now() - startTime;
    console.log(`[Worker] Job ${data.jobId} completed in ${duration}ms`);

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[Worker] Job ${data.jobId} failed after ${duration}ms:`, error.message);

    // Check if this is the last attempt
    const isLastAttempt = job.attemptsMade >= (job.opts.attempts || 1) - 1;

    if (isLastAttempt) {
      // Move to DLQ
      console.error(`[Worker] Job ${data.jobId} exhausted all retries, moving to DLQ`);
      await moveJobToDLQ(job, error);
    } else {
      // Mark as failed for retry
      await updateJobStatus(data.jobId, 'failed', error.message);
      
      // Calculate next retry delay
      const nextDelay = Math.pow(2, job.attemptsMade) * 2000;
      console.log(`[Worker] Job ${data.jobId} will retry in ${nextDelay}ms`);
    }

    // Re-throw to let Bull handle retry logic
    throw error;
  }
}

/**
 * Start the worker
 */
export function startWorker(): void {
  console.log('[Worker] Starting Sign-In Notification Worker...');
  console.log(`[Worker] Redis: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);

  // Process jobs from the queue
  signInNotificationQueue.process(async (job) => {
    return processSignInNotification(job);
  });

  // Event: Job completed
  signInNotificationQueue.on('completed', (job) => {
    console.log(`[Worker] ✅ Job ${job.id} completed successfully`);
  });

  // Event: Job failed
  signInNotificationQueue.on('failed', (job, err) => {
    const isLastAttempt = job.attemptsMade >= (job.opts.attempts || 1);
    if (isLastAttempt) {
      console.error(`[Worker] ❌ Job ${job.id} moved to DLQ: ${err.message}`);
    } else {
      console.error(`[Worker] ⚠️  Job ${job.id} failed (will retry): ${err.message}`);
    }
  });

  // Event: Job active
  signInNotificationQueue.on('active', (job) => {
    console.log(`[Worker] 🔄 Job ${job.id} started processing`);
  });

  // Event: Job waiting
  signInNotificationQueue.on('waiting', (jobId) => {
    console.log(`[Worker] ⏳ Job ${jobId} waiting in queue`);
  });

  // Event: Job stalled
  signInNotificationQueue.on('stalled', (job) => {
    console.warn(`[Worker] 🔶 Job ${job.id} stalled, will retry`);
  });

  console.log('[Worker] ✅ Worker is ready to process jobs');
}

/**
 * Graceful shutdown
 */
async function shutdown(): Promise<void> {
  console.log('[Worker] Shutting down gracefully...');
  await signInNotificationQueue.close();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start worker if this file is run directly
if (require.main === module) {
  startWorker();
}

export default { startWorker };
