-- ============================================================================
-- FIX ADMIN USER PASSWORD
-- ============================================================================
-- This script updates the admin user with the correct BCrypt hash
-- Password: admin123 (BCrypt hash with strength 12)
-- ============================================================================

-- Update the admin user's password with correct BCrypt hash
UPDATE users
SET password = '$2a$12$ZQ3o8gHQW2hp5JjqNdzouOK2kXERmP6T.mCkCZNP.HJjfP2tjLJGi'
WHERE username = 'admin';

-- Ensure admin user is enabled
UPDATE users
SET enabled = true,
    account_locked = false,
    failed_login_attempts = 0
WHERE username = 'admin';

-- Verify the update
SELECT
    username,
    email,
    full_name,
    enabled,
    account_locked,
    two_fa_enabled,
    failed_login_attempts,
    substring(password, 1, 20) || '...' as password_hash
FROM users
WHERE username = 'admin';

-- Verify admin role is assigned
SELECT
    u.username,
    r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.username = 'admin';

-- ============================================================================
-- DONE! You can now login with:
-- Username: admin
-- Password: admin123
-- ============================================================================
