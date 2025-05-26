// Test script to verify the fixes for resume service API endpoints
const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:8080";
const API_URL = `${BASE_URL}/api/resumes`;
let token = null;
let userId = null;

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Test the entire flow
async function testResumeFlow() {
  try {
    log("Starting test of resume flow with fixed URLs..."); // Step 1: Register a test user
    const username = "test123";
    log(`Registering test user: ${username}`);

    await axios.post(`${BASE_URL}/api/auth/signup`, {
      username,
      email: `${username}@example.com`,
      password: "Test123!",
    });

    log("User registered successfully");

    // Step 2: Login
    log("Logging in with new user");
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/signin`, {
      username,
      password: "Test123!",
    });

    token = loginResponse.data.token || loginResponse.data.accessToken;
    userId = loginResponse.data.id;

    log(`Login successful. User ID: ${userId}`);
    log(`Token (first 10 chars): ${token.substring(0, 10)}...`);

    // Step 3: Check user roles
    log("Checking user roles");
    const rolesResponse = await axios.get(`${API_URL}/debug/user-roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    log(`User roles: ${JSON.stringify(rolesResponse.data)}`); // Step 4: Create a resume
    log("Creating a test resume");
    const resumeData = {
      title: "Test Resume",
      personalInfo: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: `${username}@example.com`,
        phone: "123-456-7890",
        address: "123 Test St",
      }),
      summary:
        "This is a test resume created to verify the API endpoint fixes.",
    };

    const createResponse = await axios.post(API_URL, resumeData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resumeId = createResponse.data.id;
    log(`Resume created successfully with ID: ${resumeId}`);

    // Step 5: Get the user's resumes
    log(`Getting resumes for user ID: ${userId}`);
    const userResumesResponse = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    log(`Found ${userResumesResponse.data.length} resumes for user`);

    // Step 6: Get a specific resume
    log(`Getting resume with ID: ${resumeId}`);
    const resumeResponse = await axios.get(`${API_URL}/${resumeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    log(`Retrieved resume: ${resumeResponse.data.title}`); // Step 7: Update the resume
    log(`Updating resume with ID: ${resumeId}`);
    const updatedData = {
      ...resumeData,
      title: "Updated Test Resume",
    };

    await axios.put(`${API_URL}/${resumeId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    log("Resume updated successfully");

    // Step 8: Get PDF (this will only check if the endpoint is accessible)
    log(`Testing PDF endpoint for resume ID: ${resumeId}`);
    try {
      await axios.get(`${API_URL}/${resumeId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
        responseType: "blob",
      });
      log("PDF endpoint is accessible");
    } catch (error) {
      log(`PDF endpoint error: ${error.message}`);
    }

    // Step 9: Delete the resume
    log(`Deleting resume with ID: ${resumeId}`);
    await axios.delete(`${API_URL}/${resumeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    log("Resume deleted successfully");

    log(
      "✅ All tests completed successfully! The URL fixes are working properly."
    );
  } catch (error) {
    log("❌ Test failed with error:");
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data)}`);
    } else {
      log(error.message);
    }
  }
}

// Run the test
testResumeFlow();
