import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
