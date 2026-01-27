import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // if token is missing OR is literally the string "null"
  if (!token || token === "null" || token === "undefined") {
    return <Navigate to="/" replace />;
  }

  return children;
}
