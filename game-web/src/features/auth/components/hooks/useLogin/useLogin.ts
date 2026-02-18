import { login } from "@/features/auth/services/auth.services";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  const result = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  return result;
};
