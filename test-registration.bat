@echo off
echo ============================================================================
echo Testing Admin Registration API
echo ============================================================================
echo.
echo This script will test if the registration endpoint is working.
echo.

echo 1. Checking if backend is running...
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
echo Backend is running! ✓
echo.

echo 2. Testing registration with a new user...
echo Username: testuser%RANDOM%
echo Email: test%RANDOM%@example.com
echo.

curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser%RANDOM%\",\"email\":\"test%RANDOM%@example.com\",\"password\":\"TestPass123\",\"fullName\":\"Test User\"}"

echo.
echo.
echo ============================================================================
echo If you see a JSON response with "accessToken", registration works! ✓
echo If you see "Username already exists", try running this script again.
echo If you see an error, check the response above for details.
echo ============================================================================
echo.
echo Next steps:
echo 1. Go to http://localhost:3000/admin/register
echo 2. Fill in the form with your details
echo 3. Click "Create Account"
echo 4. You should be logged in automatically!
echo.
pause
