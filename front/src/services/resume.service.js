import axiosInstance from "./api";
import axios from "axios";

const API_URL = "/resumes";

class ResumeService {
  getAll() {
    return axiosInstance.get(API_URL);
  }

  getById(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }

  getByUserId(userId) {
    return axiosInstance.get(`${API_URL}/user/${userId}`);
  }
  create(resumeData) {
    return axiosInstance.post(API_URL, resumeData);
  }

  update(id, resumeData) {
    return axiosInstance.put(`${API_URL}/${id}`, resumeData);
  }

  updateResume(id, resumeData) {
    return this.update(id, resumeData);
  }

  delete(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
  getPdf(id) {
    return axiosInstance.get(`${API_URL}/${id}/pdf`, {
      headers: {
        Accept: "application/pdf",
      },
      responseType: "blob",
    });
  }

  testAuth() {
    return axiosInstance.get(`${API_URL}/test-auth`);
  }

  checkPermissions(userId) {
    return axiosInstance.get(`${API_URL}/debug/check-permissions/${userId}`);
  }

  checkResumePermissions(resumeId) {
    return axiosInstance.get(
      `${API_URL}/debug/check-resume-permissions/${resumeId}`
    );
  }

  checkUserRoles() {
    return axiosInstance.get(`${API_URL}/debug/user-roles`);
  }
  // Public resume sharing methods
  makePublic(id) {
    return axiosInstance.post(`${API_URL}/${id}/share`, {});
  }

  makePrivate(id) {
    return axiosInstance.post(
      `${API_URL}/${id}/unshare`,
      {},
      {
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      }
    );
  }

  getAllPublicResumes() {
    return axios.get("http://localhost:8080/api/public/resumes");
  }
  getPublicResumeByUrl(url) {
    console.log("Fetching public resume with URL:", url);
    return axios.get(`http://localhost:8080/api/public/resumes/${url}`);
  }

  getPublicResumePdf(url) {
    return axios.get(`http://localhost:8080/api/public/resumes/${url}/pdf`, {
      headers: {
        Accept: "application/pdf",
      },
      responseType: "blob",
    });
  }

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
    ];
  }
}

const resumeService = new ResumeService();
export default resumeService;
