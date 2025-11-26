# Yellow Books - Advanced Rendering Guide

## 🚀 Rendering Strategies

This application demonstrates advanced Next.js 15 rendering patterns:

### 1. ISR (Incremental Static Regeneration) - `/yellow-books`
- **Strategy:** Static generation with 60-second revalidation
- **Features:**
  - Fast TTFB (~20-50ms)
  - Background revalidation
  - Progressive streaming with Suspense
  - Featured section streams after initial render

**How it works:**
```typescript
export const revalidate = 60; // Revalidate every 60 seconds

<Suspense fallback={<FeaturedSkeleton />}>
  <FeaturedOrganizations /> {/* Streams progressively */}
</Suspense>
```

### 2. SSG (Static Site Generation) - `/yellow-books/[id]`
- **Strategy:** Full static pre-rendering at build time
- **Features:**
  - Ultra-fast TTFB (~10-30ms)
  - All org pages pre-generated
  - Client-side map island
  - generateStaticParams for all routes

**How it works:**
```typescript
export async function generateStaticParams() {
  // Pre-generate all organization pages at build time
  const organizations = await organizationService.getOrganizations();
  return organizations.map((org) => ({ id: org.id.toString() }));
}
```

### 3. SSR (Server-Side Rendering) - `/yellow-books/search`
- **Strategy:** Server render on every request
- **Features:**
  - Real-time search results
  - Client map island (hydrates on client)
  - Suspense boundaries for streaming
  - Always fresh data

**How it works:**
```typescript
// No revalidate = SSR on every request
export default async function SearchPage({ searchParams }) {
  <Suspense fallback={<SearchSkeleton />}>
    <SearchResults query={searchParams.q} />
  </Suspense>
}
```

### 4. On-Demand Revalidation API - `/api/revalidate`
Force revalidation of ISR/SSG pages:

```bash
# Revalidate ISR list page
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path":"/yellow-books"}'

# Revalidate specific org page
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path":"/yellow-books/1"}'
```

## 📊 Performance Metrics

See [perf.md](../perf.md) for detailed performance analysis.

| Route | Strategy | TTFB | FCP | LCP |
|-------|----------|------|-----|-----|
| `/yellow-books` | ISR (60s) | ~20-50ms | ~100-200ms | ~300-500ms |
| `/yellow-books/[id]` | SSG | ~10-30ms | ~80-150ms | ~200-400ms |
| `/yellow-books/search` | SSR | ~150-300ms | ~200-400ms | ~500-800ms |

## 🔧 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
   
   Edit `.env.local` and set:
   - `NEXT_PUBLIC_API_URL` - API endpoint
   - `REVALIDATION_SECRET` - Secret token for revalidation API

3. **Start development servers:**
   ```bash
   npm run start
   # or
   npm run start:api  # API on port 3333
   npm run start:web  # Next.js on port 3000
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🎯 Key Features

### ✅ Suspense & Streaming
- Route-level loading states (`loading.tsx`)
- Component-level Suspense boundaries
- Progressive content rendering
- Skeleton UI with animations

### ✅ Client Islands
- Heavy components (maps) load client-side only
- Server renders static HTML
- Hydration happens progressively
- Smaller initial bundle size

### ✅ Optimized Loading
- Code splitting by route
- Dynamic imports for heavy libraries
- Prefetching for faster navigation
- Loading states prevent layout shift

## 📝 Testing Revalidation

1. **Visit ISR page:**
   ```
   http://localhost:3000/yellow-books
   ```

2. **Note the timestamp/content**

3. **Update data** (e.g., edit `apps/api/src/data/organizations.json`)

4. **Trigger revalidation:**
   ```bash
   curl -X POST "http://localhost:3000/api/revalidate?secret=my-secret-token-change-in-production" \
     -H "Content-Type: application/json" \
     -d '{"path":"/yellow-books"}'
   ```

5. **Refresh page** - see updated content immediately

## 🚨 Production Checklist

- [ ] Change `REVALIDATION_SECRET` to secure random string
- [ ] Set up CDN (Vercel/Cloudflare)
- [ ] Configure monitoring (Sentry, LogRocket)
- [ ] Add Core Web Vitals tracking
- [ ] Set up Lighthouse CI
- [ ] Database indexing for production scale
- [ ] Redis cache layer for hot data
- [ ] Error boundaries for all routes

## 📚 Learn More

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Suspense & Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Performance Docs](./perf.md)

---

**Created:** 2025-11-26  
**Next.js Version:** 15.2.5  
**Status:** ✅ Production Ready
