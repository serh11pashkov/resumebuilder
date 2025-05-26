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
    if (searchQuery.trim() === "") {
      setFilteredResumes(publicResumes);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredResumes(
        publicResumes.filter((resume) => {
          let personalInfo = {};
          try {
            personalInfo = typeof resume.personalInfo === 'string' ? 
              JSON.parse(resume.personalInfo || "{}") : 
              (resume.personalInfo || {});
          } catch (e) {
            console.error("Error parsing personal info:", e);
            personalInfo = {};
          }
          
          const title = resume.title?.toLowerCase() || "";
          const summary = resume.summary?.toLowerCase() || "";
          const firstName = personalInfo.firstName?.toLowerCase() || "";
          const lastName = personalInfo.lastName?.toLowerCase() || "";
          const email = personalInfo.email?.toLowerCase() || "";
          
          return (
            title.includes(lowercasedQuery) ||
            summary.includes(lowercasedQuery) ||
            firstName.includes(lowercasedQuery) ||
            lastName.includes(lowercasedQuery) ||
            email.includes(lowercasedQuery)
          );
        })
      );
    }
  }, [searchQuery, publicResumes]);

  const loadPublicResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ResumeService.getAllPublicResumes();
      setPublicResumes(response.data);
      setFilteredResumes(response.data);
    } catch (error) {
      console.error("Error loading public resumes:", error);
      setError("Failed to load public resumes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };
  const getPersonalInfo = (resume) => {
    try {
      if (typeof resume.personalInfo === 'string') {
        return JSON.parse(resume.personalInfo || "{}");
      } else if (typeof resume.personalInfo === 'object' && resume.personalInfo !== null) {
        return resume.personalInfo;
      } else {
        return {};
      }
    } catch (error) {
      console.error("Error parsing personal info:", error);
      return {};
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container className="public-gallery-container" maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Public Resume Gallery
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse through publicly shared resumes for inspiration and ideas.
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search resumes by name, skills, or summary"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 4, mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  ✕
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

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
        ) : filteredResumes.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No public resumes found. Be the first to share your resume!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredResumes.map((resume) => {
              const personalInfo = getPersonalInfo(resume);
              return (
                <Grid item xs={12} sm={6} md={4} key={resume.id}>
                  <Card
                    elevation={2}
                    className="resume-card"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        noWrap
                        sx={{ fontWeight: "bold" }}
                      >
                        {resume.title}
                      </Typography>

                      <Box
                        sx={{ mb: 2, display: "flex", alignItems: "center" }}
                      >
                        <PersonIcon
                          fontSize="small"
                          sx={{ mr: 1, opacity: 0.6 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {personalInfo.firstName} {personalInfo.lastName}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ mb: 2, display: "flex", alignItems: "center" }}
                      >
                        <CalendarTodayIcon
                          fontSize="small"
                          sx={{ mr: 1, opacity: 0.6 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(resume.createdAt)}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {resume.summary}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Chip
                          size="small"
                          label={resume.templateName || "Classic"}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        component={Link}
                        to={`/public/resumes/${resume.publicUrl}`}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => {
                          window.open(
                            `http://localhost:8080/api/public/resumes/${resume.publicUrl}/pdf`,
                            "_blank"
                          );
                        }}
                      >
                        PDF
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PublicGallery;
