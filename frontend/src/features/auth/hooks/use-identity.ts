import { useQuery } from "@tanstack/react-query";
import { useIsAutheticated } from "./use-is-authenticated";
import authService from "../services/auth.service";

export const useIdentity = () => {
  const { isAuthenticated } = useIsAutheticated();
  const query = useQuery({
    enabled: !!isAuthenticated,
    queryKey: ["auth", "identity"],
    queryFn: async () => {
      const identity = await authService.getIdentity();
      return identity;
    },
  });

  return { identity: query.data, ...query };
};
