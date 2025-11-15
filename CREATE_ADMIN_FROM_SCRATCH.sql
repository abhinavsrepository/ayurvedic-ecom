-- ============================================================================
-- CREATE ADMIN USER FROM SCRATCH
-- ============================================================================
-- Run this in PostgreSQL to create the admin user
-- Password: admin123
-- ============================================================================

-- Step 1: Check if roles exist
SELECT 'Checking roles...' as step;
SELECT id, name, description FROM roles;

-- Step 2: Create admin user
SELECT 'Creating admin user...' as step;
INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled)
VALUES (
    'admin',
    'admin@ayurveda.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.',
    'Admin User',
    true,
    false
);

-- Step 3: Verify user was created
SELECT 'User created successfully!' as step;
SELECT id, username, email, full_name, enabled FROM users WHERE username = 'admin';

-- Step 4: Assign ADMIN role
SELECT 'Assigning ADMIN role...' as step;
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN';

-- Step 5: Verify role assignment
SELECT 'Verification - User with roles:' as step;
SELECT
    u.username,
    u.email,
    u.full_name,
    u.enabled,
    r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';

-- ============================================================================
-- DONE! You should now be able to login with:
-- Username: admin
-- Password: admin123
-- ============================================================================
