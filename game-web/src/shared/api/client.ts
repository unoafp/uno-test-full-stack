import { UnauthorizedError } from "./errors";

export async function apiFetch(path: string, init?: RequestInit) {
  const uri = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  const res = await fetch(uri, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    throw new UnauthorizedError();
  }

  return res;
}
