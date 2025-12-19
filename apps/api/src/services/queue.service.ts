/**
 * Queue Service - Background Job Queue Management
 * 
 * Manages background jobs using Bull queue with Redis
 */

import Queue, { Job, JobOptions } from 'bull';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Redis connection configuration
const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Job Types
export enum JobType {
  SIGNIN_NOTIFICATION = 'user.signin.notification',
}

// Payload Interfaces
export interface SignInNotificationPayload {
  jobId: string;
  userId: string;
  email: string;
  name: string;
  provider: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  attemptCount: number;
  customSubject?: string;
  customBody?: string;
}

// Queue Configuration
const QUEUE_CONFIG: JobOptions = {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2 seconds initial delay
  },
  removeOnComplete: 100, // Keep last 100 completed jobs
  removeOnFail: false, // Keep failed jobs for analysis
};

// Create queues
export const signInNotificationQueue = new Queue<SignInNotificationPayload>(
  JobType.SIGNIN_NOTIFICATION,
  {
    redis: REDIS_CONFIG,
    defaultJobOptions: QUEUE_CONFIG,
  }
);

/**
 * Enqueue sign-in notification job
 */
export async function enqueueSignInNotification(
  payload: Omit<SignInNotificationPayload, 'attemptCount'>
): Promise<Job<SignInNotificationPayload>> {
  // Check idempotency - prevent duplicate jobs
  const isProcessed = await isJobProcessed(payload.jobId);
  if (isProcessed) {
    console.log(`[Queue] Job ${payload.jobId} already processed, skipping`);
    throw new Error('Job already processed');
  }

  // Check rate limit - max 10 emails per user per hour
  const recentJobsCount = await countRecentJobs(payload.userId, 60 * 60 * 1000); // 1 hour
  if (recentJobsCount >= 10) {
    console.warn(`[Queue] Rate limit exceeded for user ${payload.userId}`);
    throw new Error('Rate limit exceeded');
  }

  // Add attemptCount
  const fullPayload: SignInNotificationPayload = {
    ...payload,
    attemptCount: 0,
  };

  // Enqueue job
  const job = await signInNotificationQueue.add(fullPayload, {
    jobId: payload.jobId, // Use custom job ID for idempotency
  });

  // Log to database
  await logJobEnqueued(fullPayload);

  console.log(`[Queue] Enqueued job ${payload.jobId} for user ${payload.email}`);
  return job;
}

/**
 * Check if job has been processed (idempotency check)
 */
async function isJobProcessed(jobId: string): Promise<boolean> {
  try {
    const job = await (prisma as any).jobLog.findUnique({
      where: { jobId },
    });

    return job?.status === 'completed';
  } catch (error) {
    console.error('[Queue] Error checking job status:', error);
    return false;
  }
}

/**
 * Count recent jobs for a user (rate limiting)
 */
async function countRecentJobs(userId: string, timeWindowMs: number): Promise<number> {
  try {
    const since = new Date(Date.now() - timeWindowMs);
    
    const count = await (prisma as any).jobLog.count({
      where: {
        userId,
        jobType: JobType.SIGNIN_NOTIFICATION,
        createdAt: {
          gte: since,
        },
      },
    });

    return count;
  } catch (error) {
    console.error('[Queue] Error counting recent jobs:', error);
    return 0;
  }
}

/**
 * Log job enqueued to database
 */
async function logJobEnqueued(payload: SignInNotificationPayload): Promise<void> {
  try {
    await (prisma as any).jobLog.create({
      data: {
        jobId: payload.jobId,
        jobType: JobType.SIGNIN_NOTIFICATION,
        userId: payload.userId,
        status: 'enqueued',
        payload: payload as any,
        attemptCount: 0,
      },
    });
  } catch (error) {
    console.error('[Queue] Error logging job:', error);
  }
}

/**
 * Update job status in database
 */
export async function updateJobStatus(
  jobId: string,
  status: 'processing' | 'completed' | 'failed' | 'dlq',
  error?: string
): Promise<void> {
  try {
    await (prisma as any).jobLog.update({
      where: { jobId },
      data: {
        status,
        error,
        processedAt: status === 'completed' || status === 'failed' || status === 'dlq' 
          ? new Date() 
          : undefined,
      },
    });
  } catch (err) {
    console.error('[Queue] Error updating job status:', err);
  }
}

/**
 * Move job to Dead Letter Queue
 */
export async function moveJobToDLQ(
  job: Job<SignInNotificationPayload>,
  error: Error
): Promise<void> {
  try {
    await (prisma as any).jobLog.update({
      where: { jobId: job.data.jobId },
      data: {
        status: 'dlq',
        error: error.message,
        stackTrace: error.stack,
        processedAt: new Date(),
        attemptCount: job.attemptsMade,
      },
    });

    console.error(`[Queue] Job ${job.data.jobId} moved to DLQ:`, error.message);
  } catch (err) {
    console.error('[Queue] Error moving job to DLQ:', err);
  }
}

// Queue event handlers for monitoring
signInNotificationQueue.on('completed', (job) => {
  console.log(`[Queue] Job ${job.id} completed successfully`);
});

signInNotificationQueue.on('failed', (job, err) => {
  console.error(`[Queue] Job ${job?.id} failed:`, err.message);
});

signInNotificationQueue.on('stalled', (job) => {
  console.warn(`[Queue] Job ${job.id} stalled`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Queue] Gracefully closing queue...');
  await signInNotificationQueue.close();
});

export default {
  enqueueSignInNotification,
  signInNotificationQueue,
};
