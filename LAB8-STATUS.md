# Lab 8 Automatic Deployment via GitHub Actions

## ✅ What's Already Done

### Code & Configuration
1. ✅ **Prisma Schema** - embedding field added
2. ✅ **Migration** - 20251217160000_add_embedding_field
3. ✅ **Seed Data** - 10 Mongolian businesses
4. ✅ **AI Middleware** - /api/ai/yellow-books/search endpoint
5. ✅ **Redis Deployment** - k8s/redis-deployment.yaml
6. ✅ **Frontend UI** - /yellow-books/assistant page
7. ✅ **Embeddings Script** - scripts/generate-embeddings.ts
8. ✅ **Secrets** - OpenAI API key (base64 encoded)
9. ✅ **Environment Variables** - NEXT_PUBLIC_API_URL configured

### GitHub Actions Workflows
1. ✅ **Backend CI/CD** - Builds and deploys backend API
2. ✅ **Frontend CI/CD** - Builds and deploys Next.js app
3. ✅ **Migration Job** - Runs migrations and seed automatically

## 🚀 Deployment Process (Automatic)

### When you push to `main` branch:

#### Backend Workflow
```yaml
1. Install dependencies
2. Run ESLint checks
3. Run tests
4. Build Docker image
5. Push to ECR (290817091060.dkr.ecr.us-east-1.amazonaws.com/uploadit-backend)
6. Kubernetes deployment updates
7. Migration job runs: npx prisma migrate deploy && npx prisma db seed
```

#### Frontend Workflow  
```yaml
1. Install dependencies
2. Run ESLint checks
3. Run tests
4. Build Docker image with NEXT_PUBLIC_API_URL
5. Push to ECR (290817091060.dkr.ecr.us-east-1.amazonaws.com/uploadit-frontend)
6. Kubernetes deployment updates
```

## 📊 Current Deployment Status

**Latest Commit:** `5004e12` - "Trigger: Add logging to seed script for Mongolian data deployment"

**What will happen automatically:**
1. ✅ Backend will rebuild with AI middleware
2. ✅ Frontend will rebuild with assistant page
3. ✅ Migration job will run and seed 10 Mongolian businesses
4. ⏳ **Embeddings need manual generation** (see below)
5. ⏳ **Redis needs to be deployed** (see below)

## ⚠️ Manual Steps Required

### 1. Deploy Redis (One-time)
Someone with kubectl access needs to run:
```bash
kubectl apply -f k8s/redis-deployment.yaml
kubectl get pods -n yellowbooks -l app=redis
```

### 2. Generate Embeddings (After seed completes)
Someone needs to run this in a backend pod:
```bash
# Get backend pod
kubectl get pods -n yellowbooks -l app=backend

# Run embedding generation
kubectl exec -n yellowbooks <backend-pod-name> -- npm run generate-embeddings
```

Or use the remote script:
```powershell
./scripts/generate-embeddings-remote.ps1
```

### 3. Insert Mongolian Data (If seed fails)
Backup method:
```powershell
./scripts/insert-mongolian-data.ps1
```

## 🔍 Verify Deployment

### Check GitHub Actions
https://github.com/Javkhlan42/uploadit/actions

**Look for:**
- ✅ Backend CI/CD - Status: Success
- ✅ Frontend CI/CD - Status: Success

### Check Application (After deployment completes)

**Frontend:**
- https://sharnom.systems:31003/yellow-books/assistant

**Backend API:**
- https://sharnom.systems:31529/api/ai/yellow-books/search

**Test Query:**
```json
POST https://sharnom.systems:31529/api/ai/yellow-books/search
{
  "query": "Улаанбаатарт ресторан"
}
```

## 🎯 Lab 8 Completion Checklist

### Automated (via GitHub Actions)
- [x] Embedding field in Prisma schema
- [x] Migration created and will auto-run
- [x] Seed data will auto-insert (10 Mongolian businesses)
- [x] Backend API with AI search endpoint
- [x] Frontend assistant UI page
- [x] HTTPS endpoint configured

### Manual (Requires kubectl access)
- [ ] Redis deployment (kubectl apply -f k8s/redis-deployment.yaml)
- [ ] Generate embeddings (after data seeded)
- [ ] Verify Redis caching works
- [ ] Test AI search with Mongolian queries

### Testing (After deployment)
- [ ] Visit https://sharnom.systems:31003/yellow-books/assistant
- [ ] Enter query: "Хаан банкны хаяг"
- [ ] Verify AI response appears
- [ ] Verify business cards display
- [ ] Check browser console for errors

## 📝 Current Status

**GitHub Push:** ✅ Done (commit 5004e12)  
**Workflows:** 🔄 Running (check link above)  
**Deployment:** ⏳ In Progress  
**Redis:** ❌ Not deployed (needs manual step)  
**Embeddings:** ❌ Not generated (needs manual step)  
**Testing:** ⏳ Waiting for deployment

## 🎉 Expected Result

After all steps complete, users can:

1. Visit: https://sharnom.systems:31003/yellow-books/assistant
2. Ask: "Улаанбаатарт сайн ресторан олох"
3. Get AI-powered answer with business recommendations
4. See business cards for: Өрхөн гоёо and others
5. Results cached in Redis for 1 hour

## 🆘 If You Need Manual Deploy

Contact someone with AWS/kubectl access to run:

1. Deploy Redis:
   ```bash
   kubectl apply -f k8s/redis-deployment.yaml
   ```

2. Generate embeddings:
   ```powershell
   ./scripts/generate-embeddings-remote.ps1
   ```

3. Verify everything:
   ```powershell
   kubectl get pods -n yellowbooks
   kubectl logs -n yellowbooks job/prisma-migrate
   ```

## 📚 Documentation

- **Deployment Guide:** scripts/DEPLOYMENT.md
- **Testing Guide:** scripts/LAB8-TESTING.md
- **Completion Status:** LAB8-COMPLETION.md
