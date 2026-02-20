# Ayurveda API - Quick Start (No Docker)

## ✅ Prerequisites (All Set Up!)
- PostgreSQL 18 running on port 5433 (trust auth enabled)
- Node.js v22+ and npm
- No Docker required!

## 🚀 Start the API

```powershell
cd ayurveda-api
npm run start:dev
```

## 📡 API Endpoints

### Public Endpoints (No Auth Required)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/banners` | GET | Get all banners |
| `/api/banners?position=hero` | GET | Filter banners by position |
| `/api/products` | GET | List all products |
| `/api/products/slug/:slug` | GET | Get product by slug |
| `/api/blog/posts` | GET | List blog posts |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |

### Protected Endpoints (JWT Required)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/me` | GET | Get current user |
| `/api/cart` | GET | Get cart |
| `/api/orders` | POST | Create order |
| `/api/admin/dashboard/stats` | GET | Admin stats |

## 🔧 Environment

Your `.env` file:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ayurveda_admin
PORT=3333
NODE_ENV=development
# Redis disabled - uses in-memory cache
```

## 🧪 Test Commands

```powershell
# Test banners (public)
curl http://localhost:3333/api/banners

# Register a user
curl -X POST http://localhost:3333/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3333/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📚 Documentation
- Swagger UI: http://localhost:3333/api-docs

## 🔄 Restart After Code Changes
The API runs with `--watch` flag, so it auto-restarts on file changes.

To manually restart: `Ctrl+C` then `npm run start:dev`
