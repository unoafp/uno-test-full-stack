import { QueryClient } from "@tanstack/react-query";
import { UnauthorizedError } from "./errors";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof UnauthorizedError) {
          return false;
        }
        return failureCount < 3;
      },
      throwOnError: (error) => {
        if (error instanceof UnauthorizedError) {
          useAuthStore.getState().setUser(null);

          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
        return false;
      },
    },
  },
});
