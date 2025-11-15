import { Navigate } from "react-router-dom";
/**
 * children - the component to render
 * requiredRole - string e.g. "admin" or "user"
 *
 * This component reads token from localStorage, parses it (no server call)
 * and verifies the role. For strict validation, call the /me endpoint on mount.
 */


export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;
    if (!role) return <Navigate to="/login" replace />;
    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}

