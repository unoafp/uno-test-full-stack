"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { AuthContextProvider } from "./AuthContext";

import { useLogout } from "../hooks/useLogout";

export const AuthGuard = ({
  children,
  skeleton,
  fallback,
}: {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const isLoading = useAuthStore((s) => s.isLoading);

  const user = useAuthStore((s) => s.user);

  const { mutate } = useLogout();

  const handleLogout = () => {
    mutate();
  };

  if (isLoading) {
    return <>{skeleton ?? null}</>;
  }

  if (!user) {
    return <>{fallback ?? null}</>;
  }

  return (
    <AuthContextProvider user={user} logout={handleLogout}>
      {children}
    </AuthContextProvider>
  );
};
