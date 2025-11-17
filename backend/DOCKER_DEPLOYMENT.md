# Docker Deployment Guide - Ayurveda Admin Backend

## Successfully Deployed! ✅

All services are running in Docker containers and fully operational.

### Services Running

| Service | Container Name | Status | Port | Health |
|---------|---------------|--------|------|--------|
| PostgreSQL | ayur-postgres | ✅ Running | 5432 | Healthy |
| Redis | ayurveda-redis | ✅ Running | 6379 | Healthy |
| API Server | ayurveda-api | ✅ Running | 8080 | Healthy |

### Quick Start Commands

```bash
# Start all services
cd backend
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### API Endpoints Tested & Verified

#### ✅ Health Check
```bash
GET http://localhost:8080/actuator/health
Response: {"status":"UP"}
```

#### ✅ Authentication - Login
```bash
POST http://localhost:8080/api/auth/login
Body: {
  "username": "admin",
  "password": "admin123"
}

Response: {
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "username": "admin",
    "email": "admin@ayurveda.com",
    "fullName": "Admin User",
    "roles": ["ADMIN"],
    "twoFaEnabled": false
  }
}
```

#### ✅ Test Utilities - Password Hash Generator
```bash
GET http://localhost:8080/api/test/hash/{password}
Example: http://localhost:8080/api/test/hash/test123

Response: {
  "plainPassword": "test123",
  "bcryptHash": "$2a$12$u3.cOQ3bviGT4/JU1p8SvOjUD9/5ezImnsFh0XTJ86fCqRg3fuVsy",
  "strength": "12"
}
```

### Default Credentials

```
Username: admin
Password: admin123
Roles: ADMIN
```

### Environment Configuration

The following environment variables are configured in docker-compose.yml:

```yaml
- SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ayurveda_admin?sslmode=disable
- SPRING_DATASOURCE_USERNAME=postgres
- SPRING_DATASOURCE_PASSWORD=postgres
- REDIS_HOST=redis
- REDIS_PORT=6379
- JWT_SECRET=your-secret-key-here-change-in-production-minimum-256-bits-required-for-HS256-algorithm
- ADMIN_UI_URL=http://localhost:3000
```

### Database Migrations

Flyway migrations are automatically applied on startup:
- ✅ V1: Initial schema (users, roles, products, orders, customers, etc.)
- ✅ V2: Audit tables
- ✅ V3: Element collection audit tables
- ✅ V4: Insert admin user with default credentials

### API Endpoints Available

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (requires auth)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `POST /api/auth/2fa/disable` - Disable 2FA

#### Test Endpoints (Development Only)
- `GET /api/test/hash/{password}` - Generate BCrypt hash
- `POST /api/test/verify` - Verify password against hash

#### Actuator (Monitoring)
- `GET /actuator/health` - Health check
- `GET /actuator/info` - Application info
- `GET /actuator/metrics` - Metrics
- `GET /actuator/prometheus` - Prometheus metrics

### Docker Image Details

**Base Image**: eclipse-temurin:17-jre-alpine
**Build Image**: gradle:8.5-jdk17-alpine
**Application**: Spring Boot 3.1.6
**Java Version**: 17

### Network Configuration

All services are connected via the `ayur-net` bridge network:
- Services can communicate using service names (postgres, redis, api)
- External access via localhost ports

### Volumes

Persistent data is stored in Docker volumes:
- `postgres_data` - PostgreSQL database files
- `redis_data` - Redis persistence files

### Health Checks

All services have health checks configured:

**PostgreSQL**: `pg_isready -U postgres` (every 10s)
**Redis**: `redis-cli ping` (every 10s)
**API**: `wget http://localhost:8080/actuator/health` (every 30s, 60s start period)

### Troubleshooting

#### View API logs
```bash
docker-compose logs api
```

#### View all logs
```bash
docker-compose logs
```

#### Restart API service
```bash
docker-compose restart api
```

#### Access PostgreSQL
```bash
docker-compose exec postgres psql -U postgres -d ayurveda_admin
```

#### Access Redis CLI
```bash
docker-compose exec redis redis-cli
```

### Production Considerations

⚠️ **Before deploying to production:**

1. Change default passwords
2. Update JWT_SECRET to a strong random value
3. Remove test endpoints (`/api/test/*`)
4. Configure proper CORS origins
5. Enable HTTPS/TLS
6. Set up proper logging and monitoring
7. Configure backup strategies for database
8. Review and update security configurations

### System Requirements

- Docker Desktop or Docker Engine
- Docker Compose v2.x
- 4GB RAM minimum
- 10GB disk space

### Success Indicators

✅ All containers are running and healthy
✅ Database migrations applied successfully
✅ Admin user created with correct password
✅ JWT authentication working
✅ Health endpoint responding
✅ API accessible on port 8080

## Deployment Complete! 🎉

Your Ayurveda Admin Backend is now running in Docker and ready for development/testing!
