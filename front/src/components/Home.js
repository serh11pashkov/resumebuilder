import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);

    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {" "}
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          px: 2,
          backgroundImage: darkMode
            ? "linear-gradient(to right, #2d3748, #1a365d)"
            : "linear-gradient(to right, #4880EC, #019CAD)",
          color: "white",
          borderRadius: 2,
          mb: 5,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Конструктор Резюме
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4 }}>
          Створюйте професійні резюме в кілька кліків
        </Typography>

        {currentUser ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Ласкаво просимо, <strong>{currentUser.username}</strong>!
            </Typography>
            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button
                component={Link}
                to="/resumes"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "#eaeaea" },
                }}
                startIcon={<VisibilityIcon />}
              >
                Мої резюме
              </Button>
              <Button
                component={Link}
                to="/resumes/create"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: "transparent",
                  color: "white",
                  border: "2px solid white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
                startIcon={<CreateIcon />}
              >
                Створити нове
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Почніть зі створення облікового запису або входу в систему
            </Typography>
            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "#eaeaea" },
                }}
              >
                Зареєструватися
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: "transparent",
                  color: "white",
                  border: "2px solid white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                Увійти
              </Button>
            </Box>
          </Box>
        )}
      </Box>{" "}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              backgroundColor: darkMode ? "#333333" : "#ffffff",
              color: darkMode ? "#ffffff" : "inherit",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Легке створення резюме
              </Typography>
              <Typography
                variant="body1"
                color={darkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary"}
              >
                Створюйте професійні резюме за допомогою нашого інтуїтивно
                зрозумілого редактора.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              backgroundColor: darkMode ? "#333333" : "#ffffff",
              color: darkMode ? "#ffffff" : "inherit",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Різні формати
              </Typography>
              <Typography
                variant="body1"
                color={darkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary"}
              >
                Зберігайте ваше резюме у форматі PDF для зручного надсилання
                потенційним роботодавцям.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              backgroundColor: darkMode ? "#333333" : "#ffffff",
              color: darkMode ? "#ffffff" : "inherit",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Управління резюме
              </Typography>
              <Typography
                variant="body1"
                color={darkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary"}
              >
                Легко керуйте всіма вашими резюме в одному зручному місці.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
