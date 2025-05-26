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
  const loadPublicResume = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ResumeService.getPublicResumeByUrl(url);
      setResume(response.data);
    } catch (error) {
      console.error("Error loading public resume:", error);
      setError(
        "This resume is either not available or has been set to private."
      );
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
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${resume.title}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const renderTemplate = () => {
    if (!resume) return null;

    const templateName = resume.templateName || "classic";
    const template =
      TEMPLATES.find((t) => t.id === templateName) || TEMPLATES[0];

    const TemplateComponent = template.component;
    return <TemplateComponent resume={resume} />;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            component={Link}
            to="/public/gallery"
            startIcon={<ArrowBackIcon />}
          >
            Back to Gallery
          </Button>

          {resume && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          )}
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: "var(--card-bg)",
              minHeight: "800px",
            }}
          >
            {renderTemplate()}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default PublicResumeView;
