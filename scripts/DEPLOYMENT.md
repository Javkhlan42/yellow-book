# Lab 8 Deployment Guide

## Өгөгдлийн санд монгол өгөгдөл нэмэх

### Автомат deploy (GitHub Actions ашиглах)

1. **Кодыг push хийх:**
   ```bash
   git push origin main
   ```

2. **GitHub Actions автоматаар:**
   - Backend build хийнэ
   - Docker image үүсгэнэ
   - Kubernetes-т deploy хийнэ
   - Migration job ажиллуулна
   - Seed өгөгдөл (монгол бизнесүүд) нэмэгдэнэ

3. **Workflow статус шалгах:**
   - https://github.com/Javkhlan42/uploadit/actions

### Гараар deploy хийх (AWS CloudShell дээр)

Хэрэв AWS credentials байгаа бол:

#### Windows PowerShell:
```powershell
cd 'C:\Users\user\Desktop\web ahisan\yellow-book'
.\scripts\deploy-lab8.ps1
```

#### Linux/Mac/AWS CloudShell:
```bash
cd yellow-book
chmod +x scripts/deploy-lab8.sh
./scripts/deploy-lab8.sh
```

### Deployment жагсаалт:

1. ✅ **Secrets нэмэх** (OpenAI API key, Redis URL)
   ```bash
   kubectl apply -f k8s/secrets.yaml
   ```

2. ✅ **Redis deploy**
   ```bash
   kubectl apply -f k8s/redis-deployment.yaml
   ```

3. ✅ **Backend restart** (шинэ secrets-тэй)
   ```bash
   kubectl rollout restart deployment/backend -n yellowbooks
   ```

4. ✅ **Migration + Seed** (автомат)
   ```bash
   kubectl apply -f k8s/migration-job.yaml
   kubectl logs -f job/prisma-migrate -n yellowbooks
   ```

5. ✅ **Embeddings үүсгэх** (хэрэв migration-д ороогүй бол)
   ```powershell
   .\scripts\generate-embeddings-remote.ps1
   ```

## Шалгах

### Pods статус:
```bash
kubectl get pods -n yellowbooks
```

Үр дүн:
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxx                 1/1     Running   0          2m
frontend-xxx                1/1     Running   0          5m
postgres-xxx                1/1     Running   0          1d
redis-xxx                   1/1     Running   0          2m
```

### Migration logs:
```bash
kubectl logs job/prisma-migrate -n yellowbooks
```

Үр дүн:
```
Migration done!
Seeding...
✅ Created 10 businesses
Seeding complete!
```

### Redis шалгах:
```bash
kubectl exec -it deployment/redis -n yellowbooks -- redis-cli
> KEYS "ai-search:*"
> GET "ai-search:улаанбаатарт сайн ресторан"
> EXIT
```

### Database өгөгдөл шалгах:
```bash
kubectl exec -it deployment/postgres -n yellowbooks -- psql -U yellowbooks_user -d yellowbooks -c "SELECT business_name, category, city FROM yellow_books;"
```

## AI Assistant тест хийх

1. **Вэб хуудас нээх:**
   - http://sharnom.systems:31003/yellow-books/assistant

2. **Монгол хэлээр асуух:**
   - "Улаанбаатарт сайн ресторан олох"
   - "Хаан банкны хаяг"
   - "Зочид буудлын жагсаалт"

3. **Browser console шалгах:**
   - F12 дараад Console tab
   - 404 алдаа байхгүй байх ёстой
   - API хариулт 200 OK байх ёстой

## Өгөгдлийн сангийн бүтэц

### Монгол бизнесүүд (10):
1. Хаан банк (Санхүү)
2. Шангри-Ла зочид буудал (Зочид буудал)
3. Номин супермаркет (Худалдаа)
4. Enerelt сургууль (Боловсрол)
5. Сонгдо эмнэлэг (Эрүүл мэнд)
6. MCS coca cola (Үйлдвэрлэл)
7. Өрхөн гоёо (Ресторан)
8. Модерн номын дэлгүүр (Худалдаа)
9. Sky resort (Амралт, Дархан)
10. Эрдэнэт техникийн их сургууль (Боловсрол, Эрдэнэт)

## Алдаа гарвал

### Backend pod crash:
```bash
kubectl describe pod -l app=backend -n yellowbooks
kubectl logs -l app=backend -n yellowbooks --previous
```

### Migration job fail:
```bash
kubectl describe job prisma-migrate -n yellowbooks
kubectl logs job/prisma-migrate -n yellowbooks
kubectl delete job prisma-migrate -n yellowbooks
kubectl apply -f k8s/migration-job.yaml
```

### OpenAI API алдаа:
```bash
# API key шалгах
kubectl get secret yellowbooks-secrets -n yellowbooks -o jsonpath='{.data.OPENAI_API_KEY}' | base64 -d
```

### Redis холболт алдаа:
```bash
kubectl get svc -n yellowbooks | grep redis
kubectl exec -it deployment/redis -n yellowbooks -- redis-cli PING
```

## Хөгжүүлэлтийн орчин (Local)

Local хөгжүүлэхийн тулд PostgreSQL ажиллуулах:

```bash
# Docker ашиглах
docker run -d \
  --name postgres-yellowbooks \
  -e POSTGRES_USER=yellowbooks_user \
  -e POSTGRES_PASSWORD=YellowBooks2024!Secure \
  -e POSTGRES_DB=yellowbooks \
  -p 5432:5432 \
  postgres:15

# Redis
docker run -d \
  --name redis-yellowbooks \
  -p 6379:6379 \
  redis:7-alpine

# Migration + Seed
npm run db:migrate
npm run db:seed

# Embeddings generate
npm run generate-embeddings
```

## CI/CD Workflow

Backend push хийхэд автоматаар:
1. ✅ ESLint шалгана
2. ✅ Tests ажиллуулна
3. ✅ Docker image build хийнэ
4. ✅ ECR-рүү push хийнэ
5. ✅ Kubernetes deployment update хийнэ
6. ✅ Migration job ажиллуулна

GitHub Actions: https://github.com/Javkhlan42/uploadit/actions
