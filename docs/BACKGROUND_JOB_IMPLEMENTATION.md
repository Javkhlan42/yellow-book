# Background Job System - Implementation Guide

## Overview

This guide explains the background job system implemented for the Yellow Books application. The system uses **Bull Queue** with **Redis** to handle asynchronous tasks like sending sign-in notification emails.

## Architecture

### Components

1. **Queue Service** (`apps/api/src/services/queue.service.ts`)
   - Manages job enqueuing and tracking
   - Handles idempotency and rate limiting
   - Tracks job status in database

2. **Email Service** (`apps/api/src/services/email.service.ts`)
   - Generates email content (Mongolian sign-in notifications)
   - Currently implements log-only mode for testing
   - Can be extended with real SMTP/SendGrid

3. **Worker** (`apps/api/src/workers/signin-notification.worker.ts`)
   - Processes jobs from the queue
   - Implements retry logic with exponential backoff
   - Moves failed jobs to Dead Letter Queue (DLQ)

4. **API Endpoints** (`apps/api/src/main.ts`)
   - `POST /api/jobs/signin-notification` - Enqueue sign-in notification
   - `GET /api/jobs/:jobId` - Check job status
   - `GET /api/admin/dlq` - List Dead Letter Queue entries

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

Already installed packages:
- `bull` - Job queue library
- `ioredis` - Redis client
- `nodemailer` - Email service
- `@prisma/client` - Database ORM

### 2. Run Database Migration

Create the `job_logs` table:

```bash
# Local development
npx prisma migrate dev --name add-job-logs

# Production (via K8s)
kubectl apply -f k8s/prisma-migration-job.yaml
```

### 3. Configure Environment Variables

In `.env` or `.env.local`:

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=       # Optional

# Email Configuration (optional - currently log-only)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### 4. Start the Worker

In a separate terminal:

```bash
# Development with file watching
npm run worker:dev

# Production
npm run worker
```

## Usage Flow

### 1. User Signs In

```
User → NextAuth Callback → Enqueue Job → Return to User
                              ↓
                        Queue Service
                              ↓
                        Database Log
```

### 2. NextAuth Configuration

File: `apps/web/src/app/api/auth/[...nextauth]/route.ts`

```typescript
async signIn({ user, account }) {
  // Called after successful authentication
  await enqueueSignInNotification({
    userId: user.id,
    email: user.email,
    name: user.name,
    provider: account?.provider || 'unknown',
    ipAddress: '0.0.0.0',
    userAgent: 'Mozilla/5.0',
  });
  return true; // Allow sign-in
}
```

### 3. Job Processing

```
Job in Queue → Worker Picks Up → Generate Email → Send Email → Mark Complete
                                                      ↓
                                                   Success/Failure
                                                      ↓
                                                  Update Database
                                                      ↓
                                              (If failed) Retry
```

## Job Lifecycle

### States

- **enqueued**: Job added to queue, waiting for processing
- **processing**: Worker started processing the job
- **completed**: Job succeeded
- **failed**: Job failed, will retry
- **dlq**: Job exhausted all retries, moved to Dead Letter Queue

### Retry Logic

```
Attempt 1 → Immediate
Attempt 2 → After 2s
Attempt 3 → After 4s
Attempt 4 → After 8s
Attempt 5 → After 16s
Total: ~30 seconds

Failed → DLQ
```

### Example Flow

```json
{
  "jobId": "signin-user123-1702924800000-uuid",
  "userId": "user123",
  "email": "user@example.com",
  "name": "User Name",
  "provider": "github",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-12-19T07:00:00Z",
  "attemptCount": 0
}
```

## API Endpoints

### Enqueue Sign-In Notification

**Request:**
```bash
curl -X POST http://localhost:3333/api/jobs/signin-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "provider": "github",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }'
```

**Response (202 Accepted):**
```json
{
  "message": "Sign-in notification job enqueued",
  "jobId": "1234567890",
  "status": "enqueued"
}
```

### Check Job Status

**Request:**
```bash
curl http://localhost:3333/api/jobs/signin-user123-1702924800000-uuid
```

**Response:**
```json
{
  "jobId": "signin-user123-1702924800000-uuid",
  "type": "user.signin.notification",
  "status": "completed",
  "createdAt": "2025-12-19T07:00:00Z",
  "processedAt": "2025-12-19T07:00:01Z",
  "attemptCount": 1,
  "error": null
}
```

### List Dead Letter Queue

**Request:**
```bash
curl http://localhost:3333/api/admin/dlq
```

**Response:**
```json
{
  "count": 2,
  "jobs": [
    {
      "jobId": "signin-failed-job-1",
      "jobType": "user.signin.notification",
      "status": "dlq",
      "error": "Email service unreachable",
      "attemptCount": 5,
      "createdAt": "2025-12-19T07:00:00Z",
      "processedAt": "2025-12-19T07:00:30Z"
    }
  ]
}
```

## Testing

### 1. Start All Services

```bash
# Terminal 1: API Server
npm run start:api

# Terminal 2: Worker
npm run worker:dev

# Terminal 3: Frontend (optional)
npm run start:web
```

### 2. Trigger a Sign-In

Visit: `http://localhost:3000/api/auth/signin`

1. Click "Sign in with GitHub"
2. Authorize the application
3. Check worker terminal for email log

### 3. View Email Output

```
=================================
📧 EMAIL SENT (LOG-ONLY MODE)
=================================
To: u***@example.com
Subject: 🔐 Таны бүртгэлд нэвтэрсэн байна - Yellow Books
Body:
Сайн байна уу John,

Таны Yellow Books бүртгэлд амжилттай нэвтэрсэн байна.

Нэвтрэлтийн мэдээлэл:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Имэйл: user@example.com
🌐 Provider: github
📍 IP Address: 192.168.1.1
💻 Browser: Mozilla/5.0...
⏰ Огноо: 2025 оны 12-р сарын 19, 07:00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Хэрэв та энэ нэвтрэлтийг хийгээгүй бол нэн даруй бидэнтэй холбогдоно уу.

Баярлалаа,
Yellow Books баг
=================================
```

## Idempotency

The system prevents duplicate emails using:

1. **Job ID Uniqueness**: `signin-${userId}-${timestamp}-${uuid}`
2. **Database Check**: Query `job_logs` table before enqueuing
3. **Rate Limiting**: Max 10 emails per user per hour

## Error Handling

### Transient Errors (Retry)
- Network timeouts
- Email service 5xx errors
- Rate limiting (429)
- Database temporary unavailability

### Permanent Errors (DLQ)
- Invalid email address
- Authentication failures
- Malformed payload
- User doesn't exist

## Monitoring

### Check Queue Status

```bash
# List all jobs
redis-cli KEYS "bull:*"

# Check job count
redis-cli HGETALL "bull:user.signin.notification:*"
```

### Database Queries

```sql
-- All jobs for a user
SELECT * FROM job_logs 
WHERE user_id = 'user-123' 
ORDER BY created_at DESC;

-- Failed jobs (retry candidates)
SELECT * FROM job_logs 
WHERE status = 'failed' 
ORDER BY created_at DESC;

-- DLQ entries (needs manual review)
SELECT * FROM job_logs 
WHERE status = 'dlq' 
ORDER BY created_at DESC;

-- Success rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM job_logs), 2) as percentage
FROM job_logs
GROUP BY status;
```

## Production Deployment

### 1. Update K8s Secrets

```bash
kubectl set env deployment/backend \
  REDIS_HOST=redis.redis.svc.cluster.local \
  REDIS_PORT=6379 \
  -n yellowbooks
```

### 2. Deploy Worker as Separate Pod

```yaml
# k8s/worker-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: background-worker
  namespace: yellowbooks
spec:
  replicas: 1
  selector:
    matchLabels:
      app: background-worker
  template:
    metadata:
      labels:
        app: background-worker
    spec:
      containers:
      - name: worker
        image: yellow-book-api:latest
        command: ["npm", "run", "worker"]
        env:
        - name: NODE_ENV
          value: "production"
        - name: REDIS_HOST
          value: "redis.redis.svc.cluster.local"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: secrets
              key: database-url
```

### 3. Create Redis Deployment (if not exists)

```bash
helm install redis bitnami/redis -n redis --create-namespace
```

## Troubleshooting

### Worker Not Processing Jobs

1. Check Redis connection:
```bash
redis-cli PING
# Should return: PONG
```

2. Check worker logs:
```bash
npm run worker:dev
# Should show: ✅ Worker is ready to process jobs
```

3. Verify Redis environment:
```bash
echo $REDIS_HOST
echo $REDIS_PORT
```

### Jobs Stuck in "processing"

```bash
# Restart worker
npm run worker:dev

# Check logs for stalled jobs
redis-cli LRANGE "bull:user.signin.notification:delayed" 0 -1
```

### Email Not Sending

1. Check email service configuration:
```bash
echo $SMTP_HOST
echo $SMTP_PORT
```

2. Enable real email sending in `email.service.ts`:
```typescript
// Replace log-only implementation with Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: payload.to,
  subject: payload.subject,
  text: payload.body,
  html: payload.html,
});
```

## Security Best Practices

1. **Mask PII**: Email addresses masked as `u***@example.com` in logs
2. **Rate Limiting**: Max 10 emails per user per hour
3. **Input Validation**: All job payloads validated before processing
4. **Error Details**: Don't expose sensitive errors to users
5. **Access Control**: Admin endpoints require authentication

## Future Enhancements

- [ ] Multiple notification channels (SMS, Push notifications)
- [ ] Email template system with variables
- [ ] User notification preferences
- [ ] Webhook integration for external systems
- [ ] Batch email processing
- [ ] Message broker (RabbitMQ/Kafka) for high-scale
- [ ] Real-time job status via WebSocket
- [ ] Analytics dashboard for job metrics

## References

- [Bull Documentation](https://docs.bullmq.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Callbacks](https://next-auth.js.org/configuration/callbacks)
- [Nodemailer](https://nodemailer.com/)
