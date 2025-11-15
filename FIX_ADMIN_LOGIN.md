# Fix Admin Login - 401 Unauthorized Error

## Problem
You're getting a 401 Unauthorized error when trying to log into the admin panel. This is likely because:
1. The admin user doesn't exist in the database
2. The password hash doesn't match the BCrypt strength (backend uses strength 12)
3. The ADMIN role isn't assigned to the user

## Solution - Follow These Steps

### Step 1: Reset the Admin Password

I've created a SQL script that will fix everything. Choose one of these methods:

#### Option A: Using the Batch File (Easiest for Windows)

1. **Make sure PostgreSQL is running**
   - Open Services (Windows + R, type `services.msc`)
   - Find "postgresql" service and make sure it's running

2. **Double-click this file:**
   ```
   reset-admin-password.bat
   ```

3. **Follow the prompts**
   - It will ask for your PostgreSQL password (usually blank or "postgres")
   - If successful, you'll see "SUCCESS! Admin password has been reset."

#### Option B: Using Command Line

1. **Open Command Prompt** (as Administrator if possible)

2. **Navigate to your project:**
   ```cmd
   cd C:\Users\surya\OneDrive\Desktop\cosmicolast
   ```

3. **Run the SQL script:**
   ```cmd
   psql -U postgres -d ayurveda_admin -f RESET_ADMIN_PASSWORD.sql
   ```

4. **Enter your PostgreSQL password** when prompted

### Step 2: Start the Backend (if not running)

1. **Open a new Command Prompt**

2. **Navigate to backend folder:**
   ```cmd
   cd C:\Users\surya\OneDrive\Desktop\cosmicolast\backend
   ```

3. **Start the backend:**
   ```cmd
   gradlew.bat bootRun
   ```

4. **Wait for the message:**
   ```
   Tomcat started on port(s): 8080
   ```

### Step 3: Test the Login

#### Method 1: Using curl (to verify API directly)

Open a new Command Prompt and run:

```cmd
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "username": "admin",
    "email": "admin@ayurveda.com",
    "fullName": "System Administrator",
    "roles": ["ADMIN"]
  }
}
```

If you see this, the backend is working! ✅

#### Method 2: Using the Browser

1. **Open your browser** and go to:
   ```
   http://localhost:3000/admin/login
   ```

2. **Enter credentials:**
   - Username: `admin`
   - Password: `admin123`

3. **Click "Sign in"**

4. **You should be redirected** to: `http://localhost:3000/admin`

## Troubleshooting

### Issue 1: "psql: command not found" or "psql is not recognized"

**Solution:** Add PostgreSQL to your PATH

1. Find your PostgreSQL bin directory (usually):
   ```
   C:\Program Files\PostgreSQL\14\bin
   ```

2. Add to Windows PATH:
   - Press Windows + R
   - Type `sysdm.cpl` and press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit" → "New"
   - Add: `C:\Program Files\PostgreSQL\14\bin`
   - Click OK on all windows
   - **Restart Command Prompt**

3. **Or use the full path:**
   ```cmd
   "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d ayurveda_admin -f RESET_ADMIN_PASSWORD.sql
   ```

### Issue 2: "database does not exist"

**Solution:** Create the database first

```cmd
psql -U postgres -c "CREATE DATABASE ayurveda_admin;"
```

Then run the Flyway migrations:

```cmd
cd backend
gradlew.bat flywayMigrate
```

Then run the reset password script again.

### Issue 3: Backend won't start

**Check if something is using port 8080:**

```cmd
netstat -ano | findstr :8080
```

If something is there, kill it:

```cmd
taskkill /PID <process_id> /F
```

Replace `<process_id>` with the number from the netstat command.

### Issue 4: Still getting 401 after everything

1. **Check the browser console** (F12)
   - Look for the actual error message
   - Check the Network tab for the `/api/auth/login` request

2. **Check if backend is really running:**
   ```cmd
   curl http://localhost:8080/api/auth/health
   ```

3. **Verify the password hash in database:**
   ```sql
   psql -U postgres -d ayurveda_admin -c "SELECT username, LEFT(password, 10) FROM users WHERE username = 'admin';"
   ```

   Should show: `$2a$12$LQ`

4. **Check backend logs** for authentication errors

5. **Clear browser storage:**
   - Open DevTools (F12)
   - Go to "Application" tab
   - Clear "Local Storage" for localhost:3000
   - Try logging in again

## What the SQL Script Does

The `RESET_ADMIN_PASSWORD.sql` script:

1. ✅ Removes any existing admin user
2. ✅ Creates a new admin user with the correct BCrypt hash (strength 12)
3. ✅ Creates the ADMIN role if it doesn't exist
4. ✅ Assigns the ADMIN role to the admin user
5. ✅ Verifies everything is set up correctly

## Login Credentials

```
Username: admin
Password: admin123
```

**IMPORTANT:** Change this password after your first successful login!

## Need More Help?

1. **Check if PostgreSQL is running:**
   ```cmd
   sc query postgresql-x64-14
   ```

2. **Check if backend is running:**
   ```cmd
   tasklist | findstr java
   ```

3. **Check backend application.yml** for correct database settings

4. **Look at backend console** for any error messages when starting

## Quick Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `ayurveda_admin` exists
- [ ] Ran `RESET_ADMIN_PASSWORD.sql` successfully
- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 3000
- [ ] Can see login page at http://localhost:3000/admin/login
- [ ] Entered correct credentials (admin/admin123)

---

**TL;DR:**
1. Run `reset-admin-password.bat` OR run the SQL file with psql
2. Start backend: `cd backend && gradlew.bat bootRun`
3. Login at http://localhost:3000/admin/login with admin/admin123
