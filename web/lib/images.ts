import { getApiBaseUrl } from "@/lib/api/client";

/**
 * Resolves CMS/API media paths to absolute URLs.
 * Handles `/uploads/...`, legacy `/page-content/...`, and full URLs.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const isLocalDevHost =
      /localhost:\d+/i.test(trimmed) || /127\.0\.0\.1:\d+/i.test(trimmed);

    if (isLocalDevHost) {
      const base = getApiBaseUrl();
      const path = trimmed.replace(/^https?:\/\/[^/]+/, "");
      return `${base}${path}`;
    }
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    const base = getApiBaseUrl();
    if (
      trimmed.startsWith("/uploads/") ||
      trimmed.startsWith("/page-content/") ||
      trimmed.startsWith("/user/")
    ) {
      return `${base}${trimmed}`;
    }
    return trimmed;
  }

  return trimmed;
}
