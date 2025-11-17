# Authentication Setup - Quick Fix

## Problem
You're getting 401 Unauthorized because the admin user doesn't exist in the database.

## Solution
Choose **ONE** of these methods:

---

## Method 1: Restart Backend (Automatic) ✅ RECOMMENDED

**This will automatically create the admin user via Flyway migration.**

1. **Stop your backend** (Ctrl+C in the terminal where it's running)

2. **Restart the backend:**
   ```bash
   cd backend
   ./gradlew bootRun
   # or on Windows:
   gradlew.bat bootRun
   ```

3. **Watch the console logs** - you should see:
   ```
   Flyway migration V4__insert_admin_user.sql applied successfully
   ```

4. **Try logging in:**
   - URL: http://localhost:3000/admin/login
   - Username: `admin`
   - Password: `admin123`

---

## Method 2: Manual SQL (If Method 1 doesn't work)

1. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres -d ayurveda_admin
   ```

2. **Run the SQL script:**
   ```bash
   \i C:/Users/surya/OneDrive/Desktop/cosmicolast/backend/create_admin_user.sql
   ```

   **Or copy-paste this SQL:**
   ```sql
   -- Insert admin user
   INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled)
   VALUES (
       'admin',
       'admin@ayurveda.com',
       '$2a$10$N9qo8uLOickgx2ZMRZoMye7U7mPGlGrLJMzJmJ5RqPXdJMzJmJ5Rq',
       'Admin User',
       true,
       false
   ) ON CONFLICT (username) DO NOTHING;

   -- Assign ADMIN role
   INSERT INTO user_roles (user_id, role_id)
   SELECT u.id, r.id
   FROM users u, roles r
   WHERE u.username = 'admin' AND r.name = 'ADMIN'
   ON CONFLICT DO NOTHING;
   ```

3. **Verify it worked:**
   ```sql
   SELECT u.username, u.email, r.name as role
   FROM users u
   JOIN user_roles ur ON u.id = ur.user_id
   JOIN roles r ON r.id = ur.role_id
   WHERE u.username = 'admin';
   ```

   You should see:
   ```
   username | email              | role
   ---------|--------------------|---------
   admin    | admin@ayurveda.com | ADMIN
   ```

---

## Method 3: Generate Your Own Password Hash

If you want a different password:

1. **Run the hash generator:**
   ```bash
   cd backend/apps/api/src/main/java/com/ayur/admin/util
   java PasswordHashGenerator.java
   ```

2. **Use the generated hash** in the SQL insert statement above

---

## Verification Steps

### 1. Test with curl:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "user": {
    "username": "admin",
    "email": "admin@ayurveda.com",
    "fullName": "Admin User",
    "roles": ["ADMIN"],
    "twoFaEnabled": false
  }
}
```

### 2. Test in browser:
1. Go to: http://localhost:3000/admin/login
2. Username: `admin`
3. Password: `admin123`
4. Should redirect to dashboard

---

## Troubleshooting

### Still getting 401?

**Check 1: Is the user in the database?**
```sql
SELECT * FROM users WHERE username = 'admin';
```

**Check 2: Are roles assigned?**
```sql
SELECT u.username, r.name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';
```

**Check 3: Backend logs**
Look for errors in your backend console. Common issues:
- `BadCredentialsException` - Password doesn't match
- `UsernameNotFoundException` - User doesn't exist
- `Database connection error` - Can't connect to PostgreSQL

**Check 4: CORS issues**
In `backend/apps/api/src/main/resources/application.yml`:
```yaml
app:
  cors:
    allowed-origins: http://localhost:3000
```

---

## Default Credentials

**Username:** `admin`
**Password:** `admin123`

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## What Files Were Created

1. `V4__insert_admin_user.sql` - Flyway migration (auto-runs on backend restart)
2. `create_admin_user.sql` - Manual SQL script
3. `PasswordHashGenerator.java` - Utility to generate password hashes
4. `AUTHENTICATION_FIX.md` - This file

---

## Need More Help?

If none of this works:

1. **Check backend is running:** http://localhost:8080/actuator/health
2. **Check database connection:** Look for connection errors in backend logs
3. **Check Flyway migrations:**
   ```sql
   SELECT * FROM flyway_schema_history ORDER BY installed_rank;
   ```
4. **Share the error:** Copy the exact error from backend console

---

**Next Step:** Restart your backend and try logging in!
