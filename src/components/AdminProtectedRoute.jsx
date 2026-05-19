import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProtectedRoute({
  children,
  superAdminOnly = false,
}) {
  const { isAuthenticated, isSuperAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
