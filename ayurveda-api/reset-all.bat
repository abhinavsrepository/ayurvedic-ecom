@echo off
echo ==========================================
echo COMPLETE RESET - Database Fix
echo ==========================================
echo.

REM Kill any running Node processes
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
echo.

echo Step 1: Verify .env file exists...
if not exist ".env" (
    echo ERROR: .env file not found!
    pause
    exit /b 1
)
echo OK - .env file found
echo.

echo Step 2: Show DATABASE_URL...
findstr "DATABASE_URL" .env
echo.

echo Step 3: Stop and remove ALL Docker containers...
docker-compose down -v --remove-orphans
docker rm -f ayurveda-postgres 2>nul
docker rm -f ayurveda-redis 2>nul
echo.

echo Step 4: Remove ALL cached data...
echo Removing Prisma cache...
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"
if exist "node_modules\@prisma" rmdir /s /q "node_modules\@prisma"

echo Removing generated files...
if exist "dist" rmdir /s /q "dist"
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"
echo.

echo Step 5: Reinstall dependencies...
npm install
echo.

echo Step 6: Generate Prisma Client with fresh credentials...
npx prisma generate
echo.

echo Step 7: Start PostgreSQL...
docker-compose up -d postgres
echo.

echo Step 8: Wait for PostgreSQL to initialize...
echo This may take 10-15 seconds...
timeout /t 10 /nobreak >nul
:check_loop
docker exec ayurveda-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo Still waiting...
    timeout /t 2 /nobreak >nul
    goto check_loop
)
echo PostgreSQL is ready!
echo.

echo Step 9: Create database manually...
docker exec ayurveda-postgres createdb -U postgres ayurveda_admin 2>nul
echo.

echo Step 10: Run initial migration...
npx prisma migrate dev --name init --skip-generate
echo.

echo Step 11: Start Redis...
docker-compose up -d redis
echo.

echo ==========================================
echo RESET COMPLETE!
echo ==========================================
echo.
echo You can now start the API:
echo   npm run start:dev
echo.
pause
