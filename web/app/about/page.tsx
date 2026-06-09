import type { Metadata } from "next";
import { AboutPageContent } from "@/src/components/about/AboutPageContent";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.about).catch(() => null);

  if (!page) {
    return {
      title: "About — everydaycar Repair Network",
      description:
        "Learn about Australia's premier accident repair network.",
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

export default async function AboutPage() {
  const page = await getPageBySlug(PAGE_SLUGS.about).catch(() => null);
  return <AboutPageContent page={page} />;
}
