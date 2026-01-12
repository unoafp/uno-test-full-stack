import { useQuery } from "@tanstack/react-query";
import apiClient from "../config/api/api-client.config";
type DtoName = "CreateUserDto";
const useDtoSchema = (dtoName: DtoName) => {
  const query = useQuery({
    queryKey: ["schemas"],
    queryFn: async () => {
      return apiClient.get("dto-schemas/private").then((res) => res.data);
    },
  });

  return { ...query, dtoSchema: query.data?.[dtoName] };
};

export default useDtoSchema;
