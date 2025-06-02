import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import ResumeService from "../services/resume.service";
import { TEMPLATES } from "./templates";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const PublicResumeView = () => {
  const { url } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("PublicResumeView - URL parameter:", url);

  const loadPublicResume = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ResumeService.getPublicResumeByUrl(url);
      setResume(response.data);
    } catch (error) {
      console.error("Error loading public resume:", error);
      setError("Це резюме недоступне або встановлено як приватне.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    loadPublicResume();
  }, [loadPublicResume]);
  const handleDownloadPDF = async () => {
    try {
      const response = await ResumeService.getPublicResumePdf(url);

      const file = new Blob([response.data], { type: "application/pdf" });

      const fileURL = URL.createObjectURL(file);

      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute(
        "download",
        `${resume.title.replace(/\s+/g, "_")}.pdf`
      );
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert(
        "Помилка при завантаженні PDF. Будь ласка, спробуйте знову пізніше."
      );
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Box sx={{ mt: 2 }}>Завантаження резюме...</Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            component={Link}
            to="/public/gallery"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Повернутися до галереї
          </Button>
        </Box>
      </Container>
    );
  }

  if (!resume) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Резюме не знайдено.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            component={Link}
            to="/public/gallery"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Повернутися до галереї
          </Button>
        </Box>
      </Container>
    );
  }
  const templateName = resume.templateName || "classic";
  console.log("PublicResumeView - Template name:", templateName);
  console.log(
    "PublicResumeView - Available templates:",
    Object.keys(TEMPLATES)
  );

  const Template = TEMPLATES[templateName] || TEMPLATES.classic;
  console.log(
    "PublicResumeView - Selected template:",
    Template ? "Found" : "Not found"
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Button
          component={Link}
          to="/public/gallery"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Назад до галереї
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleDownloadPDF}
        >
          Завантажити PDF
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Template resume={resume} />
      </Paper>
    </Container>
  );
};

export default PublicResumeView;
