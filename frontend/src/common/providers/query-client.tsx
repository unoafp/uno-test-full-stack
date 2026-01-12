// import { alertService } from "@/services/alert.service";
import { QueryClient } from "@tanstack/react-query";
import { alertService } from "../services/alert.service";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {
      onError: (error) => {
        if (isAxiosError(error)) {
          const errorData = error.response?.data;
          if (errorData.message)
            alertService.error({ message: errorData.message });
          else alertService.error({ message: error.message });
        } else {
          alertService.error({ message: error.message });
        }
      },
    },
  },
});
