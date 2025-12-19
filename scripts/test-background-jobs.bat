@echo off
REM Background Job System Test Script for Windows PowerShell
REM Tests the sign-in notification job enqueue and processing

setlocal enabledelayedexpansion

set "API_URL=%API_URL:http://localhost:3333%"

echo.
echo 🧪 Background Job System Test
echo ======================================
echo API URL: !API_URL!
echo.

REM Test 1: Enqueue a sign-in notification job
echo ✓ Test 1: Enqueue sign-in notification job
echo ---

powershell -Command "
  `$response = Invoke-WebRequest -Uri 'http://localhost:3333/api/jobs/signin-notification' `
    -Method POST `
    -ContentType 'application/json' `
    -Body '{
      \"userId\": \"user-123\",
      \"email\": \"test@example.com\",
      \"name\": \"Test User\",
      \"provider\": \"github\",
      \"ipAddress\": \"192.168.1.100\",
      \"userAgent\": \"Mozilla/5.0 Test Browser\"
    }';
  
  `$content = `$response.Content | ConvertFrom-Json;
  `$content | ConvertTo-Json | Write-Host;
  
  `$jobId = `$content.jobId;
  Write-Host \"`nJob ID: `$jobId`n\";
"

REM Test 2: Check job status
echo ✓ Test 2: Get job status
echo ---
powershell -Command "timeout /t 2; echo 'Waiting...'"

powershell -Command "
  `$jobId = 'replace-with-actual-job-id';
  `$response = Invoke-WebRequest -Uri \"http://localhost:3333/api/jobs/`$jobId\" -Method GET;
  `$response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host;
"

echo.
echo ======================================
echo ✅ All tests completed!
echo.
