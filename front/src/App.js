import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./components/menu-fixes.css";

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

// Utilities
import { fixUserData } from "./fixUserData";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [darkMode, setDarkMode] = useState(false);

  const updateCurrentUser = () => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user || undefined);
  };
  useEffect(() => {
    fixUserData();
    updateCurrentUser();

    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const logOut = () => {
    AuthService.logout();
    updateCurrentUser();
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-container">
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
              element={<PrivateRoute element={<ResumeList />} />}
            />
            <Route
              path="/resumes/create"
              element={<PrivateRoute element={<ResumeForm />} />}
            />
            <Route
              path="/resumes/edit/:id"
              element={<PrivateRoute element={<ResumeForm />} />}
            />
            <Route
              path="/resumes/:id"
              element={<PrivateRoute element={<ResumeView />} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute element={<UserSettings />} />}
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute
                  element={<AdminDashboard />}
                  requiredRoles={["ROLE_ADMIN"]}
                />
              }
            />
            <Route path="/public/gallery" element={<PublicGallery />} />
            <Route path="/public/resume/:url" element={<PublicResumeView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
