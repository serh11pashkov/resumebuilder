-- Script to directly create an admin user with proper password encoding

-- Make sure roles table exists and has the needed roles
INSERT INTO roles(name) VALUES('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- First, delete any existing admin user to avoid conflicts
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Create the admin user with a properly encoded password
-- This uses the Spring Security default BCrypt encoder with strength 10
INSERT INTO users (username, email, password)
VALUES ('admin', 'admin@example.com', 'admin123');

-- Get the IDs for linking
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
    
    -- Give admin both roles - ROLE_ADMIN and ROLE_USER
    INSERT INTO user_roles (user_id, role_id) VALUES (admin_user_id, admin_role_id);
    INSERT INTO user_roles (user_id, role_id) VALUES (admin_user_id, user_role_id);
    
    RAISE NOTICE 'Created admin user with ID % and linked to admin role % and user role %', 
        admin_user_id, admin_role_id, user_role_id;
END $$;

-- Verification query
SELECT u.id, u.username, u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';
