"use client";

import { useEffect } from "react";
import { fetchPageBySlugClient } from "@/lib/api/pages";
import {
  categorySlugToHref,
  PAGE_SLUGS,
} from "@/lib/cms/routes";
import {
  parseFooterCmsContent,
  type FooterCmsContent,
} from "@/lib/cms/footer-content";

type CmsFooterLoaderProps = {
  onFooterContentChange: (content: FooterCmsContent) => void;
  onPrivacyHrefChange?: (href: string) => void;
  onFaqHrefChange?: (href: string) => void;
  onTermsHrefChange?: (href: string) => void;
};

/** Refreshes footer copy and legal links from the API on each page load. */
export function CmsFooterLoader({
  onFooterContentChange,
  onPrivacyHrefChange,
  onFaqHrefChange,
  onTermsHrefChange,
}: CmsFooterLoaderProps) {
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchPageBySlugClient(PAGE_SLUGS.footer),
      fetchPageBySlugClient(PAGE_SLUGS.privacy),
      fetchPageBySlugClient(PAGE_SLUGS.faq),
      fetchPageBySlugClient(PAGE_SLUGS.terms),
    ]).then(([footerPage, privacyPage, faqPage, termsPage]) => {
      if (cancelled) return;

      const content = parseFooterCmsContent(footerPage);
      if (Object.keys(content).length > 0) {
        onFooterContentChange(content);
      }

      if (privacyPage?.slug) {
        onPrivacyHrefChange?.(categorySlugToHref(privacyPage.slug));
      }
      if (faqPage?.slug) {
        onFaqHrefChange?.(categorySlugToHref(faqPage.slug));
      }
      if (termsPage?.slug) {
        onTermsHrefChange?.(categorySlugToHref(termsPage.slug));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [onFooterContentChange, onPrivacyHrefChange, onFaqHrefChange, onTermsHrefChange]);

  return null;
}
