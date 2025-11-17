-- ============================================================================
-- COMPLETE DIAGNOSTIC AND FIX SCRIPT
-- ============================================================================
-- Run this entire script in psql
-- It will diagnose the issue and create the admin user correctly
-- ============================================================================

\echo '============================================================================'
\echo 'STEP 1: Checking if tables exist'
\echo '============================================================================'

SELECT
    tablename,
    'EXISTS' as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'roles', 'user_roles')
ORDER BY tablename;

\echo ''
\echo '============================================================================'
\echo 'STEP 2: Checking roles table'
\echo '============================================================================'

SELECT id, name, description FROM roles ORDER BY name;

\echo ''
\echo '============================================================================'
\echo 'STEP 3: Checking if admin user exists'
\echo '============================================================================'

SELECT
    id,
    username,
    email,
    enabled,
    two_fa_enabled,
    LEFT(password, 10) as password_start,
    LENGTH(password) as password_length
FROM users
WHERE username = 'admin';

\echo ''
\echo '============================================================================'
\echo 'STEP 4: Deleting old admin user if exists (with wrong password)'
\echo '============================================================================'

DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

\echo ''
\echo '============================================================================'
\echo 'STEP 5: Creating admin user with CORRECT password'
\echo '============================================================================'
\echo 'Password: admin123'
\echo 'BCrypt hash strength: 12 (matching SecurityConfig.java)'
\echo '============================================================================'

INSERT INTO users (
    username,
    email,
    password,
    full_name,
    enabled,
    two_fa_enabled,
    account_locked,
    failed_login_attempts
) VALUES (
    'admin',
    'admin@ayurveda.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.',
    'Admin User',
    true,
    false,
    false,
    0
);

\echo ''
\echo '============================================================================'
\echo 'STEP 6: Assigning ADMIN role to user'
\echo '============================================================================'

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.username = 'admin'
AND r.name = 'ADMIN';

\echo ''
\echo '============================================================================'
\echo 'STEP 7: VERIFICATION - User Details'
\echo '============================================================================'

SELECT
    id,
    username,
    email,
    full_name,
    enabled,
    account_locked,
    two_fa_enabled,
    failed_login_attempts,
    LEFT(password, 15) as password_prefix,
    LENGTH(password) as pwd_length
FROM users
WHERE username = 'admin';

\echo ''
\echo '============================================================================'
\echo 'STEP 8: VERIFICATION - User with Roles'
\echo '============================================================================'

SELECT
    u.username,
    u.email,
    u.enabled,
    u.account_locked,
    r.name as role,
    r.description
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';

\echo ''
\echo '============================================================================'
\echo 'STEP 9: Password Hash Check'
\echo '============================================================================'
\echo 'The password should start with: $2a$12$'
\echo '============================================================================'

SELECT
    username,
    LEFT(password, 10) as hash_start,
    CASE
        WHEN password LIKE '$2a$12$%' THEN 'CORRECT (strength 12)'
        WHEN password LIKE '$2a$10$%' THEN 'WRONG (strength 10)'
        ELSE 'INVALID'
    END as hash_status
FROM users
WHERE username = 'admin';

\echo ''
\echo '============================================================================'
\echo 'DONE! Setup Complete'
\echo '============================================================================'
\echo 'You can now login with:'
\echo '  Username: admin'
\echo '  Password: admin123'
\echo ''
\echo 'Test with curl:'
\echo '  curl -X POST http://localhost:8080/api/auth/login \'
\echo '    -H "Content-Type: application/json" \'
\echo '    -d "{\"username\":\"admin\",\"password\":\"admin123\"}"'
\echo ''
\echo 'Or in browser: http://localhost:3000/admin/login'
\echo '============================================================================'
