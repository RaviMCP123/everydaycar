import type { PageDetail } from "@/lib/api/types";
import { HeroSection } from "@/src/components/services/HeroSection";
import { ServicesListSection } from "@/src/components/services/ServicesListSection";
import { ServicesCTA } from "@/src/components/services/ServicesCTA";
import { parseServicesStructuredContent } from "@/lib/cms/parse-services-content";
import { getLocalizedText } from "@/lib/cms/content";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";
import { PAGE_SLUGS } from "@/lib/cms/routes";

type ServicesPageContentProps = {
  page?: PageDetail | null;
};

export function ServicesPageContent({ page }: ServicesPageContentProps) {
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
  if (descriptionHtml.trim()) {
    return (
      <CmsPageLoader
        slug={PAGE_SLUGS.services}
        eyebrow="Services"
        initialPage={page}
      />
    );
  }

  if (page) {
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
