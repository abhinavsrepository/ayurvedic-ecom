@echo off
echo ==========================================
echo Enable Trust Authentication (No Password)
echo ==========================================
echo.

set PGPATH=C:\Program Files\PostgreSQL\18
if not exist "%PGPATH%\bin\psql.exe" (
    set PGPATH=C:\Program Files\PostgreSQL\17
)

if not exist "%PGPATH%\bin\psql.exe" (
    echo ERROR: PostgreSQL not found!
    pause
    exit /b 1
)

echo Found PostgreSQL at: %PGPATH%
echo.

REM Backup original
copy "%PGPATH%\data\pg_hba.conf" "%PGPATH%\data\pg_hba.conf.backup" >nul 2>&1

REM Create trust authentication config
echo Updating authentication to trust mode...
(
echo # Trust authentication - no password required for local connections
echo local   all             all                                     trust
echo host    all             all             127.0.0.1/32            trust
echo host    all             all             ::1/128                 trust
echo host    replication     all             127.0.0.1/32            trust
echo host    replication     all             ::1/128                 trust
) > "%PGPATH%\data\pg_hba.conf"

REM Reload PostgreSQL config
echo Reloading PostgreSQL configuration...
set PATH=%PATH%;%PGPATH%\bin
psql -U postgres -c "SELECT pg_reload_conf();" 2>nul

if errorlevel 1 (
    echo Restarting PostgreSQL service...
    net stop postgresql-x64-18 2>nul || net stop postgresql-x64-17 2>nul
    timeout /t 2 /nobreak >nul
    net start postgresql-x64-18 2>nul || net start postgresql-x64-17 2>nul
)

echo.
echo ==========================================
echo Trust authentication enabled!
echo ==========================================
echo.
echo You can now use any password in .env
echo Recommended: DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ayurveda_admin
echo.
echo To restore password auth, run:
echo   copy "%PGPATH%\data\pg_hba.conf.backup" "%PGPATH%\data\pg_hba.conf"
echo.
pause
