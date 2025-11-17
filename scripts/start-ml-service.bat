@echo off
echo ============================================================================
echo Starting ML Service for Ayurveda Shop
echo ============================================================================
echo.

echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)

echo Python found!
echo.

echo Navigating to ML service directory...
cd ml-service

echo.
echo Installing dependencies...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo Starting ML Service on port 5000...
echo ============================================================================
echo.
echo The ML service will be available at: http://localhost:5000
echo.
echo API Endpoints:
echo   - Health Check: http://localhost:5000/health
echo   - Recommendations: POST http://localhost:5000/api/ml/recommendations
echo   - Forecasts: POST http://localhost:5000/api/ml/forecast
echo   - Anomalies: GET http://localhost:5000/api/ml/anomalies
echo.
echo Press Ctrl+C to stop the service
echo ============================================================================
echo.

python app.py
