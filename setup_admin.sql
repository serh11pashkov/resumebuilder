-- Script to create admin user and required roles
-- This script handles both role creation and admin user setup

-- Make sure roles table exists and has the needed roles
INSERT INTO roles(name) VALUES('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Create admin user with BCrypt-encoded password (password: admin123)
-- $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG is the encoded value of 'admin123'
INSERT INTO users(username, email, password)
VALUES('admin', 'admin@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG')
ON CONFLICT (username) DO NOTHING;

-- Get the user_id and role_ids, then assign both roles to admin
DO $$
DECLARE
    admin_user_id BIGINT;
    admin_role_id BIGINT;
    user_role_id BIGINT;
BEGIN
    -- Get user ID
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin';
    
    -- Get role IDs
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';
    SELECT id INTO user_role_id FROM roles WHERE name = 'ROLE_USER';
    
    -- Give admin the ADMIN role
    INSERT INTO user_roles(user_id, role_id)
    VALUES(admin_user_id, admin_role_id)
    ON CONFLICT ON CONSTRAINT user_roles_pkey DO NOTHING;
    
    -- Give admin the USER role
    INSERT INTO user_roles(user_id, role_id)
    VALUES(admin_user_id, user_role_id)
    ON CONFLICT ON CONSTRAINT user_roles_pkey DO NOTHING;
    
    RAISE NOTICE 'Admin user (ID: %) has been assigned ROLE_ADMIN and ROLE_USER', admin_user_id;
END
$$;

-- Verification query
SELECT u.id, u.username, u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin'
ORDER BY r.name;
