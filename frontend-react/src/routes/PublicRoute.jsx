import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

export default function PublicRoute() {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <CircularProgress />
      </div>
    );
  }

  // User already logged in
  if (user) {
    if (user.roles?.includes("ADMIN")) {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
