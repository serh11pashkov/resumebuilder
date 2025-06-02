import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const PrivateRoute = ({ element, requiredRole }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  if (isLoading) {
    return <div>Перевірка автентифікації...</div>;
  }

  if (!currentUser) {
    console.log("PrivateRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (requiredRole && !currentUser.roles.includes(requiredRole)) {
    console.log(
      `PrivateRoute: User doesn't have required role: ${requiredRole}, redirecting to home`
    );
    return <Navigate to="/" />;
  }

  console.log(
    "PrivateRoute: Authentication successful, rendering protected content"
  );
  return element;
};

export default PrivateRoute;
