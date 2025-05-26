// Run this script with: node debug-auth.js

const axios = require("axios");

const API_URL = "http://localhost:8080/api";

// Test user authentication
async function testAuth() {
  try {
    console.log("Attempting to login as user");

    // Step 1: Login with test user
    const loginResponse = await axios.post(`${API_URL}/auth/signin`, {
      username: "user",
      password: "user123",
    });

    console.log("Login successful!");
    console.log(
      "Token:",
      loginResponse.data.token || loginResponse.data.accessToken
    );
    console.log("User roles:", loginResponse.data.roles);

    // Step 2: Test accessing own resumes with token
    const token = loginResponse.data.token || loginResponse.data.accessToken;
    const userId = loginResponse.data.id;

    console.log(`Testing access to user ${userId}'s resumes`);

    const resumesResponse = await axios.get(
      `${API_URL}/resumes/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Successfully accessed resumes:", resumesResponse.data);

    // Step 3: Test accessing debug/user-roles endpoint
    console.log("Testing debug/user-roles endpoint");

    const rolesResponse = await axios.get(
      `${API_URL}/resumes/debug/user-roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("User roles debug info:", rolesResponse.data);

    return "All tests passed!";
  } catch (error) {
    console.error("Test failed:", error);
    console.log("Status:", error.response?.status);
    console.log("Response data:", error.response?.data);
    return "Tests failed, see console for details";
  }
}

// Execute the test and log results
console.log("Starting authentication debug tests...");
testAuth()
  .then((result) => console.log("Test result:", result))
  .catch((err) => console.error("Unexpected error:", err));
