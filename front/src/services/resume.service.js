import axios from "axios";
import authHeader from "./auth-header";
import axiosInstance from "./api";

const API_URL = "http://localhost:8080/api/resumes";

class ResumeService {
  getAll() {
    const headers = authHeader();
    return axios.get(API_URL, { headers, withCredentials: true });
  }
  
  getById(id) {
    const headers = authHeader();
    return axios.get(API_URL + "/" + id, { headers, withCredentials: true });
  }

  getByUserId(userId) {
    const headers = authHeader();
    return axios.get(API_URL + "/user/" + userId, {
      headers,
      withCredentials: true,
    });
  }

  create(resumeData) {
    const headers = authHeader();
    return axios.post(API_URL, resumeData, {
      headers,
      withCredentials: true,
    });
  }
    update(id, resumeData) {
    const headers = authHeader();
    return axios.put(API_URL + "/" + id, resumeData, {
      headers,
      withCredentials: true,
    });
  }
  
  updateResume(id, resumeData) {
    return this.update(id, resumeData);
  }

  delete(id) {
    const headers = authHeader();
    return axios.delete(API_URL + "/" + id, {
      headers,
      withCredentials: true,
    });
  }
  getPdf(id) {
    const headers = {
      ...authHeader(),
      Accept: "application/pdf",
    };
    return axios.get(API_URL + "/" + id + "/pdf", {
      headers,
      responseType: "blob",
      withCredentials: true,
    });
  }

  // Debug methods
  testAuth() {
    const headers = authHeader();
    return axios.get(API_URL + "/test-auth", {
      headers,
      withCredentials: true,
    });
  }
  checkPermissions(userId) {
    const headers = authHeader();
    return axios.get(API_URL + "/debug/check-permissions/" + userId, {
      headers,
      withCredentials: true,
    });
  }

  checkResumePermissions(resumeId) {
    const headers = authHeader();
    return axios.get(API_URL + "/debug/check-resume-permissions/" + resumeId, {
      headers,
      withCredentials: true,
    });
  }
  
  checkUserRoles() {
    const headers = authHeader();
    return axios.get(API_URL + "/debug/user-roles", {
      headers,
      withCredentials: true,
    });
  }
  // Public resume sharing methods
  makePublic(id) {
    const headers = authHeader();
    return axios.post(
      API_URL + "/" + id + "/share",
      {},
      {
        headers,
        withCredentials: true,
      }
    );
  }

  makePrivate(id) {
    const headers = authHeader();
    return axios.post(
      API_URL + "/" + id + "/unshare",
      {},
      {
        headers,
        withCredentials: true,
      }
    );
  }

  // Methods for accessing public resumes (no auth required)
  getAllPublicResumes() {
    return axios.get("http://localhost:8080/api/public/resumes");
  }

  getPublicResumeByUrl(url) {
    return axios.get("http://localhost:8080/api/public/resumes/" + url);
  }

  getPublicResumePdf(url) {
    const headers = {
      Accept: "application/pdf",
    };
    return axios.get(
      "http://localhost:8080/api/public/resumes/" + url + "/pdf",
      {
        headers,
        responseType: "blob",
      }
    );
  }

  // Template methods
  getAvailableTemplates() {
    return [
      {
        id: "classic",
        name: "Classic",
        description: "A traditional resume layout",
      },
      {
        id: "modern",
        name: "Modern",
        description: "A contemporary design with clean lines",
      },
      {
        id: "minimalist",
        name: "Minimalist",
        description: "A simple, elegant layout",
      },
      {
        id: "professional",
        name: "Professional",
        description: "A polished, business-oriented design",
      },
      {
        id: "creative",
        name: "Creative",
        description: "A unique design for creative professionals",
      },
    ];  }
}

const resumeService = new ResumeService();
export default resumeService;
