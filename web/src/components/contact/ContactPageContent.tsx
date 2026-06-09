"use client";

import { useEffect, useState } from "react";
import type { PageDetail } from "@/lib/api/types";
import { fetchPageBySlugClient } from "@/lib/api/pages";
import { parseContactStructuredContent } from "@/lib/cms/parse-contact-content";
import { ContactForm } from "@/src/components/contact/ContactForm";
import { ContactInfoCard } from "@/src/components/contact/ContactInfoCard";
import { CmsPageView } from "@/src/components/cms/CmsPageView";
import { resolveMediaUrl } from "@/lib/images";
import { PAGE_SLUGS } from "@/lib/cms/routes";

type ContactPageContentProps = {
  page?: PageDetail | null;
};

export function ContactPageContent({ page: initialPage = null }: ContactPageContentProps) {
  const [page, setPage] = useState<PageDetail | null>(initialPage);

  const structured =
    page?.content && typeof page.content === "object"
      ? parseContactStructuredContent(page.content as Record<string, unknown>)
      : null;

  useEffect(() => {
    let cancelled = false;

    fetchPageBySlugClient(PAGE_SLUGS.contact).then((data) => {
      if (!cancelled && data) {
        setPage(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!page) {
    return null;
  }

  return (
    <>
      <CmsPageView
        page={
          structured
            ? {
                ...page,
                title: structured.heroTitle || page.title,
                metaDescription: structured.heroSubtitle || page.metaDescription,
                bannerImage: resolveMediaUrl(structured.heroImage) || page.bannerImage,
              }
            : page
        }
        eyebrow={structured?.heroEyebrow || "Contact Us"}
        compactHero
      />
      <section className="min-h-[620px] !bg-[#f6f8fb] py-11">
        <div className="container grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.86fr_1.22fr] lg:gap-7">
          <ContactInfoCard page={page} structured={structured} />
          <ContactForm
            title={structured?.formTitle}
            submitText={structured?.formSubmitText}
          />
        </div>
      </section>
    </>
  );
}
