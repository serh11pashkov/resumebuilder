import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/debug-auth";

class DebugAuthService {
  getCurrentUser() {
    const headers = authHeader();
    return axios.get(API_URL + "/current-user", {
      headers,
      withCredentials: true,
    });
  }

  validateRoles() {
    const headers = authHeader();
    return axios.get(API_URL + "/validate-roles", {
      headers,
      withCredentials: true,
    });
  }

  validateAuthorization() {
    const headers = authHeader();
    return axios.get(API_URL + "/validate-authorization", {
      headers,
      withCredentials: true,
    });
  }

  debugAuthHeader() {
    const headers = authHeader();
    console.log("Current auth headers:", headers);
    
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        console.warn("No user in localStorage");
        return { success: false, error: "No user in localStorage" };
      }
      
      const user = JSON.parse(userStr);
      console.log("User from localStorage:", {
        ...user,
        accessToken: user.accessToken ? `${user.accessToken.substring(0, 20)}...` : undefined,
        token: user.token ? `${user.token.substring(0, 20)}...` : undefined
      });
      
      return { 
        success: true, 
        hasToken: !!(user.accessToken || user.token),
        username: user.username,
        roles: user.roles
      };
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return { success: false, error: error.message };
    }
  }
}

const debugAuthService = new DebugAuthService();
export default debugAuthService;
