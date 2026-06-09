import type { Metadata } from "next";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.privacy).catch(() => null);

  if (!page) {
    return {
      title: "Privacy Policy — everydaycar Repair Network",
      description:
        "Learn how everydaycar Repair Network collects, uses, and protects your personal information.",
    };
  }

  const title = getLocalizedText(page.metaTitle) || getLocalizedText(page.title);
  const description =
    htmlToPlainText(getLocalizedText(page.metaDescription)) ||
    htmlToPlainText(getLocalizedText(page.description));

  return {
    title: `${title} — everydaycar Repair Network`,
    description: description || undefined,
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug(PAGE_SLUGS.privacy).catch(() => null);

  return (
    <CmsPageLoader
      slug={PAGE_SLUGS.privacy}
      eyebrow="Legal"
      initialPage={page}
    />
  );
}
