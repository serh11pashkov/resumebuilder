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
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  AccountCircle,
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

      const userId = user.id || user.userId || user._id;
      console.log("UserSettings - User object from localStorage:", user);
      console.log("UserSettings - Using user ID:", userId);

      if (!userId) {
        console.error("UserSettings - No user ID found in user object:", user);
        setError(
          "Не вдалося ідентифікувати користувача. Спробуйте вийти та увійти знову."
        );
        setLoading(false);

        if (user.username) {
          console.log(
            "UserSettings - Trying to use username as fallback:",
            user.username
          );

          setFormData((prevData) => ({
            ...prevData,
            firstName: "",
            lastName: "",
            email: user.email || "",
          }));
        }
        return;
      }

      UserService.getById(userId)
        .then((response) => {
          const data = response.data;
          console.log("UserSettings - User profile data received:", data);
          setFormData((prevData) => ({
            ...prevData,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || user.email || "",
          }));
          setLoading(false);
          console.log("Successfully loaded user profile:", data);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          setError(
            "Не вдалося завантажити дані профілю: " +
              (err.response?.status || err.message)
          );
          setLoading(false);
        });
    } else {
      setError("Користувач не аутентифікований.");
      setLoading(false);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswordChange = () => {
    if (!formData.currentPassword) {
      setError("Будь ласка, введіть поточний пароль.");
      return false;
    }

    if (!formData.newPassword) {
      setError("Будь ласка, введіть новий пароль.");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError("Новий пароль повинен містити не менше 6 символів.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Нові паролі не співпадають.");
      return false;
    }

    return true;
  };

  const validateProfileUpdate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Будь ласка, введіть дійсну адресу електронної пошти.");
      return false;
    }
    return true;
  };
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!validateProfileUpdate()) {
      setLoading(false);
      return;
    }

    const userId = currentUser?.id || currentUser?.userId || currentUser?._id;
    if (!userId) {
      setError(
        "Не вдалося визначити ідентифікатор користувача. Спробуйте вийти та увійти знову."
      );
      setLoading(false);
      return;
    }

    const profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    console.log("Updating profile for user ID:", userId);
    UserService.updateProfile(userId, profileData)
      .then((response) => {
        setMessage("Профіль успішно оновлено.");
        setLoading(false);

        const user = AuthService.getCurrentUser();
        user.email = formData.email;

        if ("firstName" in user) user.firstName = formData.firstName;
        if ("lastName" in user) user.lastName = formData.lastName;
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Updated user data in localStorage:", user);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        const resMessage =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          err.toString();
        setError(resMessage);
        setLoading(false);
      });
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!validatePasswordChange()) {
      setLoading(false);
      return;
    }

    const userId = currentUser?.id || currentUser?.userId || currentUser?._id;
    if (!userId) {
      setError(
        "Не вдалося визначити ідентифікатор користувача. Спробуйте вийти та увійти знову."
      );
      setLoading(false);
      return;
    }

    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    console.log("Changing password for user ID:", userId);
    UserService.changePassword(userId, passwordData)
      .then((response) => {
        setMessage("Пароль успішно змінено.");
        setFormData((prevData) => ({
          ...prevData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setLoading(false);
        console.log("Password changed successfully");
      })
      .catch((err) => {
        console.error("Error changing password:", err);
        const resMessage =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          err.toString();
        setError(
          resMessage || "Неправильний поточний пароль або інша помилка."
        );
        setLoading(false);
      });
  };

  if (loading && !currentUser) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Завантаження налаштувань...
        </Typography>
      </Container>
    );
  }
  return (
    <Container sx={{ mt: 4, mb: 8, maxWidth: "none" }}>
      {" "}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontSize: "1.5rem" }}
      >
        Налаштування облікового запису
      </Typography>{" "}
      <Paper
        elevation={3}
        className="settings-form"
        sx={{
          p: 4,
          borderRadius: 2,
          mt: 3,
          width: "600px",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Профіль" />
            <Tab label="Змінити пароль" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
              {" "}
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  bgcolor: "primary.main",
                  fontSize: 64,
                }}
              >
                <AccountCircle fontSize="inherit" />
              </Avatar>
              <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                {currentUser?.username || "Користувач"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.roles.includes("ROLE_ADMIN")
                  ? "Адміністратор"
                  : "Користувач"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Box component="form" onSubmit={handleProfileUpdate}>
                {message && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {message}
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}{" "}
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ім'я"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {" "}
                    <TextField
                      fullWidth
                      label="Прізвище"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {" "}
                    <TextField
                      fullWidth
                      required
                      label="Електронна пошта"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                </Grid>{" "}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  size="medium"
                  disabled={loading}
                  sx={{ mt: 3, py: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Зберегти зміни"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Password Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box component="form" onSubmit={handlePasswordChange}>
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}{" "}
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Поточний пароль"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
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
              <Grid item xs={12}>
                {" "}
                <TextField
                  fullWidth
                  required
                  label="Новий пароль"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  size="small"
                  helperText="Пароль має бути не менше 6 символів"
                />
              </Grid>
              <Grid item xs={12}>
                {" "}
                <TextField
                  fullWidth
                  required
                  label="Підтвердіть новий пароль"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
            </Grid>{" "}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              disabled={loading}
              sx={{ mt: 3, py: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Змінити пароль"
              )}
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      style={{ padding: "16px 0" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default UserSettings;
