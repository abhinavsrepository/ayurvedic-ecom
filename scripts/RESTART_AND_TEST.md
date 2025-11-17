# Fix Registration - Restart Backend

## The Problem

The registration endpoint returns 401 Unauthorized because the backend was started before we updated the SecurityConfig. We need to restart it.

## Solution - Restart the Backend

### Step 1: Stop the Current Backend

**Option A: Using Task Manager**
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Go to the "Details" tab
3. Find `java.exe` process
4. Right-click and select "End Task"

**Option B: Using Command Prompt**
```cmd
taskkill /F /IM java.exe
```

### Step 2: Rebuild and Start the Backend

```cmd
cd C:\Users\surya\OneDrive\Desktop\cosmicolast\backend
gradlew.bat clean bootRun
```

**Wait for this message:**
```
Tomcat started on port(s): 8080 (http) with context path ''
```

### Step 3: Test the Registration Endpoint

**Open a new Command Prompt** and test:

```cmd
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"fullName\":\"Test User\"}"
```

**Expected Success Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "roles": ["ADMIN"],
    "twoFaEnabled": false
  }
}
```

If you see this, registration is working! ✅

### Step 4: Test in the Browser

1. Go to: **http://localhost:3000/admin/register**

2. Fill in the form:
   ```
   Full Name: Your Name
   Username: yourusername
   Email: your@email.com
   Password: YourPass123
   Confirm Password: YourPass123
   ```

3. Click **"Create Account"**

4. You should be:
   - ✅ Logged in automatically
   - ✅ Redirected to /admin dashboard
   - ✅ See a success toast notification

## Why This Happened

The SecurityConfig.java file was updated to allow `/api/auth/register`, but the backend server was already running with the old configuration. Spring Boot doesn't hot-reload security configuration changes, so we need a full restart.

## Quick Test Script

I've created a test script for you. After restarting the backend, run:

```cmd
test-registration.bat
```

This will test if the registration endpoint is accessible and working.

## Troubleshooting

### Still Getting 401 Unauthorized?

1. **Make sure you rebuilt the backend:**
   ```cmd
   cd backend
   gradlew.bat clean build
   ```

2. **Check if SecurityConfig.java has the correct permitAll() configuration:**
   ```cmd
   cd backend\apps\api\src\main\java\com\ayur\admin\config
   notepad SecurityConfig.java
   ```

   Look for this section (should be around line 46-55):
   ```java
   auth.requestMatchers(
       "/api/auth/login",
       "/api/auth/register",  // <-- This line must be here!
       "/api/auth/refresh",
       ...
   ).permitAll()
   ```

3. **Check backend logs for errors:**
   Look at the console where you ran `gradlew.bat bootRun`

### Registration Works but Can't Login?

Make sure you ran the password reset script first to create the admin user:
```cmd
reset-admin-password.bat
```

OR use the new user you just registered to login.

## Complete Fresh Start

If nothing works, do a complete fresh start:

### 1. Stop Everything
```cmd
taskkill /F /IM java.exe
taskkill /F /IM node.exe
```

### 2. Clean and Rebuild Backend
```cmd
cd C:\Users\surya\OneDrive\Desktop\cosmicolast\backend
gradlew.bat clean build
```

### 3. Start Backend
```cmd
gradlew.bat bootRun
```

### 4. In a New Terminal, Start Frontend
```cmd
cd C:\Users\surya\OneDrive\Desktop\cosmicolast\ayurveda-shop
npm run dev
```

### 5. Test Registration
```cmd
cd C:\Users\surya\OneDrive\Desktop\cosmicolast
test-registration.bat
```

## Files Changed

The following files were modified to enable registration:

1. ✅ **SecurityConfig.java** - Added `/api/auth/register` to permitAll()
2. ✅ **RegistrationController.java** - NEW - Registration endpoint
3. ✅ **RegisterRequest.java** - NEW - Registration DTO
4. ✅ **app/admin/register/page.tsx** - NEW - Registration UI
5. ✅ **app/admin/login/page.tsx** - Updated with register link

All changes are in place. You just need to restart the backend!

---

**TL;DR:**
1. Kill java.exe process
2. Run `cd backend && gradlew.bat clean bootRun`
3. Test with `test-registration.bat`
4. Go to http://localhost:3000/admin/register and create account
