@echo off
echo ============================================================================
echo FIX REGISTRATION - Complete Reset
echo ============================================================================
echo.

echo Step 1: Killing all Java processes...
taskkill /F /IM java.exe >nul 2>&1
echo Done.
echo.

echo Step 2: Waiting 5 seconds...
timeout /t 5 /nobreak >nul
echo.

echo Step 3: Verifying SecurityConfig.java is correct...
findstr /C:"api/auth/register" "backend\apps\api\src\main\java\com\ayur\admin\config\SecurityConfig.java" >nul 2>&1
if %errorlevel%==0 (
    echo ✓ SecurityConfig.java contains /api/auth/register
) else (
    echo ✗ ERROR: SecurityConfig.java is missing /api/auth/register
    echo Please check the file manually.
    pause
    exit /b 1
)
echo.

echo Step 4: Cleaning previous builds...
cd backend
call gradlew.bat clean >nul 2>&1
echo Done.
echo.

echo Step 5: Building backend (this may take a minute)...
call gradlew.bat build -x test

if %errorlevel% neq 0 (
    echo.
    echo ============================================================================
    echo ERROR: Build failed!
    echo ============================================================================
    echo.
    echo Please check the error messages above.
    echo Common issues:
    echo 1. Missing dependencies
    echo 2. Compilation errors
    echo 3. Java not installed
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo Build successful! Starting backend...
echo ============================================================================
echo.
echo Backend will start on port 8080
echo.
echo IMPORTANT: Keep this window open!
echo The backend server will run here.
echo.
echo After you see "Tomcat started on port(s): 8080":
echo 1. Open a NEW command prompt
echo 2. Run: test-registration.bat
echo.
echo To stop the server: Press Ctrl+C
echo ============================================================================
echo.
timeout /t 3 /nobreak >nul

call gradlew.bat bootRun
