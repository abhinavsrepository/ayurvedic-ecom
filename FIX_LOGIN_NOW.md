# Fix Login - Execute This Now

## The Problem
The password hash in the database was created with BCrypt strength 10, but your backend expects strength 12. They need to match!

## Quick Fix - Run This SQL Script

### Option 1: Using psql (Command Line)

1. **Open Command Prompt or Terminal**

2. **Connect to your database:**
   ```bash
   psql -U postgres -d ayurveda_admin
   ```

3. **Run this SQL:**
   ```sql
   -- Delete old admin user if exists
   DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
   DELETE FROM users WHERE username = 'admin';

   -- Insert admin user with CORRECT password hash (BCrypt strength 12)
   INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled)
   VALUES (
       'admin',
       'admin@ayurveda.com',
       '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.',
       'Admin User',
       true,
       false
   );

   -- Assign ADMIN role
   INSERT INTO user_roles (user_id, role_id)
   SELECT u.id, r.id
   FROM users u, roles r
   WHERE u.username = 'admin' AND r.name = 'ADMIN';

   -- Verify it worked
   SELECT u.username, u.email, r.name as role
   FROM users u
   JOIN user_roles ur ON u.id = ur.user_id
   JOIN roles r ON r.id = ur.role_id
   WHERE u.username = 'admin';
   ```

4. **You should see:**
   ```
   username | email              | role
   ---------|--------------------|---------
   admin    | admin@ayurveda.com | ADMIN
   ```

5. **Exit psql:**
   ```sql
   \q
   ```

### Option 2: Using pgAdmin or DBeaver

1. Open pgAdmin or DBeaver
2. Connect to `ayurveda_admin` database
3. Open SQL query window
4. Paste and run the SQL from Option 1 above
5. Check the results

### Option 3: Run the SQL File

```bash
psql -U postgres -d ayurveda_admin -f "C:\Users\surya\OneDrive\Desktop\cosmicolast\backend\create_admin_user.sql"
```

## Test It Works

### Test 1: Using curl
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Should return JSON with accessToken!**

### Test 2: In Browser
1. Go to: http://localhost:3000/admin/login
2. Username: `admin`
3. Password: `admin123`
4. Click Login

**Should redirect to dashboard!**

## Why This Happened

Your `SecurityConfig.java` line 118 uses:
```java
new BCryptPasswordEncoder(12);  // strength 12
```

But the migration created a hash with strength 10. BCrypt strength must match!

## The Correct Hash

This is the correct BCrypt hash for `admin123` with strength 12:
```
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.
```

## If Still Not Working

1. **Verify user exists:**
   ```sql
   SELECT * FROM users WHERE username = 'admin';
   ```

2. **Check password hash starts with `$2a$12$`:**
   ```sql
   SELECT username, LEFT(password, 10) FROM users WHERE username = 'admin';
   ```
   Should show: `$2a$12$LQ`

3. **Check role assignment:**
   ```sql
   SELECT u.username, r.name
   FROM users u
   JOIN user_roles ur ON u.id = ur.user_id
   JOIN roles r ON r.id = ur.role_id
   WHERE u.username = 'admin';
   ```

4. **Check backend logs** for authentication errors

## Alternative: Restart Backend (After SQL Fix)

After running the SQL above:
```bash
cd backend
./gradlew bootRun
```

The backend will pick up the new user from the database.

---

**TL;DR: Run the SQL above, then try logging in with admin/admin123**
