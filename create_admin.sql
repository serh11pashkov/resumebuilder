-- First, make sure the roles exist
INSERT INTO roles(name) VALUES('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Create admin user with encrypted password (password: admin123)
-- Note: This is using bcrypt encoding which is what Spring Security uses by default
INSERT INTO users(username, email, password)
VALUES('admin', 'admin@example.com', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Get the user_id and role_id
DO $$
DECLARE
    user_id BIGINT;
    admin_role_id BIGINT;
BEGIN
    SELECT id INTO user_id FROM users WHERE username = 'admin';
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ROLE_ADMIN';
    
    -- Insert into user_roles junction table
    INSERT INTO user_roles(user_id, role_id)
    VALUES(user_id, admin_role_id)
    ON CONFLICT ON CONSTRAINT user_roles_pkey DO NOTHING;
END
$$;
