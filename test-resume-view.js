const axios = require("axios");
const API_URL = "http://localhost:8080/api";

// Test credentials
const testUser = {
  username: `testuser_${Math.floor(Math.random() * 100000)}`,
  email: `test${Math.floor(Math.random() * 100000)}@example.com`,
  password: "password123",
};

let accessToken = "";
let userId = null;
let resumeId = null;

const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Step 1: Register a new user
const registerUser = async () => {
  try {
    log(`Registering test user: ${testUser.username}`);
    const response = await axios.post(`${API_URL}/auth/signup`, testUser);
    log(`✅ User registered successfully: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    log(
      `❌ Registration failed: ${JSON.stringify(
        error.response?.data || error.message
      )}`
    );
    return false;
  }
};

// Step 2: Login
const loginUser = async () => {
  try {
    log(`Logging in as: ${testUser.username}`);
    const response = await axios.post(`${API_URL}/auth/signin`, {
      username: testUser.username,
      password: testUser.password,
    });

    accessToken = response.data.accessToken;
    userId = response.data.id;

    log(`✅ Login successful, user ID: ${userId}`);
    return true;
  } catch (error) {
    log(
      `❌ Login failed: ${JSON.stringify(
        error.response?.data || error.message
      )}`
    );
    return false;
  }
};

// Step 3: Debug Auth Status
const checkAuthStatus = async () => {
  try {
    log("Checking auth status");
    const response = await axios.get(`${API_URL}/debug/auth-status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    log(`✅ Auth status: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    log(
      `❌ Auth status check failed: ${JSON.stringify(
        error.response?.data || error.message
      )}`
    );
    return false;
  }
};

// Step 4: Create a test resume
const createTestResume = async () => {
  try {
    log("Creating test resume");
    const testResume = {
      userId: userId,
      title: "Test Resume",
      summary: "This is a test resume for API verification",
      contactDetails: "test@example.com",
      personalInfo: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "123-456-7890",
        address: "123 Test St, Test City, TS 12345",
      }),
      skills: JSON.stringify(["JavaScript", "API Testing", "Debugging"]),
      education: JSON.stringify([
        {
          school: "Test University",
          degree: "Computer Science",
          date: "2020-2024",
        },
      ]),
      experience: JSON.stringify([
        {
          company: "Test Corp",
          position: "Software Engineer",
          date: "2020-Present",
          description: "Working on test software",
        },
      ]),
      isPublic: false,
      templateName: "classic",
    };

    const response = await axios.post(`${API_URL}/resumes`, testResume, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    resumeId = response.data.id;
    log(`✅ Resume created with ID: ${resumeId}`);
    return true;
  } catch (error) {
    log(
      `❌ Resume creation failed: ${JSON.stringify(
        error.response?.data || error.message
      )}`
    );
    return false;
  }
};

// Step 5: Get resume by ID (View button functionality)
const getResumeById = async () => {
  try {
    log(`Getting resume by ID: ${resumeId}`);
    const response = await axios.get(`${API_URL}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    log(`✅ Successfully retrieved resume: ${response.data.title}`);
    return true;
  } catch (error) {
    log(
      `❌ Resume retrieval failed: ${JSON.stringify(
        error.response?.data || error.message
      )}`
    );
    return false;
  }
};

// Step 6: Test resume permissions
const testResumePermissions = async () => {
  try {
    log(`Testing resume permissions for ID: ${resumeId}`);
    const response = await axios.get(
      `${API_URL}/resumes/debug/check-resume-permissions/${resumeId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );

    log(`✅ Permission check result: ${JSON.stringify(response.data)}`);
    return response.data.accessAllowed;
  } catch (error) {
    log(
      `❌ Permission check failed: ${JSON.stringify(
        error.response?.data || error.message
      )}`
    );
    return false;
  }
};

// Step 7: Clean up - delete the test resume
const deleteTestResume = async () => {
  try {
    log(`Deleting test resume with ID: ${resumeId}`);
    const response = await axios.delete(`${API_URL}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    log(`✅ Resume deleted successfully`);
    return true;
  } catch (error) {
    log(
      `❌ Resume deletion failed: ${JSON.stringify(
        error.response?.data || error.message
      )}`
    );
    return false;
  }
};

// Run all tests
const runTests = async () => {
  log("Starting test of resume view functionality...");

  if (!(await registerUser())) return;
  if (!(await loginUser())) return;
  if (!(await checkAuthStatus())) return;
  if (!(await createTestResume())) return;
  if (!(await testResumePermissions())) return;
  if (!(await getResumeById())) return;
  if (!(await deleteTestResume())) return;

  log("✅ All tests passed successfully!");
};

// Run the tests
runTests().catch((error) => {
  log(`❌ Unexpected error: ${error.message}`);
});
