import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/auth.service";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await authService.logout(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  return { logout: mutation.mutate, ...mutation };
};
