# Ayurveda Shop Admin Panel Setup Guide

This guide will help you set up and configure the admin panel with full authentication integration between the frontend and backend.

## Architecture Overview

The admin panel consists of:
- **Frontend**: Next.js 14 with App Router (React 18)
- **Backend**: Spring Boot with JWT authentication
- **Database**: PostgreSQL
- **Authentication**: JWT with refresh tokens and optional 2FA

## Prerequisites

1. Node.js 18+ and npm/pnpm
2. Java 17+
3. PostgreSQL 14+
4. Redis (for session management)

## Backend Setup

### 1. Database Configuration

Create a PostgreSQL database:

```bash
createdb ayurveda_admin
```

### 2. Environment Variables

The backend uses `application.yml` for configuration. Update the following:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ayurveda_admin
    username: postgres
    password: postgres

jwt:
  secret: your-secret-key-here-change-in-production-minimum-256-bits-required-for-HS256-algorithm
  access-token-expiration: 900000 # 15 minutes
  refresh-token-expiration: 604800000 # 7 days

app:
  cors:
    allowed-origins: http://localhost:3000
```

### 3. Run Database Migrations

Flyway migrations will run automatically when you start the backend.

### 4. Create Admin User

Connect to your database and create an admin user:

```sql
-- Insert admin role
INSERT INTO roles (name, description) VALUES ('ROLE_ADMIN', 'Administrator role');

-- Insert admin user (password is 'admin123' - change this!)
INSERT INTO users (username, email, full_name, password, enabled, two_fa_enabled)
VALUES ('admin', 'admin@ayurveda.com', 'Admin User',
        '$2a$10$YourBcryptHashedPasswordHere', true, false);

-- Assign admin role to user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';
```

**Note**: Use BCrypt to hash your password. You can use online tools or this Java code:
```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode("admin123");
```

### 5. Start the Backend

```bash
cd backend
./gradlew bootRun
```

The API will be available at `http://localhost:8080`

### 6. Verify Backend

Test the authentication endpoint:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

You should receive a JWT token in the response.

## Frontend Setup

### 1. Install Dependencies

```bash
cd ayurveda-shop
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `ayurveda-shop` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Ayurveda Shop Admin
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_2FA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 3. Start the Frontend

```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## Admin Panel Access

1. Navigate to `http://localhost:3000/admin/login`
2. Enter your credentials:
   - **Username**: admin
   - **Password**: admin123 (or whatever you set)
3. If 2FA is enabled, enter the 6-digit code from your authenticator app

## Features

### Authentication
- ✅ JWT-based authentication with refresh tokens
- ✅ Secure token storage in localStorage
- ✅ Automatic token refresh on expiry
- ✅ Protected routes with role-based access control
- ✅ Optional two-factor authentication (TOTP)

### API Integration
- ✅ Centralized API client with interceptors
- ✅ Automatic error handling and retry logic
- ✅ Type-safe API calls with TypeScript
- ✅ Request/response logging

### Admin Features
- ✅ Dashboard with real-time statistics
- ✅ Product management (CRUD operations)
- ✅ Order management and tracking
- ✅ Customer management
- ✅ Inventory management
- ✅ Analytics and reporting
- ✅ User profile and settings

## File Structure

```
ayurveda-shop/
├── app/
│   └── admin/
│       ├── layout.tsx           # Admin layout with nav
│       ├── page.tsx              # Dashboard
│       ├── login/
│       │   └── page.tsx         # Login page
│       ├── products/
│       │   └── page.tsx         # Products management
│       └── orders/
│           └── page.tsx         # Orders management
├── components/
│   └── admin/
│       └── ProtectedRoute.tsx   # Route protection
├── contexts/
│   └── AdminAuthContext.tsx     # Authentication state
├── lib/
│   └── api/
│       ├── client.ts            # API client
│       ├── types.ts             # TypeScript types
│       ├── auth.ts              # Auth endpoints
│       ├── products.ts          # Products endpoints
│       ├── orders.ts            # Orders endpoints
│       └── customers.ts         # Customers endpoints
└── .env.local                   # Environment config
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `DELETE /api/auth/2fa/disable` - Disable 2FA

### Products
- `GET /api/products` - List products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search` - Search products

### Orders
- `GET /api/orders` - List orders (paginated)
- `GET /api/orders/{id}` - Get order by ID
- `PATCH /api/orders/{id}/status` - Update order status
- `POST /api/orders/{id}/refund` - Process refund

### Customers
- `GET /api/customers` - List customers (paginated)
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/search` - Search customers

## Security Considerations

1. **Change Default Credentials**: Immediately change the default admin password
2. **JWT Secret**: Use a strong, randomly generated secret for JWT signing
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Configure CORS to only allow your frontend domain
5. **Rate Limiting**: Backend has rate limiting enabled
6. **2FA**: Enable two-factor authentication for admin users
7. **Token Expiry**: Keep access token expiry short (15 minutes recommended)

## Troubleshooting

### CORS Errors
If you see CORS errors, verify:
1. Backend `application.yml` has correct `allowed-origins`
2. Frontend `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Authentication Fails
1. Check backend logs for errors
2. Verify database contains user with correct password hash
3. Ensure JWT secret is properly configured
4. Check browser console for detailed error messages

### Token Refresh Issues
1. Verify refresh token is being stored in localStorage
2. Check token expiry times in backend config
3. Ensure refresh endpoint is accessible

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check database credentials in `application.yml`
3. Ensure database exists and migrations have run

## Development Tips

1. **API Testing**: Use the Swagger UI at `http://localhost:8080/swagger-ui.html`
2. **Database Inspection**: Use tools like pgAdmin or DBeaver
3. **Token Debugging**: Use jwt.io to decode and inspect JWT tokens
4. **Network Debugging**: Use browser DevTools Network tab to inspect API calls

## Production Deployment

### Backend
1. Set strong JWT secret via environment variable
2. Configure proper database with backups
3. Enable HTTPS
4. Set up proper logging and monitoring
5. Configure Redis for session management
6. Set up proper error tracking (Sentry is configured)

### Frontend
1. Build the Next.js app: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Configure environment variables in deployment platform
4. Enable proper caching headers
5. Set up CDN for static assets

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs at `backend/logs/`
3. Check frontend console for errors
4. Review API documentation at `/swagger-ui.html`

## License

Copyright © 2024 Ayurveda Shop. All rights reserved.
