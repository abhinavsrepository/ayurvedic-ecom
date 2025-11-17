#!/bin/bash

echo "=== Testing Ayurveda Admin API Endpoints ==="
echo ""

# Get auth token
echo "1. Testing Login..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | python -m json.tool 2>/dev/null | grep accessToken | cut -d'"' -f4)

if [ ! -z "$ACCESS_TOKEN" ]; then
  echo "✅ Login successful - Token obtained"
else
  echo "❌ Login failed"
  exit 1
fi

echo ""
echo "2. Testing Health Endpoint..."
HEALTH=$(curl -s http://localhost:8080/actuator/health | python -m json.tool 2>/dev/null | grep status | cut -d'"' -f4)
if [ "$HEALTH" = "UP" ]; then
  echo "✅ Health check passed - Status: UP"
else
  echo "❌ Health check failed"
fi

echo ""
echo "3. Testing Authenticated Endpoint (User Profile)..."
PROFILE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8080/api/auth/profile)
if echo "$PROFILE" | grep -q "admin@ayurveda.com"; then
  echo "✅ Profile endpoint working - Admin user verified"
else
  echo "❌ Profile endpoint failed"
fi

echo ""
echo "4. Testing Password Hash Generator..."
HASH=$(curl -s http://localhost:8080/api/test/hash/test123 | python -m json.tool 2>/dev/null | grep bcryptHash)
if [ ! -z "$HASH" ]; then
  echo "✅ Hash generator working"
else
  echo "❌ Hash generator failed"
fi

echo ""
echo "5. Testing Prometheus Metrics..."
METRICS=$(curl -s http://localhost:8080/actuator/prometheus | head -5)
if echo "$METRICS" | grep -q "jvm_"; then
  echo "✅ Prometheus metrics available"
else
  echo "❌ Prometheus metrics failed"
fi

echo ""
echo "=== All Tests Complete! ==="
