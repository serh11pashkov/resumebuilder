-- Complete admin reset script
-- This script will completely recreate the admin user

-- First, remove the admin user and their role assignments
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Now create a new admin user with a plain password (will be encoded by Spring Security)
-- Note: We deliberately use a simple plain password here that will be encoded by the application
INSERT INTO users (username, email, password)
VALUES ('admin', 'admin@example.com', 'admin123');

-- Get the admin user ID
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
    
    -- Assign roles to admin
    INSERT INTO user_roles (user_id, role_id) VALUES (admin_user_id, admin_role_id);
    INSERT INTO user_roles (user_id, role_id) VALUES (admin_user_id, user_role_id);
    
    RAISE NOTICE 'Created new admin user with ID: %', admin_user_id;
END
$$;

-- Verify the creation
SELECT id, username, email, substring(password from 1 for 30) as password_preview
FROM users 
WHERE username = 'admin';
