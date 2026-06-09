import type { PageDetail } from "@/lib/api/types";
import { HeroSection } from "@/src/components/about/HeroSection";
import { WhoWeAreSection } from "@/src/components/about/WhoWeAreSection";
import { WhyChooseUsSection } from "@/src/components/about/WhyChooseUsSection";
import { parseAboutStructuredContent } from "@/lib/cms/parse-about-content";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";
import { images } from "@/src/image";
import { PAGE_SLUGS } from "@/lib/cms/routes";

type AboutPageContentProps = {
  page?: PageDetail | null;
};

export function AboutPageContent({ page }: AboutPageContentProps) {
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
