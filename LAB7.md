# Lab 7: NextAuth with GitHub OAuth and Role-Based Access Control

## Overview
This lab implements GitHub OAuth authentication using NextAuth with role-based access control (RBAC).

## Features Implemented

### 1. GitHub OAuth Integration
- ✅ NextAuth configured with GitHub provider
- ✅ Session management with Prisma adapter
- ✅ OAuth callback handling

### 2. Database Schema
- ✅ NextAuth models added (User, Account, Session, VerificationToken)
- ✅ `role` column added to User model (default: "user", options: "user" | "admin")
- ✅ Migration created: `20251217121553_add_nextauth_with_roles`

### 3. Seed Data
- ✅ Admin user seeded with email: `javkhlan42@gmail.com`
- ✅ Role: "admin"

### 4. Frontend Guards (SSR)
- ✅ `requireAuth()` - Requires any authenticated user
- ✅ `requireAdmin()` - Requires admin role
- ✅ Automatic redirect to `/api/auth/signin` if not authenticated
- ✅ Automatic redirect to `/unauthorized` if insufficient permissions

### 5. Backend API Guards
- ✅ `validateSession` middleware - Validates NextAuth session tokens
- ✅ `requireAuth` middleware - Requires authenticated request
- ✅ `requireRole(['admin'])` - Requires specific roles
- ✅ `requireAdmin` - Convenience middleware for admin-only routes

### 6. CSRF Protection
- ✅ CSRF token generation and validation
- ✅ Cookie-based token storage
- ✅ Header validation for mutations (POST, PUT, DELETE, PATCH)
- ✅ `/api/csrf-token` endpoint to fetch current token

### 7. Protected Routes
- ✅ `/admin` - Admin dashboard (SSR guard)
- ✅ `/api/admin/dashboard` - Admin API endpoint (API guard)
- ✅ `/api/admin/organizations` - Create organization (API guard + CSRF)

## Setup Instructions

### 1. Create GitHub OAuth App

#### Development:
1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: `YellowBook Local Dev`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Save **Client ID** and **Client Secret**

#### Production:
1. Create another OAuth App for production
2. Fill in:
   - **Application name**: `YellowBook Production`
   - **Homepage URL**: `https://sharnom.systems:31529`
   - **Authorization callback URL**: `https://sharnom.systems:31529/api/auth/callback/github`
3. Save **Client ID** and **Client Secret**

### 2. Configure Environment Variables

#### Local Development (`apps/web/.env.local`):
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
GITHUB_ID=<your-github-client-id>
GITHUB_SECRET=<your-github-client-secret>
DATABASE_URL=postgresql://yellowbooks_user:YellowBooks2024!Secure@localhost:5432/yellowbooks
```

#### Production (Kubernetes Secret):
Update `k8s/secrets.yaml`:
```yaml
stringData:
  NEXTAUTH_URL: "https://sharnom.systems:31529"
  NEXTAUTH_SECRET: "<your-production-secret>"
  GITHUB_ID: "<your-production-github-client-id>"
  GITHUB_SECRET: "<your-production-github-client-secret>"
```

### 3. Run Migration

The migration will run automatically via the migration job in Kubernetes.

Migration file: `prisma/migrations/20251217121553_add_nextauth_with_roles/migration.sql`

### 4. Seed Admin User

Run seed in Kubernetes:
```bash
kubectl exec -it deployment/backend -n yellowbooks -- npm run prisma:seed
```

Or manually create admin user via Prisma Studio or SQL:
```sql
INSERT INTO users (id, email, name, role, email_verified, created_at, updated_at)
VALUES ('admin-001', 'javkhlan42@gmail.com', 'Admin User', 'admin', NOW(), NOW(), NOW());
```

### 5. Deploy to Production

```bash
# Update secrets
kubectl apply -f k8s/secrets.yaml

# Trigger rebuild
git add .
git commit -m "Add NextAuth with GitHub OAuth and RBAC"
git push origin main
```

## Testing

### 1. Test Authentication Flow
1. Go to http://localhost:3000 (or https://sharnom.systems:31529)
2. Click "Sign In" or visit `/auth/signin`
3. Click "Continue with GitHub"
4. Authorize the application
5. You should be redirected back

### 2. Test Admin Access
1. Sign in with admin account (`javkhlan42@gmail.com`)
2. Visit `/admin` - Should see admin dashboard
3. Visit `/api/admin/dashboard` - Should return JSON with user info

### 3. Test Non-Admin Access
1. Sign in with a different GitHub account
2. Visit `/admin` - Should redirect to `/unauthorized`
3. Visit `/api/admin/dashboard` - Should return 403 Forbidden

### 4. Test CSRF Protection
```javascript
// Get CSRF token
const response = await fetch('/api/csrf-token', { credentials: 'include' });
const { csrfToken } = await response.json();

// Use token in mutation
await fetch('/api/admin/organizations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  credentials: 'include',
  body: JSON.stringify({ name: 'Test Org' }),
});
```

## Architecture

### Frontend (Next.js)
- `apps/web/src/lib/auth.ts` - NextAuth configuration
- `apps/web/src/lib/auth-guards.ts` - SSR guards (requireAuth, requireAdmin)
- `apps/web/src/app/api/auth/[...nextauth]/route.ts` - NextAuth route handler
- `apps/web/src/app/admin/page.tsx` - Protected admin page
- `apps/web/src/components/AuthProvider.tsx` - SessionProvider wrapper

### Backend (Express)
- `apps/api/src/middleware/session.middleware.ts` - Session validation
- `apps/api/src/middleware/auth.middleware.ts` - Auth guards
- `apps/api/src/middleware/csrf.middleware.ts` - CSRF protection
- `apps/api/src/main.ts` - Protected routes

### Database (Prisma)
- `prisma/schema.prisma` - User, Account, Session, VerificationToken models
- `prisma/migrations/20251217121553_add_nextauth_with_roles/` - Migration SQL
- `prisma/seed.ts` - Admin user seed

## Security Considerations

1. **NEXTAUTH_SECRET**: Use `openssl rand -base64 32` to generate
2. **CSRF Protection**: Enabled for all mutations
3. **Session Validation**: Backend validates session tokens from cookies
4. **Role-Based Access**: Frontend and backend guards protect admin routes
5. **HTTPS**: Required in production for secure cookies
6. **SameSite Cookies**: Set to 'strict' for CSRF protection

## Troubleshooting

### Issue: "Cannot read property 'role' of undefined"
**Solution**: Ensure session callback in `auth.ts` adds role to session

### Issue: "CSRF token validation failed"
**Solution**: 
- Fetch CSRF token from `/api/csrf-token`
- Include token in `X-CSRF-Token` header
- Ensure `credentials: 'include'` is set

### Issue: "Unauthorized" when accessing admin routes
**Solution**:
- Verify user role in database is 'admin'
- Check session is being loaded correctly
- Run seed script to create admin user

## Next Steps

- [ ] Add more admin pages (users management, organizations CRUD)
- [ ] Implement audit logging for admin actions
- [ ] Add email notifications for new user registrations
- [ ] Implement rate limiting on auth endpoints
- [ ] Add 2FA support

## References

- NextAuth.js: https://next-auth.js.org/
- Prisma Adapter: https://authjs.dev/reference/adapter/prisma
- GitHub OAuth: https://docs.github.com/en/apps/oauth-apps
