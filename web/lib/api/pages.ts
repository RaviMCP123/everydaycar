import { apiGet, apiGetClient, ApiError } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { PageDetail } from "./types";

export async function getPageBySlug(slug: string): Promise<PageDetail | null> {
  try {
    return await apiGet<PageDetail>(API_ENDPOINTS.page.detail(slug));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    if (process.env.NODE_ENV === "development") {
      console.error(`[CMS] Failed to load page "${slug}":`, error);
    }
    return null;
  }
}

/** Client-side page fetch (static export / browser). */
export function fetchPageBySlugClient(slug: string): Promise<PageDetail | null> {
  return apiGetClient<PageDetail>(API_ENDPOINTS.page.detail(slug));
}
