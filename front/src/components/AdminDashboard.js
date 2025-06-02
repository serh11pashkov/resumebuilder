import { useState, useEffect, useCallback } from "react";
import UserService from "../services/user.service";
import ResumeService from "../services/resume.service";

const styles = {
  tabs: {
    display: "flex",
    marginBottom: "20px",
    gap: "10px",
  },
  tabButton: {
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    transition: "all 0.3s ease",
  },
  activeTabButton: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "1px solid #388e3c",
  },
  reloadButton: {
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#2196f3",
    color: "white",
    border: "1px solid #0d8bf2",
    borderRadius: "4px",
    marginLeft: "auto",
  },
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    UserService.getAll()
      .then((usersResponse) => {
        setUsers(usersResponse.data);

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
  const handleDeleteResume = (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити це резюме?")) {
      ResumeService.delete(id)
        .then(() => {
          loadData();
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
  const handleDeleteUser = (id, isAdmin) => {
    if (isAdmin) {
      setError(
        "Видалення адміністраторів заборонено. Адміністратори не можуть видаляти інших адміністраторів."
      );
      return;
    }

    if (window.confirm("Ви впевнені, що хочете видалити цього користувача?")) {
      UserService.delete(id)
        .then(() => {
          loadData();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
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

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Адміністративна панель</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="tabs">
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "users" ? styles.activeTabButton : {}),
            }}
          >
            Користувачі
          </button>
          <button
            className={activeTab === "resumes" ? "active" : ""}
            onClick={() => setActiveTab("resumes")}
            style={{
              ...styles.tabButton,
              ...(activeTab === "resumes" ? styles.activeTabButton : {}),
            }}
          >
            Резюме
          </button>
          <button
            onClick={loadData}
            className="reload-button"
            style={styles.reloadButton}
          >
            {loading ? "Завантаження..." : "Оновити дані"}
          </button>
        </div>

        {loading ? (
          <div className="loading">Завантаження даних...</div>
        ) : (
          <>
            {activeTab === "users" && (
              <div className="users-table">
                <h2>Керування користувачами ({users.length})</h2>
                <table>
                  <thead>
                    <tr>
                      {" "}
                      <th>ID</th>
                      <th>Ім'я користувача</th>
                      <th>Електронна пошта</th>
                      <th>Ролі</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.roles.map((role) => (
                            <span key={role} className="role-badge">
                              {role.replace("ROLE_", "")}{" "}
                            </span>
                          ))}
                        </td>
                        <td>
                          <div className="button-group">
                            <span className="user-status">
                              {user.roles.includes("ROLE_ADMIN")
                                ? "Адміністратор"
                                : "Звичайний користувач"}
                            </span>{" "}
                            {!user.roles.includes("ROLE_ADMIN") && (
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user.id,
                                    user.roles.includes("ROLE_ADMIN")
                                  )
                                }
                                className="delete-button"
                              >
                                Видалити
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "resumes" && (
              <div className="resumes-table">
                <h2>Керування резюме ({resumes.length})</h2>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Назва</th> <th>Користувач</th>
                      <th>Шаблон</th>
                      <th>Публічне</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumes.map((resume) => {
                      const user = users.find((u) => u.id === resume.userId);
                      return (
                        <tr key={resume.id}>
                          <td>{resume.id}</td>
                          <td>{resume.title}</td>
                          <td>
                            {user
                              ? `${user.username} (ID: ${user.id})`
                              : "Невідомий користувач"}
                          </td>
                          <td>{resume.templateName || "Базовий"}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                resume.isPublic ? "public" : "private"
                              }`}
                            >
                              {resume.isPublic ? "Так" : "Ні"}{" "}
                            </span>
                          </td>
                          <td>
                            <div className="button-group">
                              <a
                                href={`/resumes/${resume.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-button"
                              >
                                Переглянути
                              </a>
                              <button
                                onClick={() => handleDeleteResume(resume.id)}
                                className="delete-button"
                              >
                                Видалити
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      <style jsx="true">{`
        .admin-dashboard {
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          margin-bottom: 20px;
        }
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .tabs {
          display: flex;
          margin-bottom: 20px;
        }
        .tabs button {
          padding: 10px 20px;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          cursor: pointer;
          border-radius: 4px 4px 0 0;
          margin-right: 5px;
        }
        .tabs button.active {
          background-color: #007bff;
          color: white;
          border: 1px solid #0056b3;
        }
        .reload-button {
          margin-left: auto;
          background-color: #0d6efd;
          color: white;
          border: 1px solid #0a58ca;
        }
        .loading {
          text-align: center;
          padding: 20px;
          font-style: italic;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          border: 1px solid #ddd;
        }
        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
          border-right: 1px solid #ddd;
        }
        th:last-child,
        td:last-child {
          border-right: none;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
          border-bottom: 2px solid #ddd;
        }
        .role-badge {
          background-color: #007bff;
          color: white;
          border-radius: 12px;
          padding: 3px 8px;
          font-size: 12px;
          margin-right: 5px;
        }
        .status-badge {
          border-radius: 12px;
          padding: 3px 8px;
          font-size: 12px;
        }
        .status-badge.public {
          background-color: #28a745;
          color: white;
        }
        .status-badge.private {
          background-color: #6c757d;
          color: white;
        }
        .button-group {
          display: flex;
          gap: 5px;
        }
        .button-group button,
        .button-group a {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          text-decoration: none;
          text-align: center;
        }
        .view-button {
          background-color: #28a745;
          color: white;
        }
        .delete-button {
          background-color: #dc3545;
          color: white;
        }
        .make-admin {
          background-color: #007bff;
          color: white;
        }
        .remove-admin {
          background-color: #6c757d;
          color: white;
        }

        .user-status {
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          display: inline-block;
        }

        .dark-mode .user-status {
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
