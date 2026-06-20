import type { PageDetail } from "@/lib/api/types";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { getLocalizedText } from "@/lib/cms/content";
import { parseHomeStructuredContent, isHomePageTemplate } from "@/lib/cms/parse-home-content";
import { resolveMediaUrl } from "@/lib/images";
import { HomePageContent } from "@/src/components/home/HomePageContent";
import { CmsHtmlContent } from "./CmsHtmlContent";
import { CmsPageHero } from "./CmsPageHero";

type CmsPageViewProps = {
  page: PageDetail;
  slug?: string;
  eyebrow?: string;
  compactHero?: boolean;
};

function shouldUseHomeLayout(page: PageDetail, slug?: string): boolean {
  if (isHomePageTemplate(page.templateKey)) {
    return true;
  }
  const key = (slug ?? page.slug ?? page.customSlug ?? "").toLowerCase();
  const category = (page.category ?? "").toLowerCase();
  return key === PAGE_SLUGS.home || category === PAGE_SLUGS.home;
}

/** CMS HTML that already includes hero/sections (paste from editor). */
function isFullPageHtml(html: string): boolean {
  const trimmed = html.trim().toLowerCase();
  return (
    trimmed.startsWith("<section") ||
    (trimmed.startsWith("<div") && trimmed.includes("min-h-["))
  );
}

export function CmsPageView({
  page,
  slug,
  eyebrow,
  compactHero = false,
}: CmsPageViewProps) {
  const title = getLocalizedText(page.title);
  const descriptionHtml = getLocalizedText(page.description);
  const hasDescriptionContent = descriptionHtml.trim().length > 0;
  const metaSubtitle = getLocalizedText(page.metaDescription);
  const bannerImage = page.bannerImage
    ? resolveMediaUrl(page.bannerImage)
    : undefined;

  if (shouldUseHomeLayout(page, slug)) {
    const structured = parseHomeStructuredContent(
      (page.content as Record<string, unknown>) || undefined,
    );
    if (!structured && descriptionHtml?.trim()) {
      return (
        <CmsHtmlContent
          html={descriptionHtml}
          customCss={page.customCss}
          className="cms-page-full site-home"
        />
      );
    }
    return <HomePageContent page={page} />;
  }

  if (descriptionHtml && isFullPageHtml(descriptionHtml)) {
    return (
      <CmsHtmlContent
        html={descriptionHtml}
        customCss={page.customCss}
        className="cms-page-full"
      />
    );
  }

  return (
    <>
      <CmsPageHero
        eyebrow={eyebrow ?? title}
        title={title}
        subtitle={metaSubtitle || (hasDescriptionContent ? descriptionHtml.slice(0, 200) : "")}
        imageSrc={bannerImage}
        compact={compactHero}
      />
      {hasDescriptionContent ? (
        <section className="!bg-[#f6f8fb] py-11 md:py-14">
          <div className="container max-w-[920px]">
            <CmsHtmlContent
              html={descriptionHtml}
              customCss={page.customCss}
            />
          </div>
        </section>
      ) : null}
    </>
  );
}
