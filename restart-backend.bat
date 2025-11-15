@echo off
echo ============================================================================
echo Restarting Backend Server
echo ============================================================================
echo.

echo Step 1: Stopping any running Java processes...
taskkill /F /IM java.exe >nul 2>&1
if %errorlevel%==0 (
    echo Java processes stopped successfully.
) else (
    echo No running Java processes found.
)
echo.

echo Step 2: Waiting 3 seconds for cleanup...
timeout /t 3 /nobreak >nul
echo.

echo Step 3: Building the backend...
cd backend
call gradlew.bat clean build -x test

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed! Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo Build successful! Starting backend server...
echo ============================================================================
echo.
echo The backend will start on port 8080.
echo Wait for: "Tomcat started on port(s): 8080"
echo.
echo After it starts, you can:
echo 1. Test registration: Run test-registration.bat
echo 2. Access frontend: http://localhost:3000/admin/register
echo.
echo Press Ctrl+C to stop the server when done.
echo ============================================================================
echo.

call gradlew.bat bootRun
