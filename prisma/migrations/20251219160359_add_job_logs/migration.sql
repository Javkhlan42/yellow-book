-- CreateTable
CREATE TABLE "job_logs" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'enqueued',
    "payload" JSONB NOT NULL,
    "error" TEXT,
    "stack_trace" TEXT,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "job_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_logs_job_id_key" ON "job_logs"("job_id");

-- CreateIndex
CREATE INDEX "job_logs_job_id_idx" ON "job_logs"("job_id");

-- CreateIndex
CREATE INDEX "job_logs_user_id_job_type_created_at_idx" ON "job_logs"("user_id", "job_type", "created_at");

-- CreateIndex
CREATE INDEX "job_logs_status_idx" ON "job_logs"("status");
