@echo off
echo ==========================================
echo Database Connection Fix
echo ==========================================
echo.

echo Step 1: Checking current DATABASE_URL...
echo Current URL: %DATABASE_URL%
echo.

echo Step 2: Stopping containers...
docker-compose down
echo.

echo Step 3: Removing old containers and volumes...
docker-compose down -v
docker rm -f ayurveda-postgres ayurveda-redis 2>nul
echo.

echo Step 4: Pruning Docker volumes...
docker volume prune -f
echo.

echo Step 5: Clearing Prisma cache...
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"
if exist "node_modules\@prisma\client" rmdir /s /q "node_modules\@prisma\client"
echo.

echo Step 6: Regenerating Prisma Client...
npx prisma generate
echo.

echo Step 7: Starting fresh containers...
docker-compose up -d
echo.

echo Step 8: Waiting for PostgreSQL...
timeout /t 5 /nobreak >nul
docker exec ayurveda-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo Waiting longer for database...
    timeout /t 5 /nobreak >nul
)

echo Step 9: Creating database...
docker exec ayurveda-postgres psql -U postgres -c "CREATE DATABASE ayurveda_admin;" 2>nul
echo.

echo Step 10: Running migrations...
npx prisma migrate dev --name init
echo.

echo ==========================================
echo Fix Complete! Try starting the API:
echo   npm run start:dev
echo ==========================================
pause
