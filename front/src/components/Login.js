import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import AuthService from "../services/auth.service";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    
    setMessage("");

    
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      console.log(
        "Login: User already logged in, redirecting to resumes",
        currentUser.username
      );
      window.location.href = "/resumes";
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("Заповніть усі поля.");
      setLoading(false);
      return;
    }

    console.log(`Login: Attempting to log in user: ${username}`);

    AuthService.login(username, password)
      .then((userData) => {
        console.log("Login: Login successful, user data:", userData);
        console.log("Login: Redirecting to resumes page");

        
        window.location.href = "/resumes";
      })
      .catch((error) => {
        console.error("Login: Login failed", error);

        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        console.error("Login: Error message", resMessage);

        setLoading(false);
        setMessage(resMessage);
      });
  };
  return (
    <Container sx={{ mt: 4, mb: 8, maxWidth: "none" }}>
      {" "}
      <Paper
        elevation={3}
        className="login-form"
        sx={{
          p: 4,
          borderRadius: 2,
          width: "450px",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        {" "}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontSize: "1.5rem" }}
        >
          Увійти в систему
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          {" "}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Ім'я користувача"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />{" "}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mb: 3 }}
          />{" "}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="medium"
            disabled={loading}
            sx={{ py: 1 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Увійти"
            )}
          </Button>
          {message && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </Box>{" "}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Немає облікового запису?{" "}
            <Link
              to="/register"
              style={{ color: "primary", textDecoration: "none" }}
            >
              Зареєструватися
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
