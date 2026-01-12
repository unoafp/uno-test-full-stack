import { useQuery } from "@tanstack/react-query";
import authService from "../services/auth.service";

export const useIsAutheticated = () => {
  const query = useQuery<boolean>({
    queryKey: ["auth", "is-authenticated"],
    queryFn: async () => {
      return authService.isAuthenticated();
    },
  });
  return { isAuthenticated: query.data ?? null, ...query };
};
