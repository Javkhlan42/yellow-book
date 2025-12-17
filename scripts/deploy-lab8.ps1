# Lab 8 Deployment Script for Windows
# Deploy Redis, update secrets, and restart services

Write-Host "🚀 Starting Lab 8 deployment..." -ForegroundColor Green

# Apply secrets with OpenAI API key
Write-Host "`n📝 Applying secrets..." -ForegroundColor Cyan
kubectl apply -f k8s/secrets.yaml

# Deploy Redis
Write-Host "`n🔴 Deploying Redis..." -ForegroundColor Cyan
kubectl apply -f k8s/redis-deployment.yaml

# Wait for Redis to be ready
Write-Host "`n⏳ Waiting for Redis to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=redis -n yellowbooks --timeout=60s

# Restart backend to pick up new secrets
Write-Host "`n🔄 Restarting backend pods..." -ForegroundColor Cyan
kubectl rollout restart deployment/backend -n yellowbooks

# Wait for backend rollout
Write-Host "`n⏳ Waiting for backend rollout..." -ForegroundColor Yellow
kubectl rollout status deployment/backend -n yellowbooks --timeout=120s

# Run migration job with seed data
Write-Host "`n🗄️ Running database migration and seed..." -ForegroundColor Cyan
kubectl delete job prisma-migrate -n yellowbooks --ignore-not-found=true
Start-Sleep -Seconds 2
kubectl apply -f k8s/migration-job.yaml

# Wait for migration to complete
Write-Host "`n⏳ Waiting for migration job..." -ForegroundColor Yellow
kubectl wait --for=condition=complete job/prisma-migrate -n yellowbooks --timeout=180s

# Check migration logs
Write-Host "`n📋 Migration logs:" -ForegroundColor Cyan
kubectl logs job/prisma-migrate -n yellowbooks

Write-Host "`n✅ Lab 8 deployment complete!" -ForegroundColor Green
Write-Host "`n📊 Current status:" -ForegroundColor Cyan
kubectl get pods -n yellowbooks

Write-Host "`n🔗 Access the application at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://sharnom.systems:31003" -ForegroundColor White
Write-Host "   Backend API: http://sharnom.systems:31529" -ForegroundColor White
Write-Host "`n🧪 Test AI search:" -ForegroundColor Cyan
Write-Host "   Visit: http://sharnom.systems:31003/yellow-books/assistant" -ForegroundColor White
