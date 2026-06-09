import { normalizeCmsHtml } from "@/lib/cms/content";

type CmsHtmlContentProps = {
  html: string;
  className?: string;
  customCss?: string;
};

export function CmsHtmlContent({
  html,
  className = "",
  customCss,
}: CmsHtmlContentProps) {
  if (!html?.trim()) return null;

  const isFullPage = className.includes("cms-page-full");
  const wrapperClass = isFullPage
    ? className.trim()
    : `cms-html-content prose-cms ${className}`.trim();

  return (
    <>
      {customCss?.trim() ? (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      ) : null}
      <div
        className={wrapperClass}
        dangerouslySetInnerHTML={{ __html: normalizeCmsHtml(html) }}
      />
    </>
  );
}
