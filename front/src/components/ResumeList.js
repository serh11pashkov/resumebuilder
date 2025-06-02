import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ResumeService from "../services/resume.service";
import AuthService from "../services/auth.service";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Container,
  Button,
} from "@mui/material";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); 
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log("ResumeList - Current user:", user);

    if (user) {
      
      const id = user.id || user.userId || user._id;

      if (id) {
        setUserId(id);
        console.log("ResumeList - User ID set:", id);
      } else {
        console.error(
          "ResumeList - User object doesn't have a valid ID property:",
          user
        );

        
        try {
          const tempId = `user-${user.username || "unknown"}-${Date.now()}`;
          console.warn("ResumeList - Creating temporary user ID:", tempId);

          
          user.id = tempId;
          user.userId = tempId;
          user._id = tempId;
          localStorage.setItem("user", JSON.stringify(user));

          
          setUserId(tempId);

          setError(
            "Створено тимчасовий ідентифікатор користувача. Деякі функції можуть бути обмежені. Рекомендуємо повторно увійти в систему."
          );
        } catch (err) {
          console.error("ResumeList - Failed to create temporary ID:", err);
          setError(
            "Користувач не має дійсного ідентифікатора. Повторно увійдіть в систему."
          );
          setLoading(false);
        }
      }
    } else {
      setLoading(false);
      setError("Недійсні облікові дані");
      console.log("ResumeList - No valid user found");
    }
  }, []);

  
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .resume-card {
        background-color: var(--card-bg);
        box-shadow: var(--shadow);
        border-radius: 8px;
        padding: 1.5rem;
      }      .resume-action-btn {
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        font-size: 0.875rem;
        color: white;
        display: inline-block;
        transition: background-color 0.2s;
        border: none;
        cursor: pointer;
      }
      .btn-view {
        background-color: #4caf50;
      }
      .btn-view:hover {
        background-color: #388e3c;
      }
      .btn-edit {
        background-color: #2196f3;
      }
      .btn-edit:hover {
        background-color: #1976d2;
      }
      .btn-delete {
        background-color: #f44336;
      }
      .btn-delete:hover {
        background-color: #d32f2f;
      }
      .btn-download {
        background-color: #ff9800;
      }
      .btn-download:hover {
        background-color: #f57c00;
      }
      .resume-actions {
        display: flex;
        gap: 8px;
        margin-top: 1rem;
        flex-wrap: wrap;
      }
      .resume-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
        margin-top: 2rem;
      }
      .resume-card h3 {
        margin-top: 0;
        font-size: 1.25rem;
      }
      .resume-meta {
        margin: 0.5rem 0;
        font-size: 0.875rem;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const fetchResumes = useCallback(() => {
    setLoading(true);
    setError(null);
    console.log("ResumeList - Fetching resumes for user ID:", userId);

    if (!userId) {
      console.error("ResumeList - Cannot fetch resumes: No user ID available");
      setError("Cannot load resumes: No user ID available");
      setLoading(false);
      return;
    }

    ResumeService.getByUserId(userId)
      .then((response) => {
        console.log("ResumeList - Fetched resumes:", response.data);
        setResumes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchResumes();
    }
  }, [userId, fetchResumes]);

  const handleDelete = (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити це резюме?")) {
      ResumeService.delete(id)
        .then(() => {
          fetchResumes();
        })
        .catch((error) => {
          console.error("Error deleting resume:", error);
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setError(message);
        });
    }
  };
  const handleDownloadPdf = (id, title) => {
    ResumeService.getPdf(id)
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Завантаження резюме...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchResumes}>
          Повторити
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Мої резюме
        </Typography>
        <Button
          component={Link}
          to="/resumes/create"
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
        >
          Створити нове резюме
        </Button>
      </Box>

      {resumes.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          У вас ще немає резюме. Створіть своє перше резюме!
        </Alert>
      ) : (
        <div className="resume-list">
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-card">
              {" "}
              <h3>{resume.title}</h3>{" "}
              <p className="resume-meta">
                <strong>Шаблон:</strong> {resume.templateName || "Базовий"}
              </p>
              <div className="resume-actions">
                <Link
                  to={`/resumes/${resume.id}`}
                  className="resume-action-btn btn-view"
                >
                  Переглянути
                </Link>
                <Link
                  to={`/resumes/edit/${resume.id}`}
                  className="resume-action-btn btn-edit"
                >
                  Редагувати
                </Link>{" "}
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="resume-action-btn btn-delete"
                >
                  Видалити
                </button>
                <button
                  onClick={() => handleDownloadPdf(resume.id, resume.title)}
                  className="resume-action-btn btn-download"
                >
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ResumeList;
