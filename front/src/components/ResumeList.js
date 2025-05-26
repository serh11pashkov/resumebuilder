import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ResumeService from "../services/resume.service";
import AuthService from "../services/auth.service";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Initialize user ID only once on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.id) {
      setUserId(user.id);
    } else {
      setLoading(false);
      setError("User not properly authenticated");
    }
  }, []);

  // Check user roles on component mount
  useEffect(() => {
    ResumeService.checkUserRoles()
      .then((response) => {
        console.log("User roles check result:", response.data);
      })
      .catch((error) => {
        console.error("Error checking user roles:", error);
      });
  }, []);
  // Only depend on userId which won't change during component lifecycle
  const loadResumes = useCallback(() => {
    if (!userId) return;

    setLoading(true);
    setError(null); // Clear previous errors

    console.log(`ResumeList: Loading resumes for user ID: ${userId}`);

    // First check if user has the right permissions
    ResumeService.checkPermissions(userId)
      .then((response) => {
        console.log("Permission check result:", response.data);
        if (response.data.accessAllowed) {
          return ResumeService.getByUserId(userId);
        } else {
          throw new Error("You don't have permission to access these resumes");
        }
      })
      .then((response) => {
        console.log(
          `ResumeList: Successfully loaded ${response.data.length} resumes`
        );
        setResumes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("ResumeList: Error loading resumes:", error);

        // Try to get a more detailed error message
        let message;
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          message = `Error ${error.response.status}: ${
            error.response.data.message || error.message
          }`;
          console.log("Error response data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          message = "No response received from server. Please try again later.";
        } else {
          // Something happened in setting up the request that triggered an Error
          message = error.message;
        }

        setError(message);
        setLoading(false);

        // Additional debug: Check user roles
        ResumeService.checkUserRoles()
          .then((response) => {
            console.log("User roles debug:", response.data);
          })
          .catch((roleError) => {
            console.error("Error checking user roles:", roleError);
          });
      });
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadResumes();
    }
  }, [userId, loadResumes]);

  const handleDeleteResume = (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      ResumeService.delete(id)
        .then(() => {
          loadResumes();
        })
        .catch((error) => {
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
        // Create a blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);

        // Create a link element
        const downloadLink = document.createElement("a");
        downloadLink.href = fileURL;
        downloadLink.download = `${title}.pdf`;

        // Append to the document
        document.body.appendChild(downloadLink);

        // Trigger click event
        downloadLink.click();

        // Clean up
        document.body.removeChild(downloadLink);
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
      });
  };

  if (loading) {
    return (
      <div className="centered loading-container">
        <div className="loading-spinner"></div>
        <p>Loading resumes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={loadResumes} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Resumes Found</h2>
        <p>
          You haven't created any resumes yet. Get started with your first
          resume!
        </p>
        <Link to="/resumes/new" className="btn btn-primary">
          Create New Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="resume-list-container">
      <div className="resume-list-header">
        <h1>My Resumes</h1>
        <Link to="/resumes/new" className="btn btn-primary">
          Create New Resume
        </Link>
      </div>

      <div className="resume-grid">
        {resumes.map((resume) => (
          <div className="resume-card" key={resume.id}>
            <div className="resume-card-content">
              <h2>{resume.title}</h2>
              <p className="resume-summary">
                {resume.summary
                  ? resume.summary.substring(0, 100) + "..."
                  : "No summary available"}
              </p>
            </div>
            <div className="resume-card-actions">
              <Link to={`/resumes/${resume.id}`} className="btn btn-view">
                View
              </Link>
              <Link to={`/resumes/edit/${resume.id}`} className="btn btn-edit">
                Edit
              </Link>
              <button
                onClick={() => handleDeleteResume(resume.id)}
                className="btn btn-delete"
              >
                Delete
              </button>
              <button
                onClick={() => handleDownloadPdf(resume.id, resume.title)}
                className="btn btn-download"
              >
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeList;
