import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get the current user from AuthService
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <div>
      <div className="card mb-4">
        <h1 className="text-center mb-4">Resume Builder Application</h1>
        <p className="text-center mb-4">
          Create professional resumes for your job applications
        </p>

        <div className="mt-4 text-center">
          {currentUser ? (
            <div>
              <p>
                Welcome back, <strong>{currentUser.username}</strong>!
              </p>
              <div className="mt-3">
                <Link to="/resumes" className="btn btn-primary mr-3">
                  View My Resumes
                </Link>
                <Link to="/resumes/new" className="btn btn-secondary">
                  Create New Resume
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p>Get started by creating an account or logging in</p>
              <div className="mt-3">
                <Link to="/register" className="btn btn-primary mr-3">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid">
        <div className="card card-hover">
          <h3>Easy Resume Creation</h3>
          <p>
            Create professional resumes with our intuitive form-based editor.
          </p>
        </div>

        <div className="card card-hover">
          <h3>Multiple Formats</h3>
          <p>
            Save your resume as PDF for easy sharing with potential employers.
          </p>
        </div>

        <div className="card card-hover">
          <h3>Manage Your Resumes</h3>
          <p>
            Create and manage multiple versions of your resume for different job
            applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
