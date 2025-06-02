import axios from "axios";
import authHeader from "./services/auth-header";

const API_URL = "http://localhost:8080/api";

async function testApiConnectivity() {
  try {
    console.log("====== API CONNECTIVITY TEST ======");

    const userStr = localStorage.getItem("user");
    console.log("User exists in localStorage:", !!userStr);

    if (!userStr) {
      console.log("No user found. Please login first.");
      return;
    }

    const user = JSON.parse(userStr);
    console.log("User ID:", user.id || user.userId || user._id || "None");
    console.log("Username:", user.username);

    const headers = authHeader();
    console.log("Auth header present:", !!headers.Authorization);

    console.log("\n----- Testing User Profile API -----");
    try {
      const userIdToUse = user.id || user.userId || user._id;
      if (!userIdToUse) {
        console.log("ERROR: Cannot test user profile - no user ID available");
      } else {
        console.log(`GET /users/${userIdToUse}`);
        const response = await axios.get(`${API_URL}/users/${userIdToUse}`, {
          headers,
          withCredentials: true,
        });
        console.log("SUCCESS! Status:", response.status);
        console.log("User data:", response.data);
      }
    } catch (error) {
      console.log("FAILED! Status:", error.response?.status);
      console.log("Error:", error.response?.data || error.message);
    }

    console.log("\n----- Testing User Resumes API -----");
    try {
      const userIdToUse = user.id || user.userId || user._id;
      if (!userIdToUse) {
        console.log("ERROR: Cannot test resumes - no user ID available");
      } else {
        console.log(`GET /resumes/user/${userIdToUse}`);
        const response = await axios.get(
          `${API_URL}/resumes/user/${userIdToUse}`,
          {
            headers,
            withCredentials: true,
          }
        );
        console.log("SUCCESS! Status:", response.status);
        console.log("Resume count:", response.data.length);
        console.log(
          "Resume IDs:",
          response.data.map((r) => r.id)
        );
      }
    } catch (error) {
      console.log("FAILED! Status:", error.response?.status);
      console.log("Error:", error.response?.data || error.message);
    }

    console.log("\n----- Testing Public Resumes API -----");
    try {
      console.log("GET /public/resumes");
      const response = await axios.get(`${API_URL}/public/resumes`);
      console.log("SUCCESS! Status:", response.status);
      console.log("Public resume count:", response.data.length);
    } catch (error) {
      console.log("FAILED! Status:", error.response?.status);
      console.log("Error:", error.response?.data || error.message);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testApiConnectivity();
