import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home } from "../pages/Home";

export function RoleBasedRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
      </div>
    );
  }

  // If not authenticated, show login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show role-specific dashboard
  if (user.role === "employer") {
    return <Navigate to="/employer" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Default for job_seeker or any other role
  return <Navigate to="/dashboard" replace />;
}
