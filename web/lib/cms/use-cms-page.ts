"use client";

import { useEffect, useState } from "react";
import { fetchPageBySlugClient } from "@/lib/api/pages";
import type { PageDetail } from "@/lib/api/types";

/**
 * Loads CMS page data from the API on every mount (page reload / navigation).
 * `initialPage` is optional shell from static build; fresh API data replaces it.
 */
export function useCmsPage(
  slug: string,
  initialPage: PageDetail | null = null,
): PageDetail | null {
  const [page, setPage] = useState<PageDetail | null>(initialPage);

  useEffect(() => {
    let cancelled = false;

    fetchPageBySlugClient(slug).then((data) => {
      if (!cancelled) {
        setPage(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return page;
}
