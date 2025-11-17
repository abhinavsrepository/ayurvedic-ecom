@echo off
echo ============================================================================
echo Testing Admin Login
echo ============================================================================
echo.
echo Testing if backend is running and admin login works...
echo.

echo 1. Checking if backend is accessible...
curl -s http://localhost:8080/actuator/health 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Backend is not running on port 8080!
    echo Please start the backend first:
    echo   cd backend
    echo   gradlew.bat bootRun
    echo.
    pause
    exit /b 1
)

echo.
echo 2. Testing admin login API...
echo.

curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

echo.
echo.
echo ============================================================================
echo If you see a JSON response with "accessToken", login is working! ✓
echo If you see an error, check the response above for details.
echo ============================================================================
echo.
pause
