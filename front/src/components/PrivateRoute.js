import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const PrivateRoute = ({ children, requiredRole }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the current user on component mount
    const user = AuthService.getCurrentUser();

    if (user) {
      console.log("PrivateRoute: User found in localStorage", user.username);
      console.log("PrivateRoute: User roles", user.roles);
    } else {
      console.log("PrivateRoute: No user found in localStorage");
    }

    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    console.log("PrivateRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // If role is required and user doesn't have it, redirect to home
  if (requiredRole && !currentUser.roles.includes(requiredRole)) {
    console.log(
      `PrivateRoute: User doesn't have required role: ${requiredRole}, redirecting to home`
    );
    return <Navigate to="/" />;
  }

  // Otherwise, render the children
  console.log(
    "PrivateRoute: Authentication successful, rendering protected content"
  );
  return children;
};

export default PrivateRoute;
