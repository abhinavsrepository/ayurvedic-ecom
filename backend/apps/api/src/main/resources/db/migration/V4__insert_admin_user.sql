-- Insert default admin user
-- Password: admin123 (BCrypt hash with strength 12 to match SecurityConfig)
-- IMPORTANT: Change this password after first login!

-- This is a valid BCrypt hash for 'admin123' with 12 rounds
INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled)
VALUES (
    'admin',
    'admin@ayurveda.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzLNhpe8i.',
    'Admin User',
    true,
    false
) ON CONFLICT (username) DO NOTHING;

-- Assign ADMIN role to the admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;
