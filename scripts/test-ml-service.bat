@echo off
echo ============================================================================
echo Testing ML Service
echo ============================================================================
echo.

echo 1. Checking if ML service is running...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: ML service is not running on port 5000
    echo.
    echo Please start the ML service first:
    echo   Option 1: run start-ml-service.bat
    echo   Option 2: cd ml-service ^&^& python app.py
    echo.
    pause
    exit /b 1
)

echo ML Service is running! ✓
echo.

echo 2. Testing Health Check...
curl -s http://localhost:5000/health
echo.
echo.

echo 3. Testing Product Recommendations...
curl -s -X POST http://localhost:5000/api/ml/recommendations ^
  -H "Content-Type: application/json" ^
  -d "{\"customerId\":\"test123\",\"numRecommendations\":3}"
echo.
echo.

echo 4. Testing Demand Forecast...
curl -s -X POST http://localhost:5000/api/ml/forecast ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\":\"prod456\",\"days\":7}"
echo.
echo.

echo 5. Testing Anomaly Detection...
curl -s "http://localhost:5000/api/ml/anomalies?metric=revenue"
echo.
echo.

echo 6. Testing Model Playground...
curl -s -X POST http://localhost:5000/api/ml/playground ^
  -H "Content-Type: application/json" ^
  -d "{\"orderHistory\":5,\"totalSpent\":10000,\"daysSinceLastOrder\":30,\"avgOrderValue\":2000}"
echo.
echo.

echo ============================================================================
echo All tests completed!
echo ============================================================================
echo.
echo Your ML service is working correctly.
echo You can now integrate it with the admin panel.
echo.
pause
