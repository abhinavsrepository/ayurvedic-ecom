@echo off
echo ========================================
echo  Starting AyurShop Mobile App
echo ========================================
echo.

echo Cleaning up old processes...
taskkill /F /IM node.exe 2>nul
timeout /t 3 >nul

echo Starting Expo...
cd /d "%~dp0"
npx expo start --clear

pause
