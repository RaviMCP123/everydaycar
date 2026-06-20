import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { FindARepairerPageContent } from "@/src/components/find-a-repairer/FindARepairerPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.findARepairer).catch(() => null);

  if (!page) {
    return {
      title: "Find a Repairer — everydaycar Repair Network",
      description: "Find an approved repairer near you.",
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

export default function FindARepairerPage() {
  return <FindARepairerPageContent />;
}
