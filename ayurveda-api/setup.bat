@echo off
echo ==========================================
echo Ayurveda API Setup
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop first:
    echo https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Starting PostgreSQL and Redis containers...
docker-compose up -d

if errorlevel 1 (
    echo ERROR: Failed to start Docker containers!
    pause
    exit /b 1
)

echo.
echo Waiting for PostgreSQL to be ready...
:wait_loop
docker exec ayurveda-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo Waiting for database...
    timeout /t 2 /nobreak >nul
    goto wait_loop
)

echo Database is ready!
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

echo.
echo Running Prisma migrations...
npx prisma migrate dev --name init

if errorlevel 1 (
    echo ERROR: Prisma migration failed!
    pause
    exit /b 1
)

echo.
echo Generating Prisma Client...
npx prisma generate

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo To start the API server, run:
echo   npm run start:dev
echo.
echo Or for production:
echo   npm run build
echo   npm run start:prod
echo.
echo Prisma Studio (Database GUI):
echo   npx prisma studio
echo.
echo Docker commands:
echo   docker-compose up -d    (Start services)
echo   docker-compose down     (Stop services)
echo   docker-compose logs -f  (View logs)
echo.
pause
