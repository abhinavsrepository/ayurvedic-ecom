-- Quick diagnostic script to check authentication setup
-- Run this in your PostgreSQL database (ayurveda_admin)

-- 1. Check Flyway migrations status
SELECT installed_rank, version, description, success, installed_on
FROM flyway_schema_history
ORDER BY installed_rank;

-- 2. Check if users table exists and has data
SELECT COUNT(*) as total_users FROM users;

-- 3. Check if admin user exists
SELECT id, username, email, full_name, enabled, two_fa_enabled, created_at
FROM users
WHERE username = 'admin';

-- 4. Check roles table
SELECT id, name, description FROM roles;

-- 5. Check user-role assignments
SELECT u.username, u.email, r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';

-- 6. Check password hash (first 20 chars only)
SELECT username, LEFT(password, 20) as password_prefix
FROM users
WHERE username = 'admin';
