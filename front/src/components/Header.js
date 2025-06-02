import { Link } from "react-router-dom";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import "./menu-fixes.css";

const Header = ({ currentUser, logOut, darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleOpenMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = (action) => {
    setMenuOpen(false);
    if (action === "settings") {
      window.location.href = "/settings";
    } else if (action === "logout") {
      logOut();
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Конструктор резюме
      </Link>{" "}
      <nav className="nav-menu">
        {" "}
        <Link to="/" className="nav-link">
          Головна
        </Link>
        <Link to="/public/gallery" className="nav-link">
          Галерея
        </Link>
        {currentUser ? (
          <>
            <Link to="/resumes" className="nav-link">
              Мої резюме
            </Link>{" "}
            {currentUser.roles.includes("ROLE_ADMIN") && (
              <Link to="/admin" className="nav-link">
                Адмін панель
              </Link>
            )}
            <Box sx={{ ml: 1, position: "relative" }}>
              <Tooltip title="Налаштування облікового запису">
                {" "}
                <IconButton
                  onClick={handleOpenMenu}
                  sx={{ p: 0 }}
                  ref={buttonRef}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <AccountCircle fontSize="small" />
                  </Avatar>
                </IconButton>
              </Tooltip>

              {}
              <div
                ref={menuRef}
                className={`custom-menu-container ${menuOpen ? "active" : ""}`}
              >
                <ul className="custom-menu-list">
                  <li>
                    <button
                      className="custom-menu-item"
                      onClick={() => handleMenuItemClick("settings")}
                    >
                      Налаштування
                    </button>
                  </li>
                  <li>
                    <button
                      className="custom-menu-item"
                      onClick={() => handleMenuItemClick("logout")}
                    >
                      Вийти
                    </button>
                  </li>
                </ul>
              </div>
            </Box>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Увійти
            </Link>{" "}
            <Link to="/register" className="nav-link">
              Зареєструватись
            </Link>{" "}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
