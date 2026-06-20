"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PageDetail } from "@/lib/api/types";
import { fetchPageBySlugClient } from "@/lib/api/pages";
import { getPublicBasePath, slugFromPathname } from "@/lib/cms/routes";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";

type ResolveState =
  | { status: "loading" }
  | { status: "found"; slug: string; page: PageDetail | null }
  | { status: "missing"; slug: string | null };

function readSlugFromLocation(): string | null {
  if (typeof window === "undefined") return null;

  const basePath =
    document.body.dataset.basePath?.trim() || getPublicBasePath();
  return slugFromPathname(window.location.pathname, basePath);
}

export function CmsNotFoundPage() {
  const [state, setState] = useState<ResolveState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const slug = readSlugFromLocation();

    if (!slug) {
      setState({ status: "missing", slug: null });
      return;
    }

    void fetchPageBySlugClient(slug).then((page) => {
      if (cancelled) return;
      if (page) {
        setState({ status: "found", slug, page });
        return;
      }
      setState({ status: "missing", slug });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="container flex min-h-[40vh] items-center justify-center py-16">
        <p className="text-sm text-[var(--color-muted-text)]">Loading page...</p>
      </div>
    );
  }

  if (state.status === "found") {
    return <CmsPageLoader slug={state.slug} eyebrow={state.slug} initialPage={state.page} />;
  }

  return (
    <div className="container flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-[var(--color-primary-navy)]">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-[var(--color-muted-text)]">
        {state.slug
          ? `We could not find a page for “${state.slug}”.`
          : "The page you requested does not exist."}
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-[7px] bg-[var(--color-button-blue)] px-5 text-sm font-bold text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
