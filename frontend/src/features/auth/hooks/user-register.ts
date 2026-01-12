import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/auth.service";
import type { RegisterDto } from "../services/auth.types";

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: RegisterDto) => await authService.register(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
