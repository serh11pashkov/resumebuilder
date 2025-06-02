import { Link } from "react-router-dom";
import { Typography, Button, Box, Container } from "@mui/material";

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 8, mb: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        404 - Сторінку не знайдено
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        Нам не вдалося знайти сторінку, яку ви шукаєте.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          color="primary"
        >
          На головну
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
