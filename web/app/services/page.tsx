import type { Metadata } from "next";
import { ServicesPageContent } from "@/src/components/services/ServicesPageContent";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.services).catch(() => null);

  if (!page) {
    return {
      title: "Services — everydaycar Repair Network",
      description: "Accident repair services across Australia.",
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

export default async function ServicesPage() {
  const page = await getPageBySlug(PAGE_SLUGS.services).catch(() => null);
  return <ServicesPageContent page={page} />;
}
