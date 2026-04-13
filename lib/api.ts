import { API_BASE_URL } from "@/constants/api";
import { authStore } from "@/store";

function buildHeaders(init?: RequestInit): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  const stored = authStore.token.trim();
  if (stored.length > 0) {
    headers.set("Authorization", `Bearer ${stored}`);
  }
  if (init?.headers !== undefined) {
    const incoming = new Headers(init.headers);
    incoming.forEach((value, key) => {
      headers.set(key, value);
    });
  }
  return headers;
}

function apiLog(...parts: unknown[]) {
  if (__DEV__) {
    console.log("[api]", ...parts);
  }
}

async function logApiResponse(
  response: Response,
  method: string,
  url: string,
  ms: number,
) {
  if (!__DEV__) {
    return;
  }
  let body: unknown;
  try {
    const text = await response.clone().text();
    if (!text) {
      body = null;
    } else {
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        body = text;
      }
    }
  } catch {
    body = "(body unreadable)";
  }
  apiLog("←", method, url, response.status, `${ms}ms`, body);
}

export function joinApiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = joinApiUrl(path);
  const method = (init?.method ?? "GET").toUpperCase();
  const startedAt = Date.now();
  apiLog("→", method, url);
  try {
    const response = await fetch(url, {
      ...init,
      headers: buildHeaders(init),
    });
    await logApiResponse(
      response,
      method,
      url,
      Date.now() - startedAt,
    );
    return response;
  } catch (error) {
    apiLog("×", method, url, `${Date.now() - startedAt}ms`, error);
    throw error;
  }
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(path, init);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}
