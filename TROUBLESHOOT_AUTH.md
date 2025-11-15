# Complete Authentication Troubleshooting Guide

## Current Issue
Getting 401 Unauthorized when trying to login with admin/admin123

## Step-by-Step Debugging

### Step 1: Restart Backend
The TestController was just added, so restart your backend:

```bash
cd backend
./gradlew bootRun
# or on Windows:
gradlew.bat bootRun
```

Wait for: `Started AyurvedaAdminApplication`

---

### Step 2: Generate Fresh Hash

Visit in browser or curl:
```bash
curl http://localhost:8080/api/test/hash/admin123
```

You'll get something like:
```json
{
  "plainPassword": "admin123",
  "bcryptHash": "$2a$12$ABC123...",
  "strength": "12"
}
```

**Copy the bcryptHash value!**

---

### Step 3: Update Database with Fresh Hash

In psql:
```sql
-- Use the hash from Step 2!
UPDATE users
SET password = 'PASTE_THE_HASH_FROM_STEP_2_HERE'
WHERE username = 'admin';
```

Example:
```sql
UPDATE users
SET password = '$2a$12$XYZ789...' -- Replace with YOUR hash from step 2
WHERE username = 'admin';
```

---

### Step 4: Verify Password in Database

```sql
SELECT username, password FROM users WHERE username = 'admin';
```

The password should match exactly what you got in Step 2.

---

### Step 5: Test Password Verification

```bash
curl -X POST http://localhost:8080/api/test/verify \
  -H "Content-Type: application/json" \
  -d '{
    "password": "admin123",
    "hash": "PASTE_YOUR_HASH_HERE"
  }'
```

Should return:
```json
{
  "password": "admin123",
  "hash": "$2a$12$...",
  "matches": true
}
```

If `matches: false`, there's a mismatch!

---

### Step 6: Check Database User Exists with Role

```sql
SELECT
    u.username,
    u.email,
    u.enabled,
    u.account_locked,
    r.name as role,
    LEFT(u.password, 10) as pwd_start
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';
```

**Must show:**
- ✅ username: admin
- ✅ enabled: true
- ✅ account_locked: false
- ✅ role: ADMIN
- ✅ pwd_start: $2a$12$

---

### Step 7: Check Backend Logs

When you try to login, watch the backend console. Look for:
- `BadCredentialsException` → Password doesn't match
- `UsernameNotFoundException` → User not found
- `AccountLockedException` → Account locked
- `DisabledException` → Account disabled

---

### Step 8: Test Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -v
```

**Success looks like:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "username": "admin",
    "email": "admin@ayurveda.com",
    "fullName": "Admin User",
    "roles": ["ADMIN"],
    "twoFaEnabled": false
  }
}
```

**Failure looks like:**
```json
{
  "path": "/error",
  "error": "Unauthorized",
  "message": "Full authentication is required...",
  "status": 401
}
```

---

## Common Issues and Fixes

### Issue 1: User Doesn't Exist
```sql
-- Create user
INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled)
SELECT 'admin', 'admin@ayurveda.com',
       (SELECT bcryptHash FROM generate_hash_function('admin123')),
       'Admin User', true, false
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
```

### Issue 2: No Role Assigned
```sql
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;
```

### Issue 3: Account Locked
```sql
UPDATE users SET account_locked = false WHERE username = 'admin';
```

### Issue 4: Account Disabled
```sql
UPDATE users SET enabled = true WHERE username = 'admin';
```

### Issue 5: Wrong Password Hash
Use Step 2-3 above to regenerate and update.

---

## Nuclear Option: Complete Reset

If nothing works, run this complete reset:

```sql
-- 1. Delete everything
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- 2. Get fresh hash from test endpoint
-- Visit: http://localhost:8080/api/test/hash/admin123
-- Copy the hash

-- 3. Create fresh user (replace HASH_HERE with hash from step 2)
INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled, account_locked, failed_login_attempts)
VALUES ('admin', 'admin@ayurveda.com', 'HASH_HERE', 'Admin User', true, false, false, 0);

-- 4. Assign role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN';

-- 5. Verify
SELECT u.username, u.enabled, u.account_locked, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';
```

---

## Still Not Working?

### Check CORS
In backend console, look for CORS errors. Should see:
```
ADMIN_UI_URL: http://localhost:3000
```

### Check JWT Secret
In `application.yml`:
```yaml
jwt:
  secret: your-secret-key-here-change-in-production-minimum-256-bits-required-for-HS256-algorithm
```

Must be at least 256 bits (43+ characters).

### Check Database Connection
```sql
SELECT current_database(), current_user, version();
```

Should show: `ayurveda_admin`

---

## Success Checklist

After login works, verify:
- ✅ Returns accessToken and refreshToken
- ✅ User object has roles array
- ✅ Can access protected endpoints with token
- ✅ Frontend redirects to dashboard

---

## Clean Up After Success

**Delete the test controller!**
```bash
rm backend/apps/api/src/main/java/com/ayur/admin/web/rest/TestController.java
```

And remove `/api/test/**` from SecurityConfig.java

---

## Need More Help?

Share:
1. Output from Step 2 (hash generation)
2. Output from Step 5 (password verification)
3. Output from Step 6 (user query)
4. Backend console logs when trying to login
5. Exact curl command and response
