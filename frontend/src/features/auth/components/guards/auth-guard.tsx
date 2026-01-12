import { useIsAutheticated } from "@/features/auth/hooks/use-is-authenticated";
import type React from "react";
import LoadingScreen from "../loading-screen";
import { Outlet, Navigate } from "@tanstack/react-router";

const AuthGuard: React.FC<{
  onAuthFailTo: string;
}> = ({ onAuthFailTo }) => {
  const { isAuthenticated } = useIsAutheticated();

  if (isAuthenticated === null) {
    return <LoadingScreen message="Cargando" />;
  }

  if (isAuthenticated === false) {
    return <Navigate to={onAuthFailTo} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
