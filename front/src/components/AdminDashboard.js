import { useState, useEffect, useCallback } from "react";
import UserService from "../services/user.service";
import ResumeService from "../services/resume.service";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    // First, get all users
    UserService.getAll()
      .then((usersResponse) => {
        setUsers(usersResponse.data);

        // After successfully getting users, get all resumes
        return ResumeService.getAll();
      })
      .then((resumesResponse) => {
        setResumes(resumesResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteUser = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? All their resumes will also be deleted."
      )
    ) {
      UserService.delete(id)
        .then(() => {
          loadData();
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

  const handleDeleteResume = (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      ResumeService.delete(id)
        .then(() => {
          loadData();
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

  if (loading) {
    return <div className="text-center">Loading data...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>

      {error && (
        <div className="card mb-4 text-error">
          <p>{error}</p>
        </div>
      )}

      <div className="flex mb-4">
        <button
          className={`btn ${
            activeTab === "users" ? "btn-primary" : "btn-secondary"
          } mr-2`}
          onClick={() => setActiveTab("users")}
          style={{ marginRight: "10px" }}
        >
          Manage Users ({users.length})
        </button>
        <button
          className={`btn ${
            activeTab === "resumes" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => setActiveTab("resumes")}
        >
          All Resumes ({resumes.length})
        </button>
      </div>

      {activeTab === "users" && (
        <div className="card">
          <h3 className="mb-3">Users</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Username
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Roles
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Resumes
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    {user.username}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    {user.email}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="badge"
                        style={{
                          marginRight: "5px",
                          background: role.includes("ADMIN")
                            ? "var(--accent-color)"
                            : "var(--secondary-color)",
                          color: "white",
                          padding: "3px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {role.replace("ROLE_", "")}
                      </span>
                    ))}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    {resumes.filter((r) => r.userId === user.id).length}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-danger btn-sm"
                      disabled={user.roles.includes("ROLE_ADMIN")}
                      title={
                        user.roles.includes("ROLE_ADMIN")
                          ? "Cannot delete admin users"
                          : "Delete user"
                      }
                      style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "resumes" && (
        <div className="card">
          <h3 className="mb-3">All Resumes</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Owner
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Skills
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Experience
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Education
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => {
                const owner = users.find((u) => u.id === resume.userId);
                return (
                  <tr key={resume.id}>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      {resume.title}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      {owner ? owner.username : "Unknown"}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      {resume.skills ? resume.skills.length : 0}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      {resume.experiences ? resume.experiences.length : 0}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      {resume.educations ? resume.educations.length : 0}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
