# Yellow Book - Test Script

## Backend Test

### 1. API эхлүүлэх
```powershell
npx nx serve api
```

### 2. API шалгах (өөр терминал дээр)
```powershell
# Health check
curl http://localhost:3333/api

# Бүх байгууллагууд
curl http://localhost:3333/api/organizations

# Featured байгууллагууд
curl http://localhost:3333/api/organizations/featured

# Нэг байгууллага
curl http://localhost:3333/api/organizations/1

# Категориуд
curl http://localhost:3333/api/categories

# Хайлтаар
curl "http://localhost:3333/api/organizations?search=medical"

# Категориор
curl "http://localhost:3333/api/organizations?category=Healthcare"

# Хоёулаар
curl "http://localhost:3333/api/organizations?category=Restaurants&search=italian"
```

## Frontend Test

### 1. Frontend эхлүүлэх (Backend ажиллаж байхаар)
```powershell
npx nx serve web
```

### 2. Browser дээр шалгах
1. Homepage харах: http://localhost:4200
2. Directory харах: http://localhost:4200/directory
3. Organization details харах: http://localhost:4200/organization/1

### 3. Функц шалгах
- [ ] Homepage load болж байна уу
- [ ] Featured businesses харагдаж байна уу
- [ ] Search bar ажиллаж байна уу
- [ ] Category filter ажиллаж байна уу
- [ ] Directory page руу очиж байна уу
- [ ] Organization card дарахад details page нээгдэж байна уу
- [ ] Back to directory товч ажиллаж байна уу
- [ ] Contact links (phone, email, website) ажиллаж байна уу

## PowerShell Commands

### Хоёр Terminal-тай ажиллах
```powershell
# Terminal 1 - Backend
cd "C:\Users\user\Desktop\web ahisan\yellow-book"
npx nx serve api

# Terminal 2 - Frontend
cd "C:\Users\user\Desktop\web ahisan\yellow-book"
npx nx serve web
```

### Нэг терминалд хоёуланг нь ажиллуулах (concurrently суусан бол)
```powershell
npm run dev
```

## Алдаа засах checklist

### Backend алдаа
- [ ] Node.js суусан эсэх: `node --version`
- [ ] Dependencies суусан эсэх: `npm install`
- [ ] JSON файлууд байгаа эсэх: `apps/api/src/data/organizations.json`
- [ ] Port 3333 чөлөөтэй эсэх
- [ ] TypeScript compile болж байгаа эсэх

### Frontend алдаа
- [ ] Next.js dependencies суусан эсэх
- [ ] .env.local файл байгаа эсэх
- [ ] Backend ажиллаж байгаа эсэх
- [ ] CORS алдаа байгаа эсэх (browser console шалгах)
- [ ] Port 4200 чөлөөтэй эсэх

### Network алдаа
- [ ] Backend доступны эсэх: http://localhost:3333/api
- [ ] CORS headers зөв байгаа эсэх
- [ ] Browser Network tab-д 200 status эсэх
- [ ] JSON response зөв format эсэх

## Амжилттай тест

Дараах зүйлс ажиллаж байвал амжилттай:
1. ✅ Backend API бүх endpoint хариу өгч байна
2. ✅ Frontend page-үүд load болж байна
3. ✅ Organizations жагсаалт харагдаж байна
4. ✅ Search & filter ажиллаж байна
5. ✅ Navigation (routing) ажиллаж байна
6. ✅ Organization details page харагдаж байна
7. ✅ Contact links ажиллаж байна

## Build & Production

### Production build
```powershell
# Backend build
npx nx build api

# Frontend build
npx nx build web
```

### Production run
```powershell
# Backend
cd apps/api/dist
node main.js

# Frontend
cd apps/web
npm start
```
