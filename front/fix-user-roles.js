// Script to fix role assignments for existing users
const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function fixUserRoles() {
  try {
    console.log("Starting role fixing script...");

    // Step 1: Login as admin
    console.log("\n1. Logging in as admin...");
    const adminLoginResponse = await axios.post(`${API_URL}/auth/signin`, {
      username: "admin",
      password: "123456",
    });

    if (
      !adminLoginResponse.data.token &&
      !adminLoginResponse.data.accessToken
    ) {
      throw new Error("Failed to get admin token");
    }

    const adminToken =
      adminLoginResponse.data.token || adminLoginResponse.data.accessToken;
    console.log("Admin login successful, token obtained");

    // Step 2: Try to get all users (if admin has permission)
    console.log("\n2. Fetching users...");
    try {
      const usersResponse = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      console.log(`Found ${usersResponse.data.length} users`);

      // Process each user to fix roles
      for (const user of usersResponse.data) {
        console.log(
          `\nChecking roles for user: ${user.username} (ID: ${user.id})`
        );

        // Skip admin users
        if (
          user.roles &&
          user.roles.some(
            (role) => role === "ROLE_ADMIN" || role.name === "ROLE_ADMIN"
          )
        ) {
          console.log("User already has admin role, skipping");
          continue;
        }

        // Check if user has any roles
        if (!user.roles || user.roles.length === 0) {
          console.log("User has no roles, needs fixing");

          // Implement the fix here - this depends on your backend API
          // Example: adding ROLE_USER to the user

          // This is a placeholder for the actual API call to add roles
          console.log("Would fix user roles here if API endpoint existed");
        } else {
          console.log("User roles:", user.roles);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users:");
      console.error(`Status: ${error.response?.status}`);
      console.error("Error data:", error.response?.data);

      console.log("\nAlternative approach: Execute SQL directly");
      console.log(`
SQL to fix user roles:

-- Ensure roles exist
INSERT INTO roles(name) VALUES('ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Get user and role IDs
DO $$
DECLARE
    user_role_id BIGINT;
BEGIN
    -- Get role ID
    SELECT id INTO user_role_id FROM roles WHERE name = 'ROLE_USER';
    
    -- Add ROLE_USER to all users who don't have any roles
    INSERT INTO user_roles (user_id, role_id)
    SELECT u.id, user_role_id
    FROM users u
    WHERE NOT EXISTS (
        SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
    );
    
    RAISE NOTICE 'Roles fixed for users without any roles';
END $$;
      `);
    }

    return "Role fixing process completed!";
  } catch (error) {
    console.error("Script failed:");
    console.error("Status:", error.response?.status);
    console.error("Response data:", error.response?.data);
    return "Script failed, see error details above";
  }
}

// Run the script
fixUserRoles()
  .then((result) => console.log(`\n${result}`))
  .catch((err) => console.error("Error running script:", err));
