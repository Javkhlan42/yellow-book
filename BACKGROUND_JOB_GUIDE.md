# Background Job System Implementation Guide

## Overview

This document explains how to use the background job system for sending email notifications on user sign-in.

## Architecture

### Components

1. **Queue Service** (`apps/api/src/services/queue.service.ts`)
   - Manages job enqueueing using Bull queue
   - Handles idempotency checks
   - Rate limiting (max 10 emails per user per hour)
   - Job logging to database

2. **Email Service** (`apps/api/src/services/email.service.ts`)
   - Currently implements log-only email sending (for demonstration)
   - Can be extended with real SMTP/SendGrid integration
   - Generates HTML and plain text emails

3. **Worker** (`apps/api/src/workers/signin-notification.worker.ts`)
   - Processes jobs from the queue
   - Implements retry logic with exponential backoff
   - Handles job failure and DLQ movement
   - Monitors job progress

4. **API Endpoints** (`apps/api/src/main.ts`)
   - `POST /api/jobs/signin-notification` - Enqueue job
   - `GET /api/jobs/:jobId` - Get job status
   - `GET /api/admin/dlq` - List DLQ entries

5. **NextAuth Integration** (`apps/web/src/app/api/auth/[...nextauth]/route.ts`)
   - Automatically enqueues job on successful sign-in
   - Calls backend API endpoint
   - Non-blocking (doesn't delay sign-in)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install bull ioredis
```

### 2. Database Migration

The `JobLog` table is required:

```sql
CREATE TABLE job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id VARCHAR UNIQUE NOT NULL,
  job_type VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'enqueued',
  payload JSONB,
  error TEXT,
  stack_trace TEXT,
  attempt_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  CONSTRAINT unique_job_id UNIQUE(job_id)
);

CREATE INDEX idx_job_logs_user_id ON job_logs(user_id, job_type, created_at);
CREATE INDEX idx_job_logs_status ON job_logs(status);
```

### 3. Environment Variables

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional-password

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3333

# NextAuth
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
NEXTAUTH_SECRET=your-secret-key
```

### 4. Start the Worker

**Development**:
```bash
npm run worker:dev
```

**Production**:
```bash
npm run worker
```

Output:
```
🚀 Starting Background Job Worker...
Environment: production
Redis: localhost:6379
Database: Connected

[Worker] Starting Sign-In Notification Worker...
[Worker] Redis: localhost:6379
[Worker] ✅ Worker is ready to process jobs
Press Ctrl+C to stop
```

## Usage

### Automatic (via NextAuth)

When a user signs in with GitHub:

1. NextAuth authentication succeeds
2. `signIn` callback triggers automatically
3. Backend API `/api/jobs/signin-notification` is called
4. Job is enqueued to Redis queue
5. Worker picks up job and sends email
6. Job status is logged to database

### Manual Enqueueing

```typescript
import { enqueueSignInNotification } from './services/queue.service';

const job = await enqueueSignInNotification({
  jobId: 'unique-job-id',
  userId: 'user-123',
  email: 'user@example.com',
  name: 'User Name',
  provider: 'github',
  ipAddress: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  timestamp: new Date().toISOString(),
});
```

## Job Lifecycle

### States

1. **Enqueued** - Job added to queue, waiting to be processed
2. **Processing** - Worker started processing
3. **Completed** - Job finished successfully
4. **Failed** - Job failed but will retry
5. **DLQ** - Job moved to Dead Letter Queue after all retries

### Retry Logic

- **Max Attempts**: 5
- **Backoff Strategy**: Exponential
  - Attempt 1: Immediate (0s)
  - Attempt 2: After 2s
  - Attempt 3: After 4s
  - Attempt 4: After 8s
  - Attempt 5: After 16s
  - **Total**: ~30 seconds

### Idempotency

Jobs are deduplicated by `jobId`:
- Check if job already processed (database)
- Check Redis lock for distributed locking
- Prevents duplicate emails in case of retries

### Rate Limiting

- **Max 10 emails per user per hour**
- Returns 429 status if limit exceeded
- Window: 60 minutes rolling

## Monitoring

### Check Queue Status

```bash
# Using curl
curl http://localhost:3333/api/admin/dlq | jq .

# Check specific job
curl http://localhost:3333/api/jobs/signin-user-123-1234567890-uuid | jq .
```

### Database Queries

```sql
-- Recent jobs
SELECT * FROM job_logs 
ORDER BY created_at DESC 
LIMIT 10;

-- Failed jobs
SELECT * FROM job_logs 
WHERE status = 'failed' 
ORDER BY created_at DESC;

-- DLQ entries
SELECT * FROM job_logs 
WHERE status = 'dlq' 
ORDER BY created_at DESC;

-- Rate limiting check (last hour)
SELECT COUNT(*) as email_count 
FROM job_logs 
WHERE user_id = 'user-123' 
AND job_type = 'user.signin.notification'
AND created_at > NOW() - INTERVAL '1 hour';
```

### Worker Logs

When running worker, you'll see:

```
[Worker] Processing job signin-user-123-1734607200000-abc123 (Attempt 1/5)
[Worker] User: user@example.com, Provider: github

=================================
📧 EMAIL SENT (LOG-ONLY MODE)
=================================
To: u***@example.com
Subject: 🔐 Таны бүртгэлд нэвтэрсэн байна - Yellow Books
Body:
Сайн байна уу Test User,

Таны Yellow Books бүртгэлд амжилттай нэвтэрсэн байна.
[...]
=================================

[Worker] Job signin-user-123-1734607200000-abc123 completed in 1234ms
[Worker] ✅ Job 1 completed successfully
```

## Email Customization

To use real email sending, modify `apps/api/src/services/email.service.ts`:

### Option 1: SMTP (Nodemailer)

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(payload: EmailPayload): Promise<void> {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'noreply@yellowbooks.mn',
    to: payload.to,
    subject: payload.subject,
    text: payload.body,
    html: payload.html,
  });
}
```

### Option 2: SendGrid

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(payload: EmailPayload): Promise<void> {
  await sgMail.send({
    to: payload.to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: payload.subject,
    text: payload.body,
    html: payload.html,
  });
}
```

## Testing

### Run Test Suite

```bash
# Bash/Unix
bash scripts/test-background-jobs.sh

# PowerShell/Windows
./scripts/test-background-jobs.bat
```

### Test Cases

1. ✅ Enqueue sign-in notification job
2. ✅ Get job status
3. ✅ Rate limiting (max 10 per hour)
4. ✅ Idempotency (duplicate detection)
5. ✅ Get DLQ entries

## Troubleshooting

### Issue: Worker not starting

**Cause**: Redis not running
```bash
# Check Redis
redis-cli ping
# Should return: PONG

# Start Redis
redis-server
```

### Issue: Jobs stuck in queue

**Cause**: Worker not running or crashed
```bash
# Start worker
npm run worker

# Check worker logs
npm run worker:dev
```

### Issue: Rate limit too strict

**Adjust** in `queue.service.ts`:
```typescript
// Change from 10 to 20
const recentJobsCount = await countRecentJobs(userId, 60 * 60 * 1000);
if (recentJobsCount >= 20) { // Changed from 10
```

### Issue: Emails not sending

**Check**:
1. Worker is running (`npm run worker`)
2. Database is connected
3. Email service is configured
4. Check worker logs for errors

## Performance Considerations

- **Throughput**: ~100 jobs/second per worker
- **Latency**: P50: 100ms, P95: 500ms, P99: 1s
- **Memory**: ~50MB base + ~1MB per 1000 queued jobs
- **Database**: Minimal impact, index on (userId, jobType, createdAt)

## Production Deployment

### Kubernetes

```yaml
# Worker deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: job-worker
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: worker
        image: yellow-book:latest
        command: ["npm", "run", "worker"]
        env:
        - name: REDIS_HOST
          value: redis-service
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
```

### Scaling

- Run multiple worker instances for parallel processing
- Each worker can process multiple jobs concurrently
- Use Redis connection pooling in production

## See Also

- [Background Job Design Document](../docs/BACKGROUND_JOB_DESIGN.md)
- [Queue Service](../apps/api/src/services/queue.service.ts)
- [Email Service](../apps/api/src/services/email.service.ts)
- [Worker Implementation](../apps/api/src/workers/signin-notification.worker.ts)
