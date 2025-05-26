// Register an admin user through the application API
// This ensures the password is properly encoded with BCrypt
const axios = require("axios");

const API_URL = "http://localhost:8080/api/auth";
const ADMIN_USERNAME = "admin2";
const ADMIN_PASSWORD = "admin123";
const ADMIN_EMAIL = "admin2@example.com";

async function registerAdmin() {
  try {
    console.log(`Registering admin user: ${ADMIN_USERNAME}`);

    // Step 1: Register the admin user
    const registerResponse = await axios.post(`${API_URL}/signup`, {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      roles: ["admin", "user"],
    });

    console.log("Admin user registration successful!");
    console.log(`Response: ${JSON.stringify(registerResponse.data)}`);

    // Step 2: Login to verify it works
    console.log(`\nLogging in as ${ADMIN_USERNAME}...`);
    const loginResponse = await axios.post(`${API_URL}/signin`, {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });

    console.log("Login successful!");
    console.log(
      `Token received: ${
        loginResponse.data.token
          ? loginResponse.data.token.substring(0, 20) + "..."
          : "No token"
      }`
    );
    console.log(`User roles: ${JSON.stringify(loginResponse.data.roles)}`);

    console.log(
      "\n✅ Admin user created successfully! You can now log in with:"
    );
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error("❌ Error:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(error.message);
    }
  }
}

// Run the function
registerAdmin();
