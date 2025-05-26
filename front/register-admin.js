// A simple script to register an admin user

const fetch = require("node-fetch");

async function registerAdmin() {
  try {
    console.log("Attempting to register admin user...");

    const userData = {
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      roles: ["admin"],
    };

    console.log(
      "Sending request with data:",
      JSON.stringify(userData, null, 2)
    );

    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const data = await response.json();
    console.log("Registration response:", data);

    if (response.ok) {
      console.log("Admin user created successfully!");
      console.log("You can now login with:");
      console.log("Username: admin");
      console.log("Password: admin123");

      // Try to login right away to verify credentials
      await testLogin("admin", "admin123");
    } else {
      console.error(
        "Failed to create admin user:",
        data.message || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function testLogin(username, password) {
  try {
    console.log(
      `Testing login with username: ${username} and password: ${password}`
    );

    const response = await fetch("http://localhost:8080/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    console.log("Login test response status:", response.status);

    const data = await response.json();
    if (response.ok) {
      console.log(
        "Login successful! Token:",
        data.accessToken
          ? data.accessToken.substring(0, 15) + "..."
          : "No token found"
      );
      console.log("User roles:", data.roles);
    } else {
      console.error("Login failed:", data.message || "Unknown error");
    }
  } catch (error) {
    console.error("Login test error:", error.message);
  }
}

registerAdmin();
