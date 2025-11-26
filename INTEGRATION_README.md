# Yellow Book - Frontend Backend Integration

## Тойм

Энэ төсөл нь Yellow Book бизнесийн жагсаалтын систем бөгөөд JSON файлаас өгөгдөл уншиж, frontend-ийг backend API-тай холбосон.

## Бүтэц

### Backend (API)
- **Технологи**: Express.js, TypeScript
- **Өгөгдөл**: JSON файлууд
- **Port**: 3333

### Frontend (Web)
- **Технологи**: Next.js 13+ (App Router), TypeScript, Tailwind CSS
- **Port**: 4200

## Суулгах

### 1. Dependencies суулгах

```bash
# Root directory-д
npm install

# Эсвэл nx-ээр
npx nx run-many --target=install
```

### 2. Backend өгөгдөл

Backend-ийн өгөгдөл `apps/api/src/data/` фолдерт байршдаг:
- `organizations.json` - Бизнесүүдийн жагсаалт
- `categories.json` - Категориудын жагсаалт

### 3. Environment тохиргоо

Frontend-д `.env.local` файл үүсгэгдсэн:
```
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## Ажиллуулах

### Backend-ийг ажиллуулах

```bash
# Development mode
npx nx serve api

# Эсвэл
cd apps/api
npm start
```

Backend нь http://localhost:3333 дээр ажиллана.

### Frontend-ийг ажиллуулах

```bash
# Development mode
npx nx serve web

# Эсвэл
cd apps/web
npm run dev
```

Frontend нь http://localhost:4200 дээр ажиллана.

### Хоёуланг нь нэгэн зэрэг ажиллуулах

```bash
# Терминалд 2 цонх нээж:

# Цонх 1 - Backend
npx nx serve api

# Цонх 2 - Frontend
npx nx serve web
```

## API Endpoints

### Organizations
- `GET /api/organizations` - Бүх бизнесүүд (filter параметртэй)
  - Query params: `category`, `search`
- `GET /api/organizations/featured` - Featured бизнесүүд
- `GET /api/organizations/:id` - Тодорхой бизнес

### Categories
- `GET /api/categories` - Бүх категориуд

### Yellow Books (Prisma)
- `GET /api/yellow-books` - Database-аас yellow book бичлэгүүд

## Компонентууд

### Pages
- `/` - Homepage (Featured businesses, search, categories)
- `/directory` - Full directory with search and filters
- `/organization/[id]` - Organization details page

### Components
- `Header` - Navigation
- `Homepage` - Landing page
- `Directory` - Business listing page
- `OrganizationCard` - Business card component
- `OrganizationDetails` - Business detail view
- `SearchBar` - Search input
- `CategoryFilter` - Category selection

### Services
- `organizationService` - API холбогч сервис

### Types
- `Organization` - Бизнесийн type definition

## Онцлог шинж чанарууд

1. **Backend Integration**: JSON файлаас өгөгдөл уншиж REST API-аар өгөх
2. **Search & Filter**: Бизнесүүдийг нэр, тайлбар, категориор хайх
3. **Featured Businesses**: Онцлох бизнесүүдийг homepage дээр харуулах
4. **Responsive Design**: Бүх төхөөрөмж дээр сайн харагдах
5. **Next.js App Router**: Орчин үеийн Next.js бүтэц
6. **TypeScript**: Type safety

## Хөгжүүлэлт

### Шинэ бизнес нэмэх

`apps/api/src/data/organizations.json` файлд шинэ объект нэмнэ:

```json
{
  "id": 7,
  "name": "Business Name",
  "category": "Category",
  "description": "Short description",
  "fullDescription": "Full description",
  "phone": "(555) 123-4567",
  "email": "email@example.com",
  "address": "Full address",
  "website": "www.example.com",
  "logo": "🏢",
  "featured": false,
  "services": ["Service 1", "Service 2"],
  "socialLinks": {
    "facebook": "facebook.com/page",
    "twitter": "twitter.com/page"
  },
  "hours": "Mon-Fri 9AM-5PM"
}
```

### Шинэ категори нэмэх

`apps/api/src/data/categories.json` файлд нэмнэ:

```json
[
  "All Categories",
  "Existing Category",
  "New Category"
]
```

## Алдаа засах

### Backend холбогдохгүй бол
1. Backend ажиллаж байгааг шалгах: http://localhost:3333/api
2. CORS тохиргоо зөв эсэхийг шалгах
3. `.env.local` файл зөв эсэхийг шалгах

### Өгөгдөл харагдахгүй бол
1. JSON файлууд зөв эсэхийг шалгах
2. Browser console-д алдаа байгаа эсэхийг шалгах
3. Network tab-д API request амжилттай явж байгаа эсэхийг шалгах

## Цаашдын хөгжүүлэлт

- [ ] Database integration (Prisma-тай бүрэн холбох)
- [ ] Хэрэглэгчийн authentication
- [ ] Reviews & ratings системб
- [ ] Map integration
- [ ] Image upload
- [ ] Admin dashboard
- [ ] Email notifications

## Лиценз

MIT
