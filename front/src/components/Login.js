import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Clear any previous error messages when component mounts
    setMessage("");

    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      console.log(
        "Login: User already logged in, redirecting to resumes",
        currentUser.username
      );
      window.location.href = "/resumes";
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    console.log(`Login: Attempting to log in user: ${username}`);

    AuthService.login(username, password)
      .then((userData) => {
        console.log("Login: Login successful, user data:", userData);
        console.log("Login: Redirecting to resumes page");

        // Force a page reload to update authentication state across the app
        window.location.href = "/resumes";
      })
      .catch((error) => {
        console.error("Login: Login failed", error);

        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        console.error("Login: Error message", resMessage);

        setLoading(false);
        setMessage(resMessage);
      });
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 className="text-center mb-4">Login</h2>

      <form onSubmit={handleLogin}>
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
        </div>

        <div className="form-group">
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Loading..." : "Login"}
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

      <div className="mt-3 text-center">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="btn-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
