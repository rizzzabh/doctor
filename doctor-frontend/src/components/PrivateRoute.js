import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // If token exists, show the page. Otherwise, redirect to login.
  return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
