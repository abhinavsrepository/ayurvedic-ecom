-- ============================================================================
-- UPDATE ADMIN PASSWORD - Run this in PostgreSQL
-- ============================================================================
-- This updates the existing admin user's password to the correct BCrypt hash
-- Password: admin123 (BCrypt strength 12)
-- ============================================================================

-- First, verify the current admin user
SELECT
    username,
    email,
    enabled,
    LEFT(password, 10) as password_prefix,
    LENGTH(password) as password_length
FROM users
WHERE username = 'admin';

-- Update the password to correct BCrypt hash (strength 12)
UPDATE users
SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.',
    updated_at = CURRENT_TIMESTAMP
WHERE username = 'admin';

-- Verify the update
SELECT
    username,
    email,
    enabled,
    LEFT(password, 10) as password_prefix,
    'Password updated successfully!' as status
FROM users
WHERE username = 'admin';

-- Verify role assignment
SELECT
    u.username,
    u.email,
    r.name as role,
    'Role assigned correctly!' as status
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';

-- ============================================================================
-- DONE! Now try logging in with:
-- Username: admin
-- Password: admin123
-- ============================================================================
