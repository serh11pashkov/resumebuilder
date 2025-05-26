import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  AccountCircle,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

function UserSettings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFormData((prevState) => ({
        ...prevState,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }));

      // Get dark mode preference from local storage
      const isDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkModeEnabled(isDarkMode);
    }
    setLoading(false);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset messages when changing tabs
    setMessage("");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleToggleDarkMode = () => {
    const newValue = !darkModeEnabled;
    setDarkModeEnabled(newValue);
    localStorage.setItem("darkMode", newValue.toString());
    // Apply dark mode to body
    if (newValue) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    setMessage("Theme preference saved");
  };

  const handleToggleNotifications = () => {
    setEmailNotifications(!emailNotifications);
    setMessage("Notification preferences saved");
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!currentUser) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const userData = {
      email: formData.email,
      // Add other fields as needed
    };

    UserService.updateProfile(currentUser.id, userData)
      .then((response) => {
        setMessage("Profile updated successfully");

        // Update the current user in the local storage
        const updatedUser = UserService.updateStoredUserData({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        if (updatedUser) {
          setCurrentUser(updatedUser);
        }
      })
      .catch((err) => {
        setError(
          "Failed to update profile: " +
            (err.response?.data?.message || err.message)
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!currentUser) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    UserService.changePassword(currentUser.id, passwordData)
      .then((response) => {
        setMessage("Password updated successfully");
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        setError(
          "Failed to update password: " +
            (err.response?.data?.message || err.message)
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading && !currentUser) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      <Paper elevation={3} sx={{ mt: 3, p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Profile" />
            <Tab label="Security" />
            <Tab label="Preferences" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {/* Profile Tab */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleUpdateProfile} noValidate>
            <Grid container spacing={3} alignItems="flex-start">
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    bgcolor: "primary.main",
                    fontSize: "3rem",
                  }}
                >
                  {formData.firstName && formData.lastName ? (
                    `${formData.firstName[0]}${formData.lastName[0]}`
                  ) : (
                    <AccountCircle fontSize="large" />
                  )}
                </Avatar>
                <Typography variant="subtitle1" gutterBottom>
                  {currentUser?.username}
                </Typography>
                {currentUser?.roles?.map((role, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.secondary"
                  >
                    {role.replace("ROLE_", "")}
                  </Typography>
                ))}
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Security Tab */}
        {activeTab === 1 && (
          <Box component="form" onSubmit={handleUpdatePassword} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                  error={
                    formData.newPassword !== formData.confirmPassword &&
                    formData.confirmPassword !== ""
                  }
                  helperText={
                    formData.newPassword !== formData.confirmPassword &&
                    formData.confirmPassword !== ""
                      ? "Passwords do not match"
                      : ""
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<SaveIcon />}
                disabled={
                  loading || formData.newPassword !== formData.confirmPassword
                }
              >
                {loading ? <CircularProgress size={24} /> : "Update Password"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Preferences Tab */}
        {activeTab === 2 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkModeEnabled}
                      onChange={handleToggleDarkMode}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Switch between light and dark theme for the application
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={handleToggleNotifications}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Receive email notifications when your resume is viewed
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default UserSettings;
