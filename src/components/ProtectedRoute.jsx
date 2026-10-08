import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// wrap pages that need a login: guests are sent to /login and come back afterwards
function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // wait until we know whether the cookie is valid, otherwise a refresh would bounce to /login
  if (loading) {
    return <p className="px-4 py-10 text-center text-sm text-muted">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
