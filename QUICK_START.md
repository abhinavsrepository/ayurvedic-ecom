# Quick Start Guide - Admin Panel

## What Was Built

A complete admin panel with authentication that connects your Next.js frontend to the Spring Boot backend.

## Files Created

### API Layer (`ayurveda-shop/lib/api/`)
- `client.ts` - HTTP client with JWT authentication
- `types.ts` - TypeScript type definitions
- `auth.ts` - Authentication API calls
- `products.ts` - Product management API
- `orders.ts` - Order management API
- `customers.ts` - Customer management API
- `index.ts` - Exports all API modules

### Authentication (`ayurveda-shop/contexts/`)
- `AdminAuthContext.tsx` - Global authentication state management

### Components (`ayurveda-shop/components/admin/`)
- `ProtectedRoute.tsx` - Route protection wrapper

### Pages (`ayurveda-shop/app/admin/`)
- `login/page.tsx` - Admin login page
- `layout.tsx` - Updated with authentication
- `products/api-integrated-page.tsx` - Products page with backend API

### Configuration
- `.env.local.example` - Environment variables template
- `ADMIN_SETUP.md` - Complete setup guide
- `QUICK_START.md` - This file

## How to Run

### 1. Install Dependencies
```bash
cd ayurveda-shop
npm install
```

### 2. Create Environment File
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Start Backend
```bash
cd backend
./gradlew bootRun
```

Backend runs on: `http://localhost:8080`

### 4. Start Frontend
```bash
cd ayurveda-shop
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 5. Access Admin Panel
Navigate to: `http://localhost:3000/admin/login`

**Default Credentials** (change these!):
- Username: `admin`
- Password: `admin123`

## Features Implemented

✅ JWT authentication with automatic token refresh
✅ Protected admin routes
✅ Role-based access control
✅ Admin login page with 2FA support
✅ User session management
✅ API client with error handling
✅ Products management (full CRUD)
✅ Type-safe API calls
✅ Logout functionality

## Testing the Integration

1. **Login**: Go to `/admin/login` and sign in
2. **Dashboard**: View real-time statistics
3. **Products**: Manage products via backend API
4. **Orders**: View and manage orders
5. **Logout**: Click logout in sidebar

## API Endpoints

All endpoints are prefixed with `http://localhost:8080/api`

### Auth
- POST `/auth/login` - Login
- POST `/auth/logout` - Logout
- POST `/auth/refresh` - Refresh token
- GET `/auth/me` - Get current user

### Products
- GET `/products` - List all (paginated)
- GET `/products/{id}` - Get one
- POST `/products` - Create
- PUT `/products/{id}` - Update
- DELETE `/products/{id}` - Delete

### Orders
- GET `/orders` - List all (paginated)
- GET `/orders/{id}` - Get details
- PATCH `/orders/{id}/status` - Update status

### Customers
- GET `/customers` - List all (paginated)
- GET `/customers/{id}` - Get details

## Common Issues

### "Module not found: axios"
Already fixed! We installed axios.

### CORS errors
Update `backend/apps/api/src/main/resources/application.yml`:
```yaml
app:
  cors:
    allowed-origins: http://localhost:3000
```

### Login fails
1. Check backend is running on port 8080
2. Verify admin user exists in database
3. Check browser console for errors

### Token issues
- Tokens are stored in localStorage
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Clear localStorage if needed: `localStorage.clear()`

## Next Steps

1. **Create Admin User** in database (see ADMIN_SETUP.md)
2. **Test Login** at `/admin/login`
3. **Verify API calls** work in browser DevTools Network tab
4. **Update Products Page** - Replace existing with `api-integrated-page.tsx`
5. **Add Orders Integration** - Similar to products page

## File Structure

```
ayurveda-shop/
├── lib/api/                    # API client & endpoints
├── contexts/                   # Auth state management
├── components/admin/           # Admin components
├── app/admin/
│   ├── login/page.tsx         # Login page
│   ├── layout.tsx             # Layout with auth
│   └── products/              # Products management
└── .env.local                  # Config (create this!)
```

## Security Notes

⚠️ **IMPORTANT**:
- Change default admin password immediately
- Use strong JWT secret in production
- Enable HTTPS in production
- Keep access token expiry short (15 min)
- Consider enabling 2FA for all admin users

## Documentation

For detailed setup instructions, see `ADMIN_SETUP.md`

## Support

Check:
1. Browser console for frontend errors
2. Backend logs for API errors
3. Network tab for API calls
4. `ADMIN_SETUP.md` troubleshooting section
