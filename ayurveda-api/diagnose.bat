@echo off
echo ==========================================
echo Database Connection Diagnostic
echo ==========================================
echo.

echo 1. Checking .env file...
if exist ".env" (
    echo [OK] .env file exists
    findstr "DATABASE_URL" .env | findstr /V "^#"
) else (
    echo [ERROR] .env file NOT FOUND!
)
echo.

echo 2. Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is NOT running!
    echo Please start Docker Desktop first.
) else (
    echo [OK] Docker is running
)
echo.

echo 3. Checking containers...
docker ps -a --filter "name=ayurveda" --format "  - {{.Names}}: {{.Status}}"
echo.

echo 4. Testing PostgreSQL connection...
docker exec ayurveda-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PostgreSQL is NOT ready
) else (
    echo [OK] PostgreSQL is ready
)
echo.

echo 5. Checking if database exists...
docker exec ayurveda-postgres psql -U postgres -lqt | findstr "ayurveda_admin" >nul
if errorlevel 1 (
    echo [ERROR] Database 'ayurveda_admin' does NOT exist
) else (
    echo [OK] Database 'ayurveda_admin' exists
)
echo.

echo 6. Testing direct Prisma connection...
npx prisma db execute --stdin < nul 2>nul
if errorlevel 1 (
    echo [ERROR] Prisma cannot connect
) else (
    echo [OK] Prisma connection works
)
echo.

echo ==========================================
echo Diagnostic Complete
echo ==========================================
echo.
echo If any check shows [ERROR], run:
echo   reset-all.bat
echo.
pause
