# Lab 8 Complete Deployment & Testing Guide

## 🎯 Objectives
1. ✅ Embedding field in Prisma
2. ✅ Offline embedding script
3. ✅ POST /api/ai/yellow-books/search
4. ✅ Redis caching
5. ✅ /yellow-books/assistant UI

## 📋 Pre-Deployment Checklist

### 1. Verify Files Exist
```powershell
# Check all Lab 8 files
Get-ChildItem -Recurse -Filter "*embedding*" | Select-Object FullName
Get-ChildItem -Recurse -Filter "*redis*" | Select-Object FullName
Get-ChildItem -Recurse -Filter "*assistant*" | Select-Object FullName
Get-ChildItem -Path "apps/api/src/middleware" -Filter "*ai-search*"
```

### 2. Verify Prisma Schema
```bash
grep "embedding" prisma/schema.prisma
```
Expected: `embedding String? @db.Text`

### 3. Verify Migration
```bash
ls prisma/migrations/ | grep embedding
```
Expected: `20251217160000_add_embedding_field`

## 🚀 Deployment Steps

### Step 1: Deploy Redis (Required for caching)
```powershell
# Apply Redis deployment
kubectl apply -f k8s/redis-deployment.yaml

# Verify Redis is running
kubectl get pods -n yellowbooks -l app=redis
kubectl logs -n yellowbooks -l app=redis --tail=20

# Test Redis connectivity
kubectl exec -n yellowbooks deployment/redis -- redis-cli PING
# Should return: PONG
```

### Step 2: Update Secrets (OpenAI API Key)
```powershell
# Verify secrets are applied
kubectl get secret yellowbooks-secrets -n yellowbooks

# Check OpenAI key exists (base64 encoded)
kubectl get secret yellowbooks-secrets -n yellowbooks -o jsonpath='{.data.OPENAI_API_KEY}' | Out-String
```

### Step 3: Deploy Application Updates
```powershell
# GitHub Actions will automatically:
# 1. Build backend with AI middleware
# 2. Build frontend with assistant page
# 3. Deploy to Kubernetes
# 4. Run migration + seed job

# Check workflow status
# https://github.com/Javkhlan42/uploadit/actions
```

### Step 4: Run Migration & Seed
```powershell
# Delete old job if exists
kubectl delete job prisma-migrate -n yellowbooks --ignore-not-found=true

# Apply migration job
kubectl apply -f k8s/migration-job.yaml

# Watch job progress
kubectl get jobs -n yellowbooks -w

# Check logs
kubectl logs -n yellowbooks job/prisma-migrate --follow

# Expected output:
# Migration done!
# 🌱 Seeding database with Mongolian business data...
# ✅ Created 10 businesses
```

### Step 5: Generate Embeddings
```powershell
# Option 1: Run in backend pod
$backendPod = kubectl get pods -n yellowbooks -l app=backend -o jsonpath='{.items[0].metadata.name}'
kubectl exec -n yellowbooks $backendPod -- npm run generate-embeddings

# Option 2: Run locally (if DB accessible)
# Set environment variables first:
# $env:DATABASE_URL = "postgresql://..."
# $env:OPENAI_API_KEY = "sk-..."
# npm run generate-embeddings
```

### Step 6: Verify Deployment
```powershell
# Check all pods are running
kubectl get pods -n yellowbooks

# Expected output:
# backend-xxx      1/1   Running
# frontend-xxx     1/1   Running  
# postgres-xxx     1/1   Running
# redis-xxx        1/1   Running

# Check services
kubectl get svc -n yellowbooks
```

## 🧪 Testing

### Test 1: Redis Connection
```powershell
$redisPod = kubectl get pods -n yellowbooks -l app=redis -o jsonpath='{.items[0].metadata.name}'
kubectl exec -n yellowbooks $redisPod -- redis-cli PING
# Output: PONG

kubectl exec -n yellowbooks $redisPod -- redis-cli INFO | Select-String "connected_clients"
```

### Test 2: Database Data
```powershell
$postgresPod = kubectl get pods -n yellowbooks -l app=postgres -o jsonpath='{.items[0].metadata.name}'

# Check business count
kubectl exec -n yellowbooks $postgresPod -- psql -U yellowbooks_user -d yellowbooks -c "SELECT COUNT(*) FROM yellow_books;"

# Check Mongolian businesses
kubectl exec -n yellowbooks $postgresPod -- psql -U yellowbooks_user -d yellowbooks -c "SELECT business_name, city FROM yellow_books WHERE city = 'Улаанбаатар' LIMIT 5;"

# Check embeddings exist
kubectl exec -n yellowbooks $postgresPod -- psql -U yellowbooks_user -d yellowbooks -c "SELECT business_name, LENGTH(embedding) as emb_length FROM yellow_books WHERE embedding IS NOT NULL LIMIT 5;"
```

### Test 3: Backend API Endpoint
```powershell
# Test AI search endpoint
$body = @{
    query = "Улаанбаатарт ресторан"
} | ConvertTo-Json

Invoke-WebRequest `
    -Uri "https://sharnom.systems:31529/api/ai/yellow-books/search" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing | Select-Object StatusCode, Content
```

### Test 4: Frontend UI
```powershell
# Open in browser
Start-Process "https://sharnom.systems:31003/yellow-books/assistant"

# Test queries:
# - "Хаан банкны хаяг"
# - "Улаанбаатарт зочид буудал"
# - "Сонгдо эмнэлэг хаана байдаг"
```

### Test 5: Redis Caching
```powershell
# Make a search request first, then check cache
kubectl exec -n yellowbooks deployment/redis -- redis-cli KEYS "ai-search:*"

# Get cached result
kubectl exec -n yellowbooks deployment/redis -- redis-cli GET "ai-search:улаанбаатарт ресторан"
```

## 🔍 Troubleshooting

### Issue: Backend 404 Error
```powershell
# Check backend logs
kubectl logs -n yellowbooks -l app=backend --tail=50

# Check if AI middleware is registered
kubectl logs -n yellowbooks -l app=backend | Select-String "ai/yellow-books/search"

# Restart backend
kubectl rollout restart deployment/backend -n yellowbooks
```

### Issue: No Embeddings
```powershell
# Check OpenAI API key
kubectl get secret yellowbooks-secrets -n yellowbooks -o jsonpath='{.data.OPENAI_API_KEY}' | ForEach-Object {
    [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_))
}

# Run embedding generation manually
$backendPod = kubectl get pods -n yellowbooks -l app=backend -o jsonpath='{.items[0].metadata.name}'
kubectl exec -n yellowbooks $backendPod -- node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.yellowBook.count({ where: { embedding: { not: null } } })
  .then(count => console.log('Businesses with embeddings:', count))
  .catch(console.error);
"
```

### Issue: Redis Connection Failed
```powershell
# Check Redis service
kubectl get svc redis-service -n yellowbooks

# Test from backend pod
$backendPod = kubectl get pods -n yellowbooks -l app=backend -o jsonpath='{.items[0].metadata.name}'
kubectl exec -n yellowbooks $backendPod -- sh -c "
  node -e \"
    const Redis = require('ioredis');
    const redis = new Redis('redis://redis-service:6379');
    redis.ping().then(r => console.log('Redis:', r)).catch(console.error);
  \"
"
```

### Issue: Migration Job Failed
```powershell
# Check job status
kubectl describe job prisma-migrate -n yellowbooks

# Check pod logs
kubectl logs -n yellowbooks -l app=migration --tail=100

# Delete and recreate
kubectl delete job prisma-migrate -n yellowbooks
kubectl apply -f k8s/migration-job.yaml
```

## 📊 Success Criteria

✅ All pods in Running state
✅ Redis PING returns PONG
✅ Database has 10 Mongolian businesses
✅ Embeddings generated (embedding IS NOT NULL)
✅ Backend API returns 200 OK
✅ Frontend assistant page loads
✅ AI search returns results
✅ Redis shows cached queries

## 🎉 Final Verification

```powershell
Write-Host "🔍 Lab 8 Verification" -ForegroundColor Cyan

# 1. Pods
Write-Host "`n1. Checking pods..." -ForegroundColor Yellow
kubectl get pods -n yellowbooks

# 2. Redis
Write-Host "`n2. Testing Redis..." -ForegroundColor Yellow
kubectl exec -n yellowbooks deployment/redis -- redis-cli PING

# 3. Database
Write-Host "`n3. Checking database..." -ForegroundColor Yellow
$pgPod = kubectl get pods -n yellowbooks -l app=postgres -o jsonpath='{.items[0].metadata.name}'
kubectl exec -n yellowbooks $pgPod -- psql -U yellowbooks_user -d yellowbooks -c "SELECT COUNT(*) as total, COUNT(embedding) as with_embeddings FROM yellow_books;"

# 4. API Test
Write-Host "`n4. Testing AI API..." -ForegroundColor Yellow
$testQuery = @{ query = "restaurant" } | ConvertTo-Json
$result = Invoke-WebRequest -Uri "https://sharnom.systems:31529/api/ai/yellow-books/search" -Method POST -ContentType "application/json" -Body $testQuery -UseBasicParsing
Write-Host "Status: $($result.StatusCode)" -ForegroundColor $(if($result.StatusCode -eq 200){'Green'}else{'Red'})

Write-Host "`n✅ Lab 8 Verification Complete!" -ForegroundColor Green
Write-Host "Visit: https://sharnom.systems:31003/yellow-books/assistant" -ForegroundColor Cyan
```

## 📝 Quick Deploy Command

```powershell
# Run all deployment steps in sequence
./scripts/deploy-lab8.ps1
```
