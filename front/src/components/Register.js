import { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin role

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return false;
    }

    if (username.length < 3 || username.length > 20) {
      setMessage("Username must be between 3 and 20 characters.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  };
  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);
    setLoading(true);
    if (validateForm()) {
      // Add roles array if isAdmin is checked
      const roles = isAdmin ? ["admin"] : [];

      AuthService.register(username, email, password, roles)
        .then((response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        })
        .catch((error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setSuccessful(false);
          setMessage(resMessage);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 className="text-center mb-4">Sign Up</h2>

      {!successful && (
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>{" "}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isAdmin"
                name="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isAdmin">
                Register as Admin
              </label>
            </div>
          </div>
          <div className="form-group">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </div>
          {message && (
            <div className="form-group">
              <div className="text-error" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
      )}

      {successful && (
        <div className="alert alert-success" role="alert">
          {message}
          <p className="mt-2">Redirecting to login page...</p>
        </div>
      )}

      <div className="mt-3 text-center">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="btn-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
