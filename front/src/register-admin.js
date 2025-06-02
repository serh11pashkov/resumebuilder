import axios from "axios";

const registerAdmin = async () => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/signup", {
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      roles: ["admin"],
    });

    console.log("Admin registered successfully:", response.data);
    console.log("You can now log in with username: admin, password: admin123");
  } catch (error) {
    console.error(
      "Admin registration failed:",
      error.response?.data || error.message
    );
  }
};

registerAdmin();
