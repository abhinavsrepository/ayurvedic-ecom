@echo off
echo ==========================================
echo Setup Local PostgreSQL (No Docker)
echo ==========================================
echo.

REM Check PostgreSQL path
set PGPATH=C:\Program Files\PostgreSQL\18\bin
if not exist "%PGPATH%\psql.exe" (
    set PGPATH=C:\Program Files\PostgreSQL\17\bin
)

if not exist "%PGPATH%\psql.exe" (
    echo ERROR: PostgreSQL not found!
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo Found PostgreSQL at: %PGPATH%
echo.

REM Add to PATH for this session
set PATH=%PATH%;%PGPATH%

REM Get postgres password
echo Please enter your PostgreSQL 'postgres' user password:
set /p PGPASSWORD="Password: "
echo.

set PGPASSWORD=%PGPASSWORD%

REM Check connection
echo Testing connection...
psql -U postgres -p 5433 -c "SELECT version();" >nul 2>&1
if errorlevel 1 (
    echo Trying port 5432...
    psql -U postgres -p 5432 -c "SELECT version();" >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Could not connect to PostgreSQL!
        echo Make sure PostgreSQL service is running.
        pause
        exit /b 1
    ) else (
        set PGPORT=5432
    )
) else (
    set PGPORT=5433
)

echo Connected successfully on port %PGPORT%!
echo.

REM Check if database exists
echo Checking for 'ayurveda_admin' database...
psql -U postgres -p %PGPORT% -lqt | findstr "ayurveda_admin" >nul
if errorlevel 1 (
    echo Creating database 'ayurveda_admin'...
    psql -U postgres -p %PGPORT% -c "CREATE DATABASE ayurveda_admin;"
    echo Database created!
) else (
    echo Database 'ayurveda_admin' already exists.
)

echo.
echo ==========================================
echo Updating .env file...
echo ==========================================
echo.

REM Update .env file
(
echo # Local PostgreSQL (NO DOCKER REQUIRED)
echo # PostgreSQL running locally on port %PGPORT%
echo DATABASE_URL=postgresql://postgres:%PGPASSWORD%@localhost:%PGPORT%/ayurveda_admin
echo.
echo # JWT Secrets (change these in production!)
echo JWT_SECRET=super-secret-jwt-key-change-in-production-min-32-characters-long
echo JWT_REFRESH_SECRET=super-secret-refresh-key-change-in-production-min-32-chars
echo.
echo # Server
echo PORT=3333
echo NODE_ENV=development
echo.
echo # CORS (frontend URLs)
echo CORS_ORIGINS=http://localhost:3000,http://localhost:3001
echo.
echo # Redis - Disabled (no Docker required)
echo # To enable Redis, install Redis for Windows:
echo # https://github.com/microsoftarchive/redis/releases
echo REDIS_HOST=
echo REDIS_PORT=
echo REDIS_PASSWORD=
echo REDIS_DB=0
echo CACHE_TTL=3600
echo.
echo # Payment Gateways (optional - add your keys)
echo STRIPE_SECRET_KEY=
echo RAZORPAY_KEY_ID=
echo RAZORPAY_KEY_SECRET=
echo RAZORPAY_WEBHOOK_SECRET=
) > .env

echo .env file updated!
echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Run: npx prisma db push
echo 2. Run: npx prisma generate
echo 3. Start API: npm run start:dev
echo.
pause
