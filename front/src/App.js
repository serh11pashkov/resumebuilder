import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Components
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ResumeList from "./components/ResumeList";
import ResumeForm from "./components/ResumeForm";
import ResumeView from "./components/ResumeView";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import PublicGallery from "./components/PublicGallery";
import PublicResumeView from "./components/PublicResumeView";
import UserSettings from "./components/UserSettings";

// Services
import AuthService from "./services/auth.service";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [darkMode, setDarkMode] = useState(false);

  const updateCurrentUser = () => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user || undefined);
  };

  useEffect(() => {
    updateCurrentUser();

    // Check local storage for dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    localStorage.setItem("darkMode", newDarkModeState.toString());

    if (newDarkModeState) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    // Redirect to home page after logout
    window.location.href = "/";
  };

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
        <Header
          currentUser={currentUser}
          logOut={logOut}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/resumes"
              element={
                <PrivateRoute>
                  <ResumeList />
                </PrivateRoute>
              }
            />

            <Route
              path="/resumes/new"
              element={
                <PrivateRoute>
                  <ResumeForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/resumes/edit/:id"
              element={
                <PrivateRoute>
                  <ResumeForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/resumes/:id"
              element={
                <PrivateRoute>
                  <ResumeView />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="ROLE_ADMIN">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <UserSettings />
                </PrivateRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/public/gallery" element={<PublicGallery />} />
            <Route path="/public/resumes/:url" element={<PublicResumeView />} />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
