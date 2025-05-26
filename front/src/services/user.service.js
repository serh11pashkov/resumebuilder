import axiosInstance from "./api";

const USER_API_URL = "/users";

class UserService {
  getAll() {
    console.log("Getting all users");
    return axiosInstance.get(USER_API_URL);
  }

  getById(id) {
    console.log("Getting user by ID:", id);
    return axiosInstance.get(`${USER_API_URL}/${id}`);
  }

  updateProfile(id, userData) {
    console.log("Updating user profile:", id);
    return axiosInstance.put(`${USER_API_URL}/${id}`, userData);
  }

  changePassword(id, passwordData) {
    console.log("Changing password for user:", id);
    return axiosInstance.post(
      `${USER_API_URL}/${id}/change-password`,
      passwordData
    );
  }

  delete(id) {
    console.log("Deleting user:", id);
    return axiosInstance.delete(`${USER_API_URL}/${id}`);
  }

  // Method to update the stored user object after successful profile update
  updateStoredUserData(userData) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Update properties while preserving authorization data
      const updatedUser = { ...storedUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  }
}

const userService = new UserService();
export default userService;
