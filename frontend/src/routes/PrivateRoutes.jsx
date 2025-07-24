import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-20">Cargando...</div>;
  }
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
