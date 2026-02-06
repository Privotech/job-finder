import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect users without the required role to their role-specific dashboard
    if (user.role === "employer") return <Navigate to="/employer" replace />;
    if (user.role === "job_seeker") return <Navigate to="/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
