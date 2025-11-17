@echo off
echo ============================================================================
echo Resetting Admin Password for Ayurveda Shop
echo ============================================================================
echo.
echo This will reset your admin password to: admin123
echo.
echo Make sure PostgreSQL is running before continuing!
echo.
pause

echo.
echo Connecting to database...
echo.

psql -U postgres -d ayurveda_admin -f "RESET_ADMIN_PASSWORD.sql"

echo.
echo ============================================================================
echo.
pause
