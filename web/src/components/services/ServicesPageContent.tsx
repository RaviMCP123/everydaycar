"use client";

import type { PageDetail } from "@/lib/api/types";
import { useCmsPage } from "@/lib/cms/use-cms-page";
import { getLocalizedText } from "@/lib/cms/content";
import { parseServicesStructuredContent } from "@/lib/cms/parse-services-content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";
import { HeroSection } from "@/src/components/services/HeroSection";
import { ServicesCTA } from "@/src/components/services/ServicesCTA";
import { ServicesListSection } from "@/src/components/services/ServicesListSection";

type ServicesPageContentProps = {
  page?: PageDetail | null;
};

export function ServicesPageContent({
  page: initialPage = null,
}: ServicesPageContentProps) {
  const page = useCmsPage(PAGE_SLUGS.services, initialPage);

  const structured =
    page?.content && typeof page.content === "object"
      ? parseServicesStructuredContent(page.content as Record<string, unknown>)
      : null;

  if (structured) {
    return (
      <>
        <HeroSection
          imageSrc={structured.heroImage}
          eyebrow={structured.heroEyebrow}
          title={structured.heroTitle}
          subtitle={structured.heroSubtitle}
        />
        <ServicesListSection
          title={structured.listTitle}
          items={structured.cards.map((card, idx) => ({
            title: card.title,
            description: card.description,
            image: card.image || "",
            number: card.number,
            reversed: idx % 2 === 1,
            bullets: card.bullets,
          }))}
        />
        <ServicesCTA
          title={structured.ctaTitle}
          buttonText={structured.ctaButtonText}
          buttonHref={structured.ctaButtonLink}
        />
      </>
    );
  }

  const descriptionHtml = page ? getLocalizedText(page.description) : "";
  if (descriptionHtml.trim() || page) {
    return (
      <CmsPageLoader
        slug={PAGE_SLUGS.services}
        eyebrow="Services"
        initialPage={page}
      />
    );
  }

  return null;
}
