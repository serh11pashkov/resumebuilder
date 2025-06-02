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

axiosInstance.interceptors.request.use(
  (config) => {
    const headers = authHeader();

    if (headers.Authorization) {
      config.headers.Authorization = headers.Authorization;

      if (process.env.NODE_ENV === "development") {
        const now = Date.now();
        if (now - lastAuthHeaderLogged > 60000) {
          console.log(
            "Authorization header added:",
            headers.Authorization.substring(0, 20) + "..."
          );
          lastAuthHeaderLogged = now;
        }
      }
    } else {
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

let activeRequests = 0;

axiosInstance.interceptors.response.use(
  (response) => {
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

    activeRequests = Math.max(0, activeRequests - 1);

    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);

    console.error("API Error:", error.message);

    if (process.env.NODE_ENV === "development") {
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(
          `URL: ${error.config.method.toUpperCase()} ${error.config.url}`
        );

        if (error.response.data) {
          console.error("Error data:", error.response.data);
        }

        if (error.response.status === 401 || error.response.status === 403) {
          console.error(
            "Authentication or authorization error - might need to re-login"
          );

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

axiosInstance.hasActiveRequests = () => activeRequests > 0;

axiosInstance.interceptors.request.use((config) => {
  activeRequests++;
  return config;
});

export default axiosInstance;
