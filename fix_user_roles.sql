-- Script to fix role assignments for existing users

-- Make sure roles table exists and has the needed roles
INSERT INTO roles(name) VALUES('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Get role IDs
DO $$
DECLARE
    admin_role_id BIGINT;
    user_role_id BIGINT;
    admin_count INT;
    users_fixed INT;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';
    SELECT id INTO user_role_id FROM roles WHERE name = 'ROLE_USER';
    
    RAISE NOTICE 'ROLE_ADMIN ID: %, ROLE_USER ID: %', admin_role_id, user_role_id;
    
    -- Count how many admin users exist
    SELECT COUNT(*) INTO admin_count 
    FROM user_roles 
    WHERE role_id = admin_role_id;
    
    RAISE NOTICE 'Current admin users: %', admin_count;
    
    -- If no admin exists, make the 'admin' user an admin
    IF admin_count = 0 THEN
        -- Find or create admin user
        INSERT INTO users (username, email, password, created_at, updated_at)
        VALUES ('admin', 'admin@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', NOW(), NOW())
        ON CONFLICT (username) DO NOTHING;
        
        -- Get admin user ID
        WITH admin_user AS (
            SELECT id FROM users WHERE username = 'admin'
        )
        INSERT INTO user_roles (user_id, role_id)
        SELECT admin_user.id, admin_role_id
        FROM admin_user
        WHERE NOT EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = admin_user.id 
            AND ur.role_id = admin_role_id
        );
        
        -- Also give admin the user role
        WITH admin_user AS (
            SELECT id FROM users WHERE username = 'admin'
        )
        INSERT INTO user_roles (user_id, role_id)
        SELECT admin_user.id, user_role_id
        FROM admin_user
        WHERE NOT EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = admin_user.id 
            AND ur.role_id = user_role_id
        );
        
        RAISE NOTICE 'Admin user created or updated with admin and user roles';
    END IF;
    
    -- Add ROLE_USER to all users who don't have any roles
    WITH users_without_roles AS (
        SELECT u.id
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        WHERE ur.user_id IS NULL
    ),
    inserted AS (
        INSERT INTO user_roles (user_id, role_id)
        SELECT id, user_role_id
        FROM users_without_roles
        RETURNING user_id
    )
    SELECT COUNT(*) INTO users_fixed FROM inserted;
    
    RAISE NOTICE 'Fixed % users without any roles', users_fixed;
END $$;

-- Verification query
SELECT u.id, u.username, u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
ORDER BY u.id, r.name;
