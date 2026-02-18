import { apiFetch } from "@/shared/api/client";

export const start = async () => {
  const response = await apiFetch("/gameplays/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  return data as {
    id: string;
    cards: {
      id: string;
      title: string;
      url: string;
      value: string;
    }[];
    maxAttempts: number;
  };
};
