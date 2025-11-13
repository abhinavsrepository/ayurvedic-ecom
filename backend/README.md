# Ayurveda Shop - Admin Backend API

Enterprise-grade Spring Boot 3.2 backend for the Ayurveda Shop admin portal.

## ✅ What's Been Created

### Core Application
- ✅ Main Spring Boot Application class
- ✅ Multi-module Gradle structure (Kotlin DSL)
- ✅ Application configuration (application.yml)
- ✅ Docker & Docker Compose setup

### Domain Layer (JPA Entities)
- ✅ User (with 2FA support)
- ✅ Role (ADMIN, OPS, FINANCE, MARKETING)
- ✅ Product
- ✅ Stock
- ✅ Customer
- ✅ Order & OrderItem
- ✅ AuditEvent

### Security
- ✅ JWT authentication (access + refresh tokens)
- ✅ Custom UserDetailsService
- ✅ JWT Authentication Filter
- ✅ Security Configuration with CORS
- ✅ Google Authenticator for 2FA
- ✅ Role-based access control (RBAC)

### Data Access Layer
- ✅ UserRepository
- ✅ ProductRepository
- ✅ OrderRepository
- ✅ Flyway migration (V1__initial_schema.sql)

### Service Layer
- ✅ AuthService (login, logout, 2FA, refresh tokens)
- ✅ ProductService (CRUD operations)
- ✅ OrderService (list, detail, status updates, refunds)

### REST Controllers
- ✅ AuthController (`/api/auth/*`)
- ✅ ProductController (`/api/products/*`)
- ✅ OrderController (`/api/orders/*`)

### DTOs
- ✅ Login/Auth DTOs
- ✅ Product DTOs (Create, Update, Response)
- ✅ Order DTOs (List, Detail, Status Update, Refund)
- ✅ User Profile DTOs

### Infrastructure
- ✅ Dockerfile (multi-stage build)
- ✅ docker-compose.yml (Postgres, Redis, Python ML service)
- ✅ Database migrations

## 🚀 Quick Start

### Prerequisites
- Java 21
- Docker & Docker Compose

### Run Locally

```bash
cd backend

# Start infrastructure
docker-compose up -d postgres redis

# Run application
./gradlew :apps:api:bootRun
```

The API will be available at: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui.html

## 📡 Available Endpoints

### Authentication
```
POST   /api/auth/login          - Login with username/password
POST   /api/auth/refresh        - Refresh access token
POST   /api/auth/logout         - Logout
GET    /api/auth/me             - Get current user profile
POST   /api/auth/2fa/enable     - Enable 2FA (TOTP)
POST   /api/auth/2fa/verify     - Verify 2FA code
DELETE /api/auth/2fa/disable    - Disable 2FA
```

### Products
```
GET    /api/products                      - List products (paginated)
GET    /api/products/{id}                 - Get product details
POST   /api/products                      - Create product
PUT    /api/products/{id}                 - Update product
DELETE /api/products/{id}                 - Delete product (soft)
POST   /api/products/bulk-import          - Bulk import from CSV
GET    /api/products/export/csv           - Export to CSV
POST   /api/products/{id}/media           - Get presigned upload URL
```

### Orders
```
GET    /api/orders                - List orders (filtered, paginated)
GET    /api/orders/{id}           - Get order details
PATCH  /api/orders/{id}/status    - Update order status
POST   /api/orders/{id}/refund    - Process refund
GET    /api/orders/export/csv     - Export to CSV
```

## 🔐 Security Features

- **JWT**: Access tokens (15min) + Refresh tokens (7 days)
- **2FA**: TOTP-based two-factor authentication
- **RBAC**: Role-based access control
- **Password**: BCrypt hashing (12 rounds)
- **CORS**: Whitelist-based configuration
- **Security Headers**: XSS, CSP, HSTS, Frame Options
- **Audit Trail**: Hibernate Envers for entity versioning

## 🗄️ Database

PostgreSQL 15 with Flyway migrations.

**Default credentials** (change in production):
- Host: localhost:5432
- Database: ayurveda_admin
- User: postgres
- Password: postgres

## 📦 Tech Stack

- **Java 21** with Spring Boot 3.2.5
- **Spring Security 6** with JWT
- **PostgreSQL 15** + Flyway
- **Redis 7** for caching
- **Hibernate** with Envers audit
- **Lombok** for boilerplate reduction
- **SpringDoc OpenAPI** for API docs
- **Docker** & Docker Compose

## 🛠️ Build & Test

```bash
# Build
./gradlew build

# Run tests
./gradlew test

# Format code
./gradlew spotlessApply

# Build Docker image
docker build -t ayurveda-admin-api:latest .
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/ayurveda_admin` |
| `DATABASE_USERNAME` | Database user | `postgres` |
| `DATABASE_PASSWORD` | Database password | `postgres` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret (min 256-bit) | - |
| `ADMIN_UI_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🔄 What's Next?

To complete the backend, you still need:

1. **More Controllers**: KPIs, Customers, Inventory, Analytics, ML endpoints
2. **WebSocket**: Real-time order updates via STOMP
3. **ML Services**: Java-side (anomaly, forecast) + Python gRPC integration
4. **Mock Data Seeder**: 200 products, 1000 customers, 5000 orders
5. **Exception Handlers**: Global exception handling
6. **Test Suite**: Unit + Integration tests with Testcontainers
7. **GitHub Actions**: CI/CD workflow
8. **Additional Entities**: Segment, Coupon, Experiment, Notification

## 📞 Support

For issues or questions, check the generated Java files in:
- `backend/apps/api/src/main/java/com/ayur/admin/`

---

**Built with ❤️ using Spring Boot 3.2 & Java 21**
