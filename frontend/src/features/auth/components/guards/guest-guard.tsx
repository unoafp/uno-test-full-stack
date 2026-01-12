import { useIsAutheticated } from "@/features/auth/hooks/use-is-authenticated";
import LoadingScreen from "../loading-screen";
import { Outlet, Navigate } from "@tanstack/react-router";

const GuestGuard: React.FC<{ navigateTo: string }> = ({ navigateTo }) => {
  const { isAuthenticated } = useIsAutheticated();

  if (isAuthenticated === null) {
    return <LoadingScreen message="Cargando" />;
  }

  if (isAuthenticated === true) {
    return <Navigate to={navigateTo} replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
