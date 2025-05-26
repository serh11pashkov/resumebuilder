import { Link } from "react-router-dom";

const Header = ({ currentUser, logOut, darkMode, toggleDarkMode }) => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Resume Builder
      </Link>
      <nav className="nav-menu">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/public/gallery" className="nav-link">
          Gallery
        </Link>

        {currentUser ? (
          <>
            <Link to="/resumes" className="nav-link">
              My Resumes
            </Link>
            {currentUser.roles.includes("ROLE_ADMIN") && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
            <Link to="/settings" className="nav-link">
              Settings
            </Link>
            <Link to="/login" className="nav-link" onClick={logOut}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Sign Up
            </Link>
          </>
        )}

        <div
          className={`toggle-switch ${darkMode ? "active" : ""}`}
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        />
      </nav>
    </header>
  );
};

export default Header;
