"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useEffect } from "react";
import { useGetUser } from "../hooks/useGetUser";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  const { isLoading, isError, isSuccess, data } = useGetUser();

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (isSuccess) {
      setUser(data ? data : null);
    }
  }, [isSuccess, data, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
    }
  }, [isError, setUser]);

  return <>{children}</>;
};
