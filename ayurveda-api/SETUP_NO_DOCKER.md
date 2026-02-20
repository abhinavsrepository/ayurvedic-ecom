# Setup Without Docker

This guide shows you how to run the Ayurveda API using your local PostgreSQL installation instead of Docker.

## Prerequisites

1. **PostgreSQL** installed and running
   - Download from: https://www.postgresql.org/download/windows/
   - Default port: 5432 or 5433

2. **Node.js** v18+ and npm/pnpm

3. **Redis** (optional - for caching)
   - Download from: https://github.com/microsoftarchive/redis/releases
   - Or skip caching by leaving REDIS_HOST empty

## Quick Setup

### Option 1: Automated Setup Script

```bash
setup-local-db.bat
```

This will:
- Detect your PostgreSQL installation
- Create the `ayurveda_admin` database
- Update your `.env` file automatically

### Option 2: Manual Setup

1. **Create the database:**
   Open pgAdmin 4 or psql and run:
   ```sql
   CREATE DATABASE ayurveda_admin;
   ```

2. **Update `.env` file:**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5433/ayurveda_admin
   ```

3. **Disable Redis (optional):**
   ```env
   REDIS_HOST=
   REDIS_PORT=
   ```

## Apply Database Schema

```bash
# Push Prisma schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Start the API

```bash
npm run start:dev
```

## Verifying the Setup

1. **Check database connection:**
   ```bash
   npx prisma migrate status
   ```

2. **Test API:**
   Visit: http://localhost:3333/api/health

## Troubleshooting

### "password authentication failed"
- Make sure you entered the correct postgres password in `.env`
- Check pgAdmin 4 to reset the password if needed

### "database does not exist"
```bash
# Create manually
psql -U postgres -c "CREATE DATABASE ayurveda_admin;"
```

### Port issues
- PostgreSQL 18 runs on port 5433 by default
- PostgreSQL 17 runs on port 5432 by default
- Update `.env` accordingly

### Redis errors (if not installed)
Leave these empty in `.env`:
```env
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```

The app will work without Redis (caching will be disabled).

## Switching Back to Docker (Optional)

If you want to use Docker again:

```bash
# Use Docker config
copy .env.docker .env

# Start containers
docker-compose up -d
```
