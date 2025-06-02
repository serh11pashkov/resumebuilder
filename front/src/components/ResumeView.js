import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ResumeService from "../services/resume.service";
import "./templates/index.css";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  FormatPaint as ThemeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { TEMPLATES, TEMPLATE_LIST } from "./templates";

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState("classic");
  const [showThemesDialog, setShowThemesDialog] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const previewRef = useRef(null);
  useEffect(() => {
    loadResume();

    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, [id]);
  useEffect(() => {
    if (resume && resume.templateName) {
      setCurrentTemplate(resume.templateName);
    }
  }, [resume]);

  const loadResume = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ResumeService.getById(id);
      setResume(response.data);
      setIsPublic(response.data.isPublic);
      setLoading(false);
    } catch (error) {
      console.error("Error loading resume:", error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Ви впевнені, що хочете видалити це резюме?")) {
      try {
        await ResumeService.delete(id);
        navigate("/resumes");
      } catch (error) {
        console.error("Error deleting resume:", error);
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
      }
    }
  };
  const handleDownloadPDF = async () => {
    try {
      const response = await ResumeService.getPdf(id);

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
      setSnackbarMessage(
        "Помилка при завантаженні PDF. Будь ласка, спробуйте знову."
      );
      setSnackbarOpen(true);
    }
  };
  const handleChangeTemplate = async (template) => {
    setShowThemesDialog(false);

    if (template === currentTemplate) return;

    try {
      const updatedResume = { ...resume, templateName: template };
      await ResumeService.update(id, updatedResume);

      setCurrentTemplate(template);
      setResume(updatedResume);

      setSnackbarMessage("Шаблон успішно оновлено");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating template:", error);
      setSnackbarMessage("Помилка при зміні шаблону");
      setSnackbarOpen(true);
    }
  };

  const handlePublicToggle = async (event) => {
    const newPublicStatus = event.target.checked;

    try {
      const updatedResume = { ...resume, isPublic: newPublicStatus };
      await ResumeService.update(id, updatedResume);

      setIsPublic(newPublicStatus);
      setResume(updatedResume);

      setSnackbarMessage(
        newPublicStatus
          ? "Ваше резюме тепер доступне публічно"
          : "Ваше резюме тепер приватне"
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating public status:", error);
      setSnackbarMessage("Помилка при оновленні статусу видимості");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Завантаження резюме...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          to="/resumes"
          variant="contained"
          color="primary"
        >
          Повернутися до списку резюме
        </Button>
      </Container>
    );
  }

  // Render 404 message if resume not found
  if (!resume) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Резюме не знайдено. Можливо, воно було видалено або у вас немає прав
          доступу.
        </Alert>
        <Button
          component={Link}
          to="/resumes"
          variant="contained"
          color="primary"
        >
          Повернутися до списку резюме
        </Button>
      </Container>
    );
  }

  console.log("ResumeView - Current template:", currentTemplate);
  console.log("ResumeView - Available templates:", Object.keys(TEMPLATES));

  const Template = TEMPLATES[currentTemplate] || TEMPLATES.classic;
  console.log(
    "ResumeView - Selected template:",
    Template ? "Found" : "Not found"
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Resume Actions Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button component={Link} to="/resumes" variant="outlined">
            Назад до списку
          </Button>
          <Button
            component={Link}
            to={`/resumes/edit/${id}`}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >
            Редагувати
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Видалити
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<PdfIcon />}
            onClick={handleDownloadPDF}
          >
            Завантажити PDF
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<ThemeIcon />}
            onClick={() => setShowThemesDialog(true)}
          >
            Вибрати шаблон
          </Button>
        </Box>
      </Box>
      {/* Public toggle switch */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={handlePublicToggle}
              color="primary"
            />
          }
          label="Опублікувати це резюме публічно"
        />
        <Typography variant="body2" color="text.secondary">
          {isPublic
            ? "Це резюме видно всім відвідувачам сайту в галереї резюме."
            : "Це резюме видно тільки вам."}
        </Typography>
      </Box>{" "}
      {/* Resume Preview */}{" "}
      <Box
        ref={previewRef}
        sx={{
          backgroundColor: darkMode ? "#242424" : "#fff",
          p: 4,
          boxShadow: 3,
          borderRadius: 1,
          minHeight: "80vh",
        }}
      >
        <Template resume={resume} darkMode={darkMode} />
      </Box>{" "}
      {/* Theme Selection Dialog */}
      <Dialog
        open={showThemesDialog}
        onClose={() => setShowThemesDialog(false)}
        maxWidth={false}
        className="template-selection-dialog"
        PaperProps={{
          style: {
            width: "66vw",
            maxWidth: "900px",
            minWidth: "320px",
          },
        }}
      >
        <DialogContent>
          <Typography variant="subtitle1" sx={{ fontSize: "1.1rem", mb: 1 }}>
            Виберіть шаблон для резюме
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {TEMPLATE_LIST.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card
                  className="template-card"
                  sx={{
                    border:
                      template.id === currentTemplate
                        ? "2.5px solid #4caf50"
                        : "1.5px solid #e0e0e0",
                    maxWidth: "100%",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleChangeTemplate(template.id)}
                    sx={{ minHeight: 120, p: 2 }}
                  >
                    <CardContent sx={{ padding: "18px 16px" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "600", mb: 1, fontSize: "1.15rem" }}
                      >
                        {template.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "1rem" }}
                      >
                        {template.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowThemesDialog(false)} color="primary">
            Скасувати
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default ResumeView;
