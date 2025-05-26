import axios from "axios";
import authHeader from "./auth-header";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000, // Increase timeout to 10 seconds
  withCredentials: true,
});

// Track the last time we logged auth headers to reduce console spam
let lastAuthHeaderLogged = 0;

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Always add the auth token if it exists
    const headers = authHeader();

    if (headers.Authorization) {
      config.headers.Authorization = headers.Authorization;

      // Only log in development and limit frequency to reduce console spam
      if (process.env.NODE_ENV === "development") {
        const now = Date.now();
        if (now - lastAuthHeaderLogged > 60000) {
          // Only log once per minute
          console.log(
            "Authorization header added:",
            headers.Authorization.substring(0, 20) + "..."
          );
          lastAuthHeaderLogged = now;
        }
      }
    } else {
      // Log missing auth header for non-public endpoints
      if (
        !config.url.includes("/auth/signin") &&
        !config.url.includes("/auth/signup") &&
        process.env.NODE_ENV === "development"
      ) {
        console.warn("No auth header available for request to:", config.url);
      }
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Track the number of active API requests to prevent UI blinking
let activeRequests = 0;

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Only log non-GET requests in development to reduce console spam
    if (
      process.env.NODE_ENV === "development" &&
      response.config.method !== "get"
    ) {
      console.log(
        `API Success: ${
          response.status
        } ${response.config.method.toUpperCase()} ${response.config.url}`
      );
    }

    // Decrement active requests counter
    activeRequests = Math.max(0, activeRequests - 1);

    return response;
  },
  (error) => {
    // Decrement active requests counter even on error
    activeRequests = Math.max(0, activeRequests - 1);

    // Enhanced error logging
    console.error("API Error:", error.message);

    // In development, we can log more details
    if (process.env.NODE_ENV === "development") {
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(
          `URL: ${error.config.method.toUpperCase()} ${error.config.url}`
        );

        // Log the error data if available
        if (error.response.data) {
          console.error("Error data:", error.response.data);
        }

        // Handle authentication errors
        if (error.response.status === 401 || error.response.status === 403) {
          console.error(
            "Authentication or authorization error - might need to re-login"
          );

          // Check if localStorage has a user but API returns 401/403
          // This could indicate the token is invalid or expired
          const user = localStorage.getItem("user");
          if (user) {
            console.warn(
              "User exists in localStorage but request was rejected - token may be invalid"
            );
          }
        }
      } else if (error.request) {
        console.error("No response received from server");
        console.error(
          `URL: ${error.config.method.toUpperCase()} ${error.config.url}`
        );
      }
    }

    return Promise.reject(error);
  }
);

// Helper method to check if there are active requests
axiosInstance.hasActiveRequests = () => activeRequests > 0;

// Before making a request, increment the counter
axiosInstance.interceptors.request.use((config) => {
  activeRequests++;
  return config;
});

export default axiosInstance;
