# Background Job Design: Email Notification on User Sign-In

## 1. Overview

**Feature**: Send email notification when a user successfully signs in to the Yellow Books application.

**Job Type**: `user.signin.notification`

## 2. Job Specification

### 2.1 Trigger
- **Event**: User successfully authenticates via NextAuth (GitHub OAuth)
- **Location**: NextAuth callback after successful authentication
- **Frequency**: Once per sign-in event

### 2.2 Payload
```typescript
interface SignInNotificationPayload {
  jobId: string;           // Unique job identifier (UUID)
  userId: string;          // User ID from database
  email: string;           // User email address
  name: string;            // User display name
  provider: string;        // Auth provider (e.g., "github")
  ipAddress: string;       // User's IP address
  userAgent: string;       // Browser user agent
  timestamp: string;       // ISO 8601 timestamp
  attemptCount: number;    // Current retry attempt (starts at 0)
}
```

### 2.3 Outcome
- **Success**: Email sent to user confirming sign-in activity
- **Failure**: Job retried or moved to Dead Letter Queue (DLQ)
- **Side Effects**: 
  - Email sent via email service provider
  - Job status logged to database
  - Metrics recorded for monitoring

## 3. Why Asynchronous?

### 3.1 Performance Reasons
- **Fast Response Time**: User shouldn't wait for email sending (3-5 seconds)
- **Non-Blocking**: Sign-in process completes immediately (~200ms vs 3000ms+)
- **User Experience**: Instant feedback, background processing

### 3.2 Reliability Reasons
- **Email Service Downtime**: Temporary failures don't block authentication
- **Rate Limiting**: Email provider throttling won't affect sign-in
- **Retry Logic**: Failed emails can be retried without user intervention

### 3.3 Scalability Reasons
- **Load Distribution**: Distribute email sending across worker processes
- **Peak Traffic**: Handle burst sign-ins without degrading performance
- **Resource Optimization**: Separate compute resources for I/O operations

## 4. Implementation Stack

- **Queue**: **Redis** with Bull/BullMQ library
- **Worker**: Separate Node.js process
- **Email Service**: SMTP (Nodemailer) or SendGrid API
- **Database**: PostgreSQL for job status tracking

## 5. Retry Strategy

### 5.1 Backoff Configuration
```typescript
{
  attempts: 5,              // Maximum retry attempts
  backoff: {
    type: 'exponential',
    delay: 2000,            // Initial delay: 2 seconds
  }
}
```

### 5.2 Retry Timeline
- **Attempt 1**: Immediate (0s delay)
- **Attempt 2**: After 2 seconds
- **Attempt 3**: After 4 seconds
- **Attempt 4**: After 8 seconds
- **Attempt 5**: After 16 seconds
- **Total**: ~30 seconds before DLQ

### 5.3 Retry Conditions
**Retry On**:
- Network timeouts
- Email service 5xx errors
- Rate limit errors (429)
- Temporary DNS failures

**Don't Retry On**:
- Invalid email address (400)
- Authentication errors (401)
- Malformed payload (400)
- User does not exist (404)

## 6. Idempotency Strategy

### 6.1 Job ID Generation
```typescript
const jobId = `signin-${userId}-${timestamp}-${randomUUID()}`;
```

### 6.2 Deduplication
- **Check Recent Jobs**: Query last 5 minutes for same userId
- **Redis Lock**: Distributed lock with TTL: `lock:email:${userId}:${hour}`
- **Database Flag**: Store processed job IDs with 24-hour TTL

### 6.3 Implementation
```typescript
async function isJobProcessed(jobId: string): Promise<boolean> {
  // Check Redis cache
  const cached = await redis.get(`job:processed:${jobId}`);
  if (cached) return true;
  
  // Check database
  const job = await prisma.jobLog.findUnique({
    where: { jobId }
  });
  
  return job?.status === 'completed';
}
```

## 7. Dead Letter Queue (DLQ)

### 7.1 DLQ Criteria
Jobs moved to DLQ after:
- 5 failed retry attempts
- 24 hours in processing state
- Unrecoverable errors (e.g., invalid payload)

### 7.2 DLQ Storage
```typescript
interface DLQEntry {
  jobId: string;
  payload: SignInNotificationPayload;
  error: string;
  stackTrace: string;
  attempts: number;
  lastAttempt: Date;
  enqueuedAt: Date;
  movedToDLQAt: Date;
}
```

### 7.3 DLQ Handling Strategy

**Manual Review Process**:
1. **Daily Review**: Monitor DLQ dashboard
2. **Error Analysis**: Group by error type
3. **Resolution**:
   - Fix invalid data → Re-enqueue
   - Service issues → Wait for recovery → Bulk retry
   - Invalid emails → Mark as permanently failed

**Automated Actions**:
- **Alert**: Notify Slack/Email when DLQ exceeds threshold (>10 jobs)
- **Metrics**: Track DLQ size, error types, age distribution
- **Archive**: Move jobs older than 7 days to cold storage

**Recovery API Endpoints**:
```typescript
POST /api/admin/dlq/retry/:jobId    // Retry single job
POST /api/admin/dlq/retry-batch     // Retry multiple jobs
GET  /api/admin/dlq/list            // List DLQ entries
DELETE /api/admin/dlq/:jobId        // Permanently remove
```

## 8. Monitoring & Observability

### 8.1 Metrics
- Job enqueue rate (per minute)
- Job processing time (p50, p95, p99)
- Success/failure rate
- DLQ size
- Retry count distribution

### 8.2 Alerts
- DLQ size > 10 jobs
- Failure rate > 5%
- Processing time > 10 seconds
- Queue depth > 1000 jobs

### 8.3 Logging
```typescript
{
  jobId: "signin-user123-2025-12-19T07:00:00Z-uuid",
  event: "job.completed",
  duration: 1234,
  status: "success",
  attemptCount: 1,
  timestamp: "2025-12-19T07:00:01Z"
}
```

## 9. Security Considerations

- **PII Protection**: Email addresses in logs should be masked
- **Rate Limiting**: Max 10 emails per user per hour
- **Spam Prevention**: Check user reputation before sending
- **Email Validation**: Verify email format before enqueueing

## 10. Future Enhancements

- Add email template system (HTML/Text)
- Support multiple notification channels (SMS, Push)
- Implement email preference management
- Add batch processing for bulk notifications
- Use message broker (RabbitMQ/Kafka) for scalability
