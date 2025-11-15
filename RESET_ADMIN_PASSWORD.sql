-- ============================================================================
-- RESET ADMIN PASSWORD - Quick Fix
-- ============================================================================
-- This will reset the admin password to: admin123
-- Run this with: psql -U postgres -d ayurveda_admin -f RESET_ADMIN_PASSWORD.sql
-- ============================================================================

\echo '============================================================================'
\echo 'Resetting Admin Password for Ayurveda Shop'
\echo '============================================================================'
\echo ''

-- Step 1: Check current admin user
\echo 'Step 1: Checking current admin user...'
SELECT
    username,
    email,
    enabled,
    two_fa_enabled,
    LEFT(password, 10) as password_hash_prefix
FROM users
WHERE username = 'admin';

\echo ''

-- Step 2: Delete existing admin user and roles
\echo 'Step 2: Removing existing admin user...'
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

\echo 'Old admin user removed.'
\echo ''

-- Step 3: Create fresh admin user with correct BCrypt hash (strength 12)
\echo 'Step 3: Creating new admin user...'
INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled, created_at, updated_at)
VALUES (
    'admin',
    'admin@ayurveda.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.', -- BCrypt hash for 'admin123' with 12 rounds
    'System Administrator',
    true,
    false,
    NOW(),
    NOW()
);

\echo 'Admin user created successfully.'
\echo ''

-- Step 4: Ensure ADMIN role exists
\echo 'Step 4: Checking ADMIN role...'
INSERT INTO roles (name, description, created_at, updated_at)
VALUES ('ADMIN', 'System Administrator with full access', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

SELECT id, name, description FROM roles WHERE name = 'ADMIN';
\echo ''

-- Step 5: Assign ADMIN role to user
\echo 'Step 5: Assigning ADMIN role to admin user...'
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

\echo 'Role assigned successfully.'
\echo ''

-- Step 6: Verify everything is set up correctly
\echo '============================================================================'
\echo 'VERIFICATION - Admin User Details:'
\echo '============================================================================'
SELECT
    u.id,
    u.username,
    u.email,
    u.full_name,
    u.enabled,
    u.two_fa_enabled,
    LEFT(u.password, 10) as password_starts_with,
    r.name as role,
    u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';

\echo ''
\echo '============================================================================'
\echo 'SUCCESS! Admin password has been reset.'
\echo ''
\echo 'Login Credentials:'
\echo '  Username: admin'
\echo '  Password: admin123'
\echo ''
\echo 'Access the admin panel at: http://localhost:3000/admin/login'
\echo ''
\echo 'IMPORTANT: Change this password after your first login!'
\echo '============================================================================'
