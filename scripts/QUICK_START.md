# 🚀 Quick Start Guide - Ayurveda Shop

## Start Everything in 3 Steps

### Step 1: Start Backend
```bash
cd backend
gradlew.bat bootRun
```
Wait for: `Tomcat started on port(s): 8080`

### Step 2: Start Frontend
```bash
cd ayurveda-shop
npm run dev
```
Wait for: `ready - started server on 0.0.0.0:3000`

### Step 3: Start ML Service (Optional)
```bash
start-ml-service.bat
```
Wait for: `Running on http://0.0.0.0:5000`

## Access Points

- Admin Panel: http://localhost:3000/admin/login (admin/admin123)
- Shop Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- ML Service: http://localhost:5000

## Test Commands

```bash
# Test login
test-admin-login.bat

# Test registration
test-registration.bat

# Test ML service
test-ml-service.bat
```

Read COMPLETE_PROJECT_STATUS.md for full guide!
