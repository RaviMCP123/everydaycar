import type { PageDetail } from "@/lib/api/types";
import {
  isLegalPageTemplate,
  parseLegalStructuredContent,
  prepareLegalBodyHtml,
} from "@/lib/cms/parse-legal-content";
import { LegalHero } from "@/src/components/legal/LegalHero";

type LegalPageContentProps = {
  page: PageDetail;
};

export function LegalPageContent({ page }: LegalPageContentProps) {
  if (!isLegalPageTemplate(page.templateKey)) {
    return null;
  }

  const structured =
    page.content && typeof page.content === "object"
      ? parseLegalStructuredContent(page.content as Record<string, unknown>)
      : null;

  if (!structured) {
    return null;
  }

  const bodyHtml = structured.description
    ? prepareLegalBodyHtml(structured.description)
    : "";

  return (
    <>
      <LegalHero
        imageSrc={structured.heroImage}
        eyebrow={structured.heroEyebrow}
        title={structured.heroTitle}
        description={structured.heroDescription}
      />
      {bodyHtml ? (
        <main className="page-section legal-page-shell">
          <div className="container max-w-[980px]">
            {page.customCss?.trim() ? (
              <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
            ) : null}
            <div
              className="legal-page-content"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </main>
      ) : null}
    </>
  );
}
