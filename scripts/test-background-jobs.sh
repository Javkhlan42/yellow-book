#!/bin/bash
# Background Job System Test Script
# Tests the sign-in notification job enqueue and processing

set -e

API_URL="${API_URL:-http://localhost:3333}"
REDIS_URL="${REDIS_URL:-redis://localhost:6379}"

echo "🧪 Background Job System Test"
echo "======================================"
echo "API URL: $API_URL"
echo ""

# Test 1: Enqueue a sign-in notification job
echo "✓ Test 1: Enqueue sign-in notification job"
echo "---"

RESPONSE=$(curl -s -X POST "$API_URL/api/jobs/signin-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "email": "test@example.com",
    "name": "Test User",
    "provider": "github",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0 Test Browser"
  }')

echo "Response:"
echo "$RESPONSE" | jq .
echo ""

# Extract job ID from response
JOB_ID=$(echo "$RESPONSE" | jq -r '.jobId')
echo "Job ID: $JOB_ID"
echo ""

# Test 2: Check job status
echo "✓ Test 2: Get job status"
echo "---"

sleep 2

STATUS_RESPONSE=$(curl -s -X GET "$API_URL/api/jobs/$JOB_ID")
echo "Status Response:"
echo "$STATUS_RESPONSE" | jq .
echo ""

# Test 3: Test rate limiting (10 jobs in quick succession should fail on 11th)
echo "✓ Test 3: Test rate limiting"
echo "---"

for i in {1..10}; do
  RATE_TEST=$(curl -s -X POST "$API_URL/api/jobs/signin-notification" \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": \"rate-limit-user\",
      \"email\": \"ratelimit$i@example.com\",
      \"name\": \"Rate Limit Test $i\",
      \"provider\": \"github\",
      \"ipAddress\": \"192.168.1.101\",
      \"userAgent\": \"Test\"
    }")
  
  if [ $i -eq 10 ]; then
    echo "10th job (should succeed):"
    echo "$RATE_TEST" | jq .
  fi
done

echo ""
echo "Attempting 11th job (should be rate limited):"
RATE_LIMIT_TEST=$(curl -s -X POST "$API_URL/api/jobs/signin-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "rate-limit-user",
    "email": "ratelimit11@example.com",
    "name": "Rate Limit Test 11",
    "provider": "github",
    "ipAddress": "192.168.1.101",
    "userAgent": "Test"
  }')

echo "$RATE_LIMIT_TEST" | jq .
echo ""

# Test 4: Test duplicate job detection
echo "✓ Test 4: Test idempotency (duplicate job detection)"
echo "---"

DUPLICATE=$(curl -s -X POST "$API_URL/api/jobs/signin-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "email": "test@example.com",
    "name": "Test User",
    "provider": "github",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0 Test Browser"
  }')

echo "Duplicate job response (should fail with 409):"
echo "$DUPLICATE" | jq .
echo ""

# Test 5: Get DLQ entries
echo "✓ Test 5: Get Dead Letter Queue entries"
echo "---"

DLQ_RESPONSE=$(curl -s -X GET "$API_URL/api/admin/dlq")
echo "DLQ Response:"
echo "$DLQ_RESPONSE" | jq .
echo ""

echo "======================================"
echo "✅ All tests completed!"
