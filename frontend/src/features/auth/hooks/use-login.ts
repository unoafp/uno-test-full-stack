import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/auth.service";
import { alertService } from "@/common/services/alert.service";
import type { LoginDto } from "../services/auth.types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginDto) =>
      await authService.login(credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      alertService.success({ title: "Bienvenido" });
    },
  });
};
