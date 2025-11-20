import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requiredRoles = [],
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // Authentication check
    if (requireAuth && !user) {
      const redirectUrl = location.pathname + location.search;
      navigate("/login", {
        state: { from: redirectUrl },
        replace: true,
      });
      return;
    }

    // Role-based access check
    if (requireAuth && user && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) =>
        user.roles?.includes(role)
      );

      if (!hasRequiredRole) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    }

    // Redirect authenticated users away from auth pages
    if (!requireAuth && user) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [user, loading, requireAuth, requiredRoles, navigate, location]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom right, #0f172a, #1e40af, #0f172a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(59, 130, 246, 0.3)",
              borderLeft: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) return null;
  if (!requireAuth && user) return null;

  return children;
};

export default ProtectedRoute;
