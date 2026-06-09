import type { ApiResponse } from "./types";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/** Base URL without trailing slash, e.g. http://localhost:8000 */
export function getApiBaseUrl(): string {
  const url =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
      : (process.env.NEXT_PUBLIC_API_URL ??
        process.env.NEXT_API_URL ??
        "http://localhost:8000");
  return url.replace(/\/$/, "");
}

/** Builds full API URL: {base}/api{path} */
export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${normalizedPath}`;
}

type FetchOptions = {
  revalidate?: number | false;
  cache?: RequestCache;
};

export async function apiGet<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const url = buildApiUrl(path);

  const init: RequestInit = {
    method: "GET",
    headers: { Accept: "application/json" },
  };

  if (options.cache) {
    init.cache = options.cache;
  } else if (options.revalidate !== undefined) {
    init.next = { revalidate: options.revalidate };
  } else if (process.env.NODE_ENV === "development") {
    init.cache = "no-store";
  } else if (process.env.NODE_ENV === "production") {
    init.next = { revalidate: 60 };
  }

  const response = await fetch(url, init);
  let body: ApiResponse<T> | null = null;

  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message ?? `Request failed (${response.status})`,
      response.status,
    );
  }

  if (!body || body.data === undefined || body.data === null) {
    throw new ApiError("Invalid API response", response.status);
  }

  return body.data;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Request failed (${response.status})`,
      response.status,
    );
  }

  if (!payload || payload.data === undefined || payload.data === null) {
    throw new ApiError("Invalid API response", response.status);
  }

  return payload.data;
}

/** Browser-safe GET (for static export pages that fetch at runtime). */
export async function apiGetClient<T>(path: string): Promise<T | null> {
  const url = buildApiUrl(path);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const body = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !body?.data) {
      return null;
    }

    return body.data;
  } catch {
    return null;
  }
}
