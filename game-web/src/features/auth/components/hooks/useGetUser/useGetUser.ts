import { getMe } from "@/features/auth/services/auth.services";
import { useQuery } from "@tanstack/react-query";

const useGetUser = () => {
  const result = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  return result;
};

export { useGetUser };
