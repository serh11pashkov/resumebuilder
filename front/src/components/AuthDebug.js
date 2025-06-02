import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import AuthService from "../services/auth.service";


const AuthDebug = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);

        
        if (!userData.id && !userData.userId && !userData._id) {
          setError(
            "User object exists but is missing ID fields (id, userId, or _id)"
          );
        }

        if (!userData.roles || !Array.isArray(userData.roles)) {
          setError((prev) => prev + "\nUser roles array is missing or invalid");
        }

        if (!userData.token && !userData.accessToken) {
          setError((prev) => prev + "\nNo authentication token found");
        }

        setStatus("User found in localStorage");
      } else {
        setStatus("No user found in localStorage");
        setError("You are not logged in. Please login first.");
      }
    } catch (err) {
      setStatus("Error checking user data");
      setError(err.message);
    }
  }, []);

  const fixUserData = () => {
    try {
      if (!user) {
        setError("No user data to fix");
        return;
      }

      
      const fixedUser = { ...user };
      let changes = [];

      
      if (!fixedUser.id && (fixedUser.userId || fixedUser._id)) {
        fixedUser.id = fixedUser.userId || fixedUser._id;
        changes.push("Added id field");
      }

      if (!fixedUser.userId && (fixedUser.id || fixedUser._id)) {
        fixedUser.userId = fixedUser.id || fixedUser._id;
        changes.push("Added userId field");
      }

      if (!fixedUser._id && (fixedUser.id || fixedUser.userId)) {
        fixedUser._id = fixedUser.id || fixedUser.userId;
        changes.push("Added _id field");
      }

      
      if (
        !fixedUser.id &&
        !fixedUser.userId &&
        !fixedUser._id &&
        fixedUser.username
      ) {
        const tempId = `user-${fixedUser.username}-${Date.now()}`;
        fixedUser.id = tempId;
        fixedUser.userId = tempId;
        fixedUser._id = tempId;
        changes.push("Created temporary ID based on username");
      }

      
      if (!fixedUser.roles) {
        fixedUser.roles = ["ROLE_USER"];
        changes.push("Added default roles array");
      } else if (!Array.isArray(fixedUser.roles)) {
        fixedUser.roles = [fixedUser.roles];
        changes.push("Converted roles to array");
      }

      
      if (changes.length > 0) {
        localStorage.setItem("user", JSON.stringify(fixedUser));
        setUser(fixedUser);
        setStatus("User data fixed: " + changes.join(", "));
        setError("");
      } else {
        setStatus("No changes needed");
      }
    } catch (err) {
      setError("Error fixing user data: " + err.message);
    }
  };

  const clearAndLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setStatus("User data cleared");
    setError("");
    window.location.href = "/login";
  };

  return (
    <Box sx={{ mt: 4, mb: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Authentication Debug
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Authentication Status
        </Typography>
        <Typography>{status}</Typography>

        {user && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Data
            </Typography>
            <Typography>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>ID fields:</strong>
              id: {user.id || "missing"}, userId: {user.userId || "missing"},
              _id: {user._id || "missing"}
            </Typography>
            <Typography>
              <strong>Roles:</strong>{" "}
              {user.roles ? JSON.stringify(user.roles) : "none"}
            </Typography>
            <Typography>
              <strong>Token:</strong>{" "}
              {user.token || user.accessToken ? "Present" : "Missing"}
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={fixUserData}>
          Fix User Data
        </Button>
        <Button variant="contained" color="secondary" onClick={clearAndLogout}>
          Clear Data & Logout
        </Button>
        <Button variant="outlined" onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};

export default AuthDebug;
