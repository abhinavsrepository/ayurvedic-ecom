@echo off
echo ==========================================
echo Reset PostgreSQL Password
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

REM Stop PostgreSQL service
echo Stopping PostgreSQL service...
net stop postgresql-x64-18 2>nul || net stop postgresql-x64-17 2>nul
timeout /t 2 /nobreak >nul

REM Create pg_hba.conf backup
copy "%PGPATH%\data\pg_hba.conf" "%PGPATH%\data\pg_hba.conf.backup" >nul

REM Update pg_hba.conf to trust mode
echo Enabling trust authentication temporarily...
(
echo # TYPE  DATABASE        USER            ADDRESS                 METHOD
echo local   all             all                                     trust
echo host    all             all             127.0.0.1/32            trust
echo host    all             all             ::1/128                 trust
) > "%PGPATH%\data\pg_hba.conf"

REM Start PostgreSQL
echo Starting PostgreSQL...
net start postgresql-x64-18 2>nul || net start postgresql-x64-17 2>nul
timeout /t 3 /nobreak >nul

REM Set new password
echo.
set /p NEWPASS="Enter new password for postgres user: "

set PATH=%PATH%;%PGPATH%\bin
psql -U postgres -c "ALTER USER postgres WITH PASSWORD '%NEWPASS%';"

if errorlevel 1 (
    echo Failed to set password. Trying port 5432...
    psql -U postgres -p 5432 -c "ALTER USER postgres WITH PASSWORD '%NEWPASS%';"
)

REM Restore pg_hba.conf
echo Restoring authentication settings...
copy "%PGPATH%\data\pg_hba.conf.backup" "%PGPATH%\data\pg_hba.conf" >nul
del "%PGPATH%\data\pg_hba.conf.backup" >nul

REM Restart PostgreSQL
net stop postgresql-x64-18 2>nul || net stop postgresql-x64-17 2>nul
timeout /t 2 /nobreak >nul
net start postgresql-x64-18 2>nul || net start postgresql-x64-17 2>nul

echo.
echo ==========================================
echo Password reset complete!
echo ==========================================
echo.
echo Update your .env file with:
echo DATABASE_URL=postgresql://postgres:%NEWPASS%@localhost:5433/ayurveda_admin
echo.
pause
