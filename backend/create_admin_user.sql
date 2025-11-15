-- ============================================================================
-- CREATE ADMIN USER FOR AYURVEDA SHOP
-- ============================================================================
-- Run this script in your PostgreSQL database
-- Database: ayurveda_admin
-- Username: admin
-- Password: admin123
--
-- IMPORTANT: Change the password after first login!
-- ============================================================================

-- Check if admin user already exists
SELECT 'Checking for existing admin user...' as status;
SELECT username, email, enabled FROM users WHERE username = 'admin';

-- Delete existing admin user if it exists with wrong password
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Insert admin user with correct BCrypt hash (strength 12)
INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled)
VALUES (
    'admin',
    'admin@ayurveda.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.', -- BCrypt hash for 'admin123' (12 rounds)
    'Admin User',
    true,
    false
);

-- Verify admin role exists
SELECT 'Checking for ADMIN role...' as status;
SELECT id, name, description FROM roles WHERE name = 'ADMIN';

-- Assign ADMIN role to user (will skip if already assigned)
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- Verify the user was created successfully
SELECT 'Admin user verification:' as status;
SELECT
    u.username,
    u.email,
    u.full_name,
    u.enabled,
    u.two_fa_enabled,
    r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';

-- ============================================================================
-- DONE! You can now login with:
-- Username: admin
-- Password: admin123
-- ============================================================================
