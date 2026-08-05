import React from "react";
import { Navigate } from "react-router-dom";

// Wrap any admin-only route with this component.
// If there's no logged-in admin, it redirects to /login instead of showing the page.
export default function ProtectedRoute({ children }) {
  const userJson = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userJson);

  if (user.userType !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}