import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import AuthService from "../services/auth.service";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setMessage("Заповніть усі поля.");
      return false;
    }

    if (username.length < 3 || username.length > 20) {
      setMessage("Ім'я користувача повинно містити від 3 до 20 символів.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Введіть дійсну електронну пошту.");
      return false;
    }

    if (password.length < 6) {
      setMessage("Пароль має бути не менше 6 символів.");
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("Паролі не співпадають.");
      return false;
    }

    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);
    setLoading(true);
    if (validateForm()) {
      const roles = isAdmin ? ["admin", "user"] : ["user"];

      AuthService.register(username, email, password, roles)
        .then((response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        })
        .catch((error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setSuccessful(false);
          setMessage(resMessage);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };
  return (
    <Container sx={{ mt: 4, mb: 8, maxWidth: "none" }}>
      {" "}
      <Paper
        elevation={3}
        className="register-form"
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
          Зареєструватися
        </Typography>
        {!successful && (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
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
              id="email"
              label="Електронна пошта"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />{" "}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Підтвердіть пароль"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  color="primary"
                />
              }
              label="Зареєструватись як адміністратор"
              sx={{ mb: 2 }}
            />{" "}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="medium"
              disabled={loading}
              sx={{ py: 1, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Зареєструватися"
              )}
            </Button>
            {message && (
              <Alert severity={successful ? "success" : "error"} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Box>
        )}
        {successful && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
            <Typography variant="body1">
              Перенаправлення на сторінку входу...
            </Typography>
          </Box>
        )}{" "}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Вже маєте обліковий запис?{" "}
            <Link
              to="/login"
              style={{ color: "primary", textDecoration: "none" }}
            >
              Увійти
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
