-- Clean up duplicate roles in the database
-- This script will remove duplicate roles and ensure unique entries

-- First, create a temporary table with unique roles
CREATE TEMPORARY TABLE temp_roles AS
SELECT DISTINCT ON (name) id, name
FROM roles
ORDER BY name, id;

-- Delete all existing roles
DELETE FROM user_roles;
DELETE FROM roles;

-- Re-insert the unique roles
INSERT INTO roles (name)
SELECT name FROM temp_roles;

-- Verify cleanup
SELECT id, name FROM roles ORDER BY id;

-- Then re-create the admin user with proper roles
-- Get the role IDs
DO $$
DECLARE
    admin_role_id BIGINT;
    user_role_id BIGINT;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';
    SELECT id INTO user_role_id FROM roles WHERE name = 'ROLE_USER';
    
    -- Create admin user if not exists (with BCrypt encoded password)
    INSERT INTO users(username, email, password)
    VALUES('admin', 'admin@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG')
    ON CONFLICT (username) DO NOTHING;
    
    -- Get admin user ID
    DECLARE admin_user_id BIGINT;
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin';
    
    -- Assign both roles to admin user
    INSERT INTO user_roles(user_id, role_id) VALUES (admin_user_id, admin_role_id)
    ON CONFLICT DO NOTHING;
    
    INSERT INTO user_roles(user_id, role_id) VALUES (admin_user_id, user_role_id)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Roles cleaned up and admin user created with ID: %', admin_user_id;
END
$$;
