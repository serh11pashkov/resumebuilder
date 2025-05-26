import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ResumeService from "../services/resume.service";
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
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  FormatPaint as ThemeIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  Public as PublicIcon,
  PublicOff as PublicOffIcon,
} from "@mui/icons-material";
import { TEMPLATES } from "./templates";

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState("classic");
  const [showThemesDialog, setShowThemesDialog] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isZooming, setIsZooming] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [sharingLoading, setSharingLoading] = useState(false);
  const zoomTimeoutRef = useRef(null);

  const printRef = useRef();  const loadResume = useCallback(() => {
    setLoading(true);    console.log(`ResumeView: Loading resume with ID: ${id}`);
    
    // First, check if user has the right permissions to view this resume
    ResumeService.checkResumePermissions(id)
      .then((permissionResponse) => {
        console.log(`ResumeView: Permission check result:`, permissionResponse.data);
        if (permissionResponse.data.accessAllowed) {
          return ResumeService.getById(id);
        } else {
          throw new Error("You don't have permission to view this resume");
        }
      })
      .then((response) => {
        console.log(`ResumeView: Resume loaded successfully:`, response.data);
        setResume(response.data);
        setIsPublic(response.data.isPublic || false);
        setLoading(false);
      })
      .catch((error) => {
        console.error(`ResumeView: Error loading resume:`, error);
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    loadResume();

    // Cleanup zoom timeout on unmount
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, [loadResume]);

  const handleDownloadPdf = () => {
    if (!resume) return;
    setLoading(true);

    ResumeService.getPdf(id)
      .then((response) => {
        // Create a blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);

        // Create a link element
        const downloadLink = document.createElement("a");
        downloadLink.href = fileURL;
        downloadLink.download = `${resume.title}.pdf`;

        // Append to the document
        document.body.appendChild(downloadLink);

        // Trigger the download
        downloadLink.click();

        // Clean up - remove the link after triggering download
        document.body.removeChild(downloadLink);

        setLoading(false);
        setSuccessMessage("PDF Downloaded Successfully");
        setShowSuccess(true);
      })
      .catch((error) => {
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

  const handleDeleteResume = () => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this resume?")) {
      setLoading(true);
      ResumeService.delete(id)
        .then(() => {
          navigate("/resumes");
        })
        .catch((error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setError(message);
          setLoading(false);
        });
    }
  };

  const togglePublicStatus = () => {
    setSharingLoading(true);

    const toggleAction = isPublic
      ? ResumeService.makePrivate(id)
      : ResumeService.makePublic(id);

    toggleAction
      .then((response) => {
        setIsPublic(response.data.isPublic);
        setSuccessMessage(
          isPublic ? "Resume is now private" : "Resume is now public"
        );
        setShowSuccess(true);
        setSharingLoading(false);
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setSharingLoading(false);
      });
  };

  const handleTemplateChange = (templateId) => {
    setLoading(true);

    // Save the template preference to backend
    ResumeService.updateResume(id, { ...resume, templateName: templateId })
      .then((response) => {
        setCurrentTemplate(templateId);
        setResume(response.data);
        setSuccessMessage("Template Updated Successfully");
        setShowSuccess(true);
        setLoading(false);
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);
      });

    setShowThemesDialog(false);
  };
  const renderTemplate = () => {
    const template = TEMPLATES.find((t) => t.id === currentTemplate);
    if (!template) return null;

    // If we're actively zooming, use a simplified preview to prevent lagging
    if (isZooming) {
      return (
        <Box
          sx={{
            transform: `scale(${previewScale})`,
            transformOrigin: "top center",
            padding: "20px",
            backgroundColor: "white",
            width: "100%",
            transition: "none",
            minHeight: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Adjusting zoom level...</Typography>
        </Box>
      );
    }

    const TemplateComponent = template.component;
    return <TemplateComponent resume={resume} scale={previewScale} />;
  };

  if (loading && !resume) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={Link} to="/resumes" variant="contained">
            Back to Resumes
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Resume Preview</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Change Template">
            <Button
              variant="outlined"
              startIcon={<ThemeIcon />}
              onClick={() => setShowThemesDialog(true)}
            >
              Templates
            </Button>
          </Tooltip>
          <Tooltip title="Download PDF">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadPdf}
              disabled={loading}
            >
              Download PDF
            </Button>
          </Tooltip>

          <Tooltip title={isPublic ? "Make Private" : "Share Publicly"}>
            <Button
              variant="outlined"
              color={isPublic ? "success" : "default"}
              startIcon={isPublic ? <PublicIcon /> : <ShareIcon />}
              onClick={togglePublicStatus}
              disabled={sharingLoading}
            >
              {isPublic ? "Public" : "Share"}
            </Button>
          </Tooltip>

          <Tooltip title="Edit Resume">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              component={Link}
              to={`/resumes/edit/${id}`}
            >
              Edit
            </Button>
          </Tooltip>

          <Tooltip title="Delete Resume">
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteResume}
              disabled={loading}
            >
              Delete
            </Button>
          </Tooltip>
        </Box>
      </Box>{" "}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <IconButton
          onClick={() => {
            setPreviewScale((prev) => Math.max(0.5, prev - 0.1));
            setIsZooming(true);

            // Debounce rendering during rapid zooming
            if (zoomTimeoutRef.current) {
              clearTimeout(zoomTimeoutRef.current);
            }

            zoomTimeoutRef.current = setTimeout(() => {
              setIsZooming(false);
            }, 300);
          }}
        >
          <ZoomOutIcon />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {Math.round(previewScale * 100)}%
        </Typography>
        <IconButton
          onClick={() => {
            setPreviewScale((prev) => Math.min(1.5, prev + 0.1));
            setIsZooming(true);

            // Debounce rendering during rapid zooming
            if (zoomTimeoutRef.current) {
              clearTimeout(zoomTimeoutRef.current);
            }

            zoomTimeoutRef.current = setTimeout(() => {
              setIsZooming(false);
            }, 300);
          }}
        >
          <ZoomInIcon />
        </IconButton>
      </Box>
      <Box
        ref={printRef}
        sx={{
          overflow: "auto",
          maxHeight: "calc(100vh - 220px)",
          backgroundColor: "#f5f5f5",
          p: 2,
          borderRadius: 1,
        }}
      >
        {resume && renderTemplate()}
      </Box>
      {/* Template Selection Dialog */}
      <Dialog
        open={showThemesDialog}
        onClose={() => setShowThemesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h5" gutterBottom>
            Choose a Template
          </Typography>
          <Grid container spacing={3}>
            {TEMPLATES.map((template) => (
              <Grid item xs={12} sm={4} key={template.id}>
                <Card
                  sx={{
                    border:
                      currentTemplate === template.id
                        ? "2px solid #3f51b5"
                        : "1px solid #e0e0e0",
                    height: "100%",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    <Box
                      sx={{
                        height: 150,
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PdfIcon sx={{ fontSize: 60, color: "#9e9e9e" }} />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
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
          <Button onClick={() => setShowThemesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setShowSuccess(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default ResumeView;
