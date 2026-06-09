"use client";

import { useEffect, useState } from "react";
import type { PageDetail } from "@/lib/api/types";
import { fetchPageBySlugClient } from "@/lib/api/pages";
import { isLegalPageTemplate } from "@/lib/cms/parse-legal-content";
import { LegalPageContent } from "@/src/components/legal/LegalPageContent";
import { CmsPageView } from "./CmsPageView";

type CmsPageLoaderProps = {
  slug: string;
  eyebrow?: string;
  /** Pre-rendered data from build/SSR (optional). */
  initialPage?: PageDetail | null;
};

export function CmsPageLoader({
  slug,
  eyebrow,
  initialPage = null,
}: CmsPageLoaderProps) {
  const [page, setPage] = useState<PageDetail | null>(initialPage);

  useEffect(() => {
    let cancelled = false;

    fetchPageBySlugClient(slug).then((data) => {
      if (!cancelled && data) {
        setPage(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!page) {
    return null;
  }

  if (isLegalPageTemplate(page.templateKey)) {
    return <LegalPageContent page={page} />;
  }

  return <CmsPageView page={page} slug={slug} eyebrow={eyebrow} />;
}
