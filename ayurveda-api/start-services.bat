@echo off
echo ==========================================
echo Starting Ayurveda API Services
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop first:
    echo 1. Open Docker Desktop from Start Menu
    echo 2. Wait for the Docker whale icon to stop animating
    echo 3. Run this script again
    echo.
    echo Or visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

echo Docker is running!
echo.

REM Check if containers exist
docker ps -a --filter "name=ayurveda-postgres" --format "{{.Names}}" | findstr "ayurveda-postgres" >nul
if errorlevel 1 (
    echo Creating PostgreSQL and Redis containers...
    docker-compose up -d
) else (
    echo Starting existing containers...
    docker-compose start
)

if errorlevel 1 (
    echo ERROR: Failed to start containers!
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

REM Check if database exists
docker exec ayurveda-postgres psql -U postgres -lqt | findstr "ayurveda_admin" >nul
if errorlevel 1 (
    echo Creating database...
    docker exec ayurveda-postgres psql -U postgres -c "CREATE DATABASE ayurveda_admin;"
)

echo.
echo ==========================================
echo Services Started Successfully!
echo ==========================================
echo.
echo PostgreSQL: localhost:5434
echo Redis:      localhost:6379
echo.
echo Now you can start the API server:
echo   npm run start:dev
echo.
pause
