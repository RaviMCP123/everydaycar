"use client";

import type { PageDetail } from "@/lib/api/types";
import { useCmsPage } from "@/lib/cms/use-cms-page";
import { parseAboutStructuredContent } from "@/lib/cms/parse-about-content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { CompanyFactsSection } from "@/src/components/about/CompanyFactsSection";
import { HeroSection } from "@/src/components/about/HeroSection";
import { JoinNetworkCTASection } from "@/src/components/about/JoinNetworkCTASection";
import { ServedLocationsSection } from "@/src/components/about/ServedLocationsSection";
import { WhatWeDoNotDoSection } from "@/src/components/about/WhatWeDoNotDoSection";
import { WhoWeAreSection } from "@/src/components/about/WhoWeAreSection";
import { WhyChooseUsSection } from "@/src/components/about/WhyChooseUsSection";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";
import { images } from "@/src/image";

const COMPANY_FACT_DEFAULT_ICONS = [
  images.legal,
  images.abn,
  images.founded,
  images.headOffice,
  images.phone,
  images.email,
  images.trading,
] as const;

type AboutPageContentProps = {
  page?: PageDetail | null;
};

export function AboutPageContent({ page: initialPage = null }: AboutPageContentProps) {
  const page = useCmsPage(PAGE_SLUGS.about, initialPage);

  const structured =
    page?.content && typeof page.content === "object"
      ? parseAboutStructuredContent(page.content as Record<string, unknown>)
      : null;

  if (structured) {
    const whoItems = structured.whoItems
      .filter((item) => item.title?.trim() || item.text?.trim())
      .map((item) => ({
        image: item.icon || images.aboutOverviewHandshake,
        title: item.title,
        text: item.text,
      }));

    const companyFactsItems = structured.companyFactsItems
      .filter((item) => item.title?.trim() || item.text?.trim())
      .map((item, index) => ({
        image:
          item.icon ||
          COMPANY_FACT_DEFAULT_ICONS[index % COMPANY_FACT_DEFAULT_ICONS.length],
        title: item.title,
        text: item.text,
      }));

    const whyCards = structured.whyCards
      .filter((card) => card.title?.trim() || card.text?.trim())
      .map((card) => ({
        image: card.icon || images.aboutShield,
        imageAlt: card.title,
        title: card.title,
        text: card.text,
      }));

    return (
      <>
        <HeroSection
          imageSrc={structured.heroImage}
          eyebrow={structured.heroEyebrow}
          title={structured.heroTitle}
          subtitle={structured.heroSubtitle}
        />
        {whoItems.length > 0 ? (
          <WhoWeAreSection
            title={structured.whoTitle}
            imageSrc={structured.whoImage}
            items={whoItems}
          />
        ) : null}
        <WhatWeDoNotDoSection
          title={structured.notDoTitle}
          text={structured.notDoText}
        />
        <ServedLocationsSection intro={structured.servedIntro} />
        {companyFactsItems.length > 0 ? (
          <CompanyFactsSection
            title={structured.companyFactsTitle}
            imageSrc={structured.companyFactsImage}
            items={companyFactsItems}
          />
        ) : null}
        <JoinNetworkCTASection
          title={structured.joinTitle}
          description={structured.joinDescription}
          buttonText={structured.joinButtonText}
          buttonLink={structured.joinButtonLink}
        />
        {whyCards.length > 0 ? (
          <WhyChooseUsSection
            title={structured.whyTitle}
            cards={whyCards}
          />
        ) : null}
      </>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <CmsPageLoader
      slug={PAGE_SLUGS.about}
      eyebrow="About Us"
      initialPage={page}
    />
  );
}
