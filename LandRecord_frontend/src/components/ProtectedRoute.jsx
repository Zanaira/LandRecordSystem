import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import showToast from "./ShowToast";

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const [redirect, setRedirect] = useState(false);

  // Try to read role safely
  const rawRole = localStorage.getItem("role");
  const role = rawRole ? rawRole.replace(/['"]+/g, "") : null; // clean quotes if JSON stored

  console.log("Role from storage:", role);

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      showToast("You don't have Access", "warning");
      const timer = setTimeout(() => setRedirect(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [role, allowedRoles]);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
