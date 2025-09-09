import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
