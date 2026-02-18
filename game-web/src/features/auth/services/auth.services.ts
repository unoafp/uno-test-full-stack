import { apiFetch } from "@/shared/api/client";
import { User } from "../models/user";

export const login = async ({ name, run }: { name: string; run: string }) => {
  await apiFetch("/auth/identify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, run }),
  });

  return (await getMe()) as User;
};

export const getMe = async () => {
  const res = await apiFetch("/auth/me");
  return (await res.json()) as User;
};

export const logout = async () => {
  const res = await apiFetch("/auth/logout", {
    method: "POST",
  });
  await res.json();
  return;
};
