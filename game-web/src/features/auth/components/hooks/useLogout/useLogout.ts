import { logout } from "@/features/auth/services/auth.services";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  const setUser = useAuthStore((s) => s.setUser);

  const results = useMutation({
    mutationFn: logout,
    retry: false,
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  return results;
};
