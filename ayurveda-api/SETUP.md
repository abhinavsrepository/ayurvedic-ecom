# Ayurveda API Setup Guide

## Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **Docker Desktop** - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
3. **npm** (comes with Node.js)

## Quick Start

### Option 1: Automated Setup (Windows)

Double-click `setup.bat` or run it from Command Prompt:
```cmd
setup.bat
```

This will:
1. Start PostgreSQL and Redis in Docker
2. Install Node.js dependencies
3. Run Prisma migrations
4. Generate Prisma Client

### Option 2: Manual Setup

#### Step 1: Start Database Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Check if containers are running
docker-compose ps
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Setup Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

#### Step 4: Seed Database (Optional)

```bash
# If you have seed data
npx prisma db seed
```

#### Step 5: Start the Server

```bash
# Development mode (with hot reload)
npm run start:dev

# Or production mode
npm run build
npm run start:prod
```

## Verification

The API should now be running at:
- API: http://localhost:3333
- Prisma Studio (DB GUI): http://localhost:5555 (run `npx prisma studio`)

## Troubleshooting

### Error: "Authentication failed against database server"

**Cause:** PostgreSQL is not running or credentials are wrong

**Fix:**
```bash
# Stop and remove old containers
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait a few seconds for PostgreSQL to initialize, then run migrations
npx prisma migrate dev
```

### Error: "Database does not exist"

**Fix:**
```bash
# Create database manually
docker exec -it ayurveda-postgres psql -U postgres -c "CREATE DATABASE ayurveda_admin;"

# Then run migrations
npx prisma migrate dev
```

### Error: "Port already in use"

**Fix:** Change the port in `docker-compose.yml`:
```yaml
ports:
  - "5434:5432"  # Use a different port
```

And update `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/ayurveda_admin
```

### Reset Everything

```bash
# Stop containers and remove volumes
docker-compose down -v

# Remove node_modules
rmdir /s /q node_modules

# Start fresh
setup.bat
```

## Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Access PostgreSQL CLI
docker exec -it ayurveda-postgres psql -U postgres -d ayurveda_admin

# Access Redis CLI
docker exec -it ayurveda-redis redis-cli
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | postgresql://postgres:postgres@localhost:5434/ayurveda_admin | PostgreSQL connection |
| `JWT_SECRET` | (required) | JWT signing key |
| `JWT_REFRESH_SECRET` | (required) | JWT refresh token key |
| `PORT` | 3333 | API server port |
| `REDIS_HOST` | localhost | Redis host |
| `REDIS_PORT` | 6379 | Redis port |

## Next Steps

1. Set up the frontend: See `../ayurveda-shop/README.md`
2. Configure payment gateways in `.env`
3. Set up SSL certificates for production
