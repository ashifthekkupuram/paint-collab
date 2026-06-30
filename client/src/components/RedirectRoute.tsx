import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";

const RedirectRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default RedirectRoute;
