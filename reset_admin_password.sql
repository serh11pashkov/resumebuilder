-- Reset admin password script
-- This script resets the admin password to 'admin123'

-- Update the admin user with the correct BCrypt-encoded password
UPDATE users 
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' 
WHERE username = 'admin';

-- Verify the update
SELECT id, username, email, substring(password from 1 for 30) as password_start
FROM users 
WHERE username = 'admin';
