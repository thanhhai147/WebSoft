import React, { useContext } from "react";
import UserContext from "../contexts/user.context";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useContext(UserContext);

  return allowedRoles.includes(role) ? (
    children
  ) : (
    <Navigate to="/not-authorized" />
  );
}
