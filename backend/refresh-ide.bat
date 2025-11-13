@echo off
echo Refreshing Gradle dependencies and IDE index...
echo.

echo Step 1: Clean build cache
gradlew.bat clean

echo.
echo Step 2: Refresh dependencies
gradlew.bat --refresh-dependencies

echo.
echo Step 3: Build project
gradlew.bat build -x test

echo.
echo Done! Please restart your IDE (VS Code/IntelliJ) for changes to take effect.
pause
