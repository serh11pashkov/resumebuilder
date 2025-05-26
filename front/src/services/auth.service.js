import axiosInstance from "./api";

const AUTH_API_URL = "/auth";

class AuthService {
  login(username, password) {
    console.log("Attempting login for:", username);
    return axiosInstance
      .post(`${AUTH_API_URL}/signin`, {
        username,
        password,
      })
      .then((response) => {
        // Log the response for debugging
        console.log(
          "Login response received:",
          JSON.stringify(response.data, null, 2)
        );

        if (response.data) {
          // Handle different token property naming (accessToken or token)
          if (response.data.accessToken) {
            console.log(
              "JWT accessToken received:",
              response.data.accessToken.substring(0, 15) + "..."
            );

            // Ensure roles is an array
            const roles = response.data.roles || [];
            console.log("User roles:", roles);

            // Make a copy of the response data to ensure we have a consistent structure
            const userData = {
              ...response.data,
              token: response.data.accessToken,
              roles: roles,
            };
            localStorage.setItem("user", JSON.stringify(userData));
            return userData;
          } else if (response.data.token) {
            console.log(
              "JWT token received:",
              response.data.token.substring(0, 15) + "..."
            );

            // Ensure roles is an array
            if (!response.data.roles) {
              console.warn("No roles in response, adding empty array");
              response.data.roles = [];
            }

            // Store the user data in localStorage
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
          } else {
            console.error("No token in response:", response.data);
            throw new Error("Authentication failed: No token received");
          }
        } else {
          console.error("Empty response data");
          throw new Error("Authentication failed: Empty response");
        }
      });
  }
  logout() {
    console.log("Logging out user");
    localStorage.removeItem("user");
  }

  register(username, email, password, roles = []) {
    console.log("Registering new user:", username, "with roles:", roles);
    return axiosInstance.post(`${AUTH_API_URL}/signup`, {
      username,
      email,
      password,
      roles,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user;
  }
  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Check if user has roles property and it's an array
    if (!user.roles || !Array.isArray(user.roles)) {
      console.warn("User object has no roles array:", user);
      return false;
    }

    // Check if the role is in the user's roles array
    return user.roles.some((role) =>
      typeof role === "string"
        ? role === requiredRole
        : role.name === requiredRole
    );
  }

  // Get the auth header with Bearer token
  getAuthHeader() {
    const user = this.getCurrentUser();
    if (!user || !user.token) return null;
    return `Bearer ${user.token}`;
  }
}

export default new AuthService();
