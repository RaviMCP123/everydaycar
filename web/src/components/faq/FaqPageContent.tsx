"use client";

import type { PageDetail } from "@/lib/api/types";
import { useCmsPage } from "@/lib/cms/use-cms-page";
import {
  isFaqPageTemplate,
  parseFaqStructuredContent,
} from "@/lib/cms/parse-faq-content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { FaqAccordion } from "@/src/components/faq/FaqAccordion";
import { FaqHero } from "@/src/components/faq/FaqHero";

type FaqPageContentProps = {
  page?: PageDetail | null;
};

export function FaqPageContent({ page: initialPage = null }: FaqPageContentProps) {
  const page = useCmsPage(PAGE_SLUGS.faq, initialPage);

  if (!page) {
    return null;
  }

  if (!isFaqPageTemplate(page.templateKey)) {
    return null;
  }

  const structured =
    page.content && typeof page.content === "object"
      ? parseFaqStructuredContent(page.content as Record<string, unknown>)
      : null;

  if (!structured) {
    return null;
  }

  const items = structured.items.filter(
    (item) => item.question?.trim() || item.answer?.trim(),
  );

  const faqSchema =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      ) : null}
      <FaqHero
        imageSrc={structured.heroImage}
        eyebrow={structured.heroEyebrow}
        title={structured.heroTitle}
        subtitle={structured.heroSubtitle}
      />
      <FaqAccordion
        title={structured.listTitle || structured.heroTitle}
        items={items}
      />
    </>
  );
}
