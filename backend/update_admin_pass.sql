UPDATE users SET password = '$2a$12$NxD.f9JZ9fDo2K4D8bQcWebnIYIiQ1ywbR5BqjiJjohijmeY.YMve' WHERE username = 'admin';
SELECT 'Password updated' as status;
SELECT username, substring(password, 1, 10) as pass_prefix FROM users WHERE username = 'admin';
