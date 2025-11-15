-- Accept MD5 password from any host, any user, any DB
ALTER SYSTEM SET password_encryption = 'md5';
ALTER SYSTEM SET listen_addresses = '*';

-- Reload config immediately
SELECT pg_reload_conf();

-- Ensure postgres user has MD5 password
ALTER USER postgres PASSWORD 'postgres';
