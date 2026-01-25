# Fix 404 Error on Product Page

## ✅ Fixed Issue #1: Wrong API Endpoint

**Problem**: Frontend was calling wrong endpoint for product by slug
- Frontend was calling: `/api/products/{slug}`
- Backend expects: `/api/products/slug/{slug}`

**Solution**: ✅ FIXED
Updated [ayurveda-shop/app/actions/products.ts:77](ayurveda-shop/app/actions/products.ts#L77)
```typescript
// Before (wrong):
const url = `${BACKEND_URL}/api/products/${slug}`;

// After (correct):
const url = `${BACKEND_URL}/api/products/slug/${slug}`;
```

## ⚠️ Issue #2: PostgreSQL Not Running

**Problem**: Backend can't fetch products because database is stopped

**Error in backend**:
```
PrismaClientInitializationError: Can't reach database server at `localhost:5432`
```

**Solution**: Start PostgreSQL

### Option 1: Windows Service (Recommended)
```bash
# Open Command Prompt as Administrator
net start postgresql-x64-17
```

### Option 2: Docker
```bash
# Start Docker Desktop first, then:
cd backend
docker-compose up -d postgres
```

## Complete Fix Steps

1. ✅ **API Endpoint Fixed** - Frontend now calls correct endpoint

2. **Start PostgreSQL**:
   ```bash
   # Run as Administrator
   net start postgresql-x64-17
   ```

3. **Backend Will Auto-Connect**:
   - NestJS server is already running in watch mode
   - Once PostgreSQL starts, it will automatically connect
   - You'll see: "Starting Nest application..." without errors

4. **Create Sample Product** (Optional - for testing):
   ```sql
   -- Connect to PostgreSQL
   psql -U postgres -d ayurveda_admin

   -- Insert sample product
   INSERT INTO products (
     id, sku, name, slug, description, short_description,
     price, status, category, created_at, updated_at
   )
   VALUES (
     gen_random_uuid(),
     'AYUR-001',
     'Ashwagandha Powder',
     'ashwagandha-powder',
     'Premium organic ashwagandha powder for stress relief and wellness',
     'Premium organic ashwagandha',
     29.99,
     'ACTIVE',
     'Supplements',
     NOW(),
     NOW()
   );
   ```

5. **Test Product Page**:
   - Visit: `http://localhost:3000/product/ashwagandha-powder`
   - Should load without 404 error
   - Should display product details

## Why the 404 Error Happened

1. **Wrong Endpoint**: Frontend called `/api/products/{slug}` which expects UUID, not slug
   - Backend has two endpoints:
     - `/api/products/:id` - Get by UUID (e.g., "123e4567-e89b-12d3-a456-426614174000")
     - `/api/products/slug/:slug` - Get by slug (e.g., "ashwagandha-powder")

2. **Database Not Available**: Even if endpoint was correct, backend couldn't fetch products
   - PostgreSQL stopped
   - NestJS can't query database
   - Returns 404 or 500 errors

## Testing After Fix

### Test 1: Backend Health
```bash
curl http://localhost:3333/actuator/health
```
Expected: `{"status":"ok"}`

### Test 2: Get Products List
```bash
curl http://localhost:3333/api/products
```
Expected: JSON with products array (might be empty if no products in DB)

### Test 3: Get Product by Slug
```bash
curl http://localhost:3333/api/products/slug/ashwagandha-powder
```
Expected: JSON with product details (if product exists)

### Test 4: Frontend Product Page
Visit: `http://localhost:3000/product/ashwagandha-powder`
Expected: Product page loads without 404

## Current Status

| Component | Status | Action Needed |
|-----------|--------|---------------|
| API Endpoint | ✅ Fixed | None |
| PostgreSQL | ⚠️ Stopped | Start service |
| NestJS Backend | ✅ Running | Waiting for DB |
| Frontend | ✅ Ready | None |

## Quick Fix (TL;DR)

Run this in Administrator Command Prompt:
```bash
net start postgresql-x64-17
```

Then refresh the product page. Should work! 🎉

## If Still Getting 404

1. **Check Backend Logs**:
   Look at the terminal where `pnpm run start:dev` is running
   - Should see "Starting Nest application..." without database errors

2. **Check Database Has Products**:
   ```sql
   SELECT slug, name FROM products WHERE status = 'ACTIVE';
   ```

3. **Check Correct Slug**:
   - Make sure the slug in URL matches a product in database
   - Slugs are case-sensitive in some databases

4. **Clear Next.js Cache**:
   ```bash
   cd ayurveda-shop
   rm -rf .next
   npm run dev
   ```

## Backend API Routes Reference

**Public Routes** (no auth):
- GET `/api/products` - List all products
- GET `/api/products/slug/:slug` - Get by slug
- GET `/api/products/:id` - Get by ID

**Protected Routes** (requires JWT):
- POST `/api/products` - Create product (ADMIN/OPS)
- PUT `/api/products/:id` - Update product (ADMIN/OPS)
- DELETE `/api/products/:id` - Delete product (ADMIN only)

All routes are documented at: `http://localhost:3333/api-docs`
