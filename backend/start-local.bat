@echo off
echo Starting Ayurveda Admin Backend locally...
echo.

echo Starting PostgreSQL and Redis with Docker Compose...
docker-compose up -d postgres redis

echo Waiting for services to be ready...
timeout /t 10

echo Starting Spring Boot application...
gradlew.bat :apps:api:bootRun

pause
