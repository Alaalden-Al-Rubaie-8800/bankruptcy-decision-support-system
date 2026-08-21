import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function backendFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const headers = new Headers(init.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  return fetch(`${backendUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export function backendBaseUrl() {
  return backendUrl;
}
