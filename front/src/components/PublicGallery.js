import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ResumeService from "../services/resume.service";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const PublicGallery = () => {
  const [publicResumes, setPublicResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPublicResumes();
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .MuiGrid-container {
        margin-top: 16px;
      }
      .resume-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .resume-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
      .resume-card-content {
        flex-grow: 1;
      }
      .meta-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .meta-item svg {
        margin-right: 8px;
        font-size: 16px;
        opacity: 0.7;
      }
      .search-wrapper {
        margin: 16px 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const loadPublicResumes = () => {
    setLoading(true);
    setError(null);
    ResumeService.getAllPublicResumes()
      .then((response) => {
        console.log("Public resumes data:", response.data);
        setPublicResumes(response.data);
        setFilteredResumes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading public resumes:", error);
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);
      });
  };
  const handleDownloadPdf = (id, title, url) => {
    const resumeId = url || id;
    ResumeService.getPublicResumePdf(resumeId)
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);

        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", `${title.replace(/\s+/g, "_")}.pdf`);
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
        alert(
          "Помилка при завантаженні PDF. Будь ласка, спробуйте знову пізніше."
        );
      });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredResumes(publicResumes);
      return;
    }

    const filtered = publicResumes.filter((resume) => {
      if (resume.title.toLowerCase().includes(query)) return true;

      if (resume.username?.toLowerCase().includes(query)) return true;

      try {
        const skills = JSON.parse(resume.skills || "[]");
        for (const skill of skills) {
          if (skill.name.toLowerCase().includes(query)) return true;
        }
      } catch (e) {}

      if (resume.summary?.toLowerCase().includes(query)) return true;

      return false;
    });

    setFilteredResumes(filtered);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Завантаження галереї резюме...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Галерея публічних резюме
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        Перегляньте публічно доступні резюме для натхнення та ідей.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box className="search-wrapper">
        <TextField
          fullWidth
          placeholder="Пошук резюме за іменем, навичками або резюме"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredResumes.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Публічних резюме не знайдено. Будьте першим, хто поділиться своїм
          резюме!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredResumes.map((resume) => (
            <Grid item xs={12} sm={6} md={4} key={resume.id}>
              <Card className="resume-card">
                <CardContent className="resume-card-content">
                  <Typography variant="h6" component="h2" gutterBottom>
                    {resume.title}
                  </Typography>{" "}
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Chip
                      label={resume.templateName || "Базовий"}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <div className="meta-item">
                      <PersonIcon />
                      <Typography variant="body2">
                        Автор: {resume.username || "Анонімний користувач"}
                      </Typography>
                    </div>

                    <div className="meta-item">
                      <CalendarTodayIcon />
                      <Typography variant="body2">
                        Створено:{" "}
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
                <CardActions>
                  {" "}
                  <Button
                    component={Link}
                    to={`/public/resume/${
                      resume.shareUrl ||
                      resume.publicUrl ||
                      resume.url ||
                      resume.id
                    }`}
                    size="small"
                    startIcon={<VisibilityIcon />}
                  >
                    Переглянути
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() =>
                      handleDownloadPdf(
                        resume.id,
                        resume.title,
                        resume.shareUrl || resume.publicUrl || resume.url
                      )
                    }
                  >
                    PDF
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PublicGallery;
