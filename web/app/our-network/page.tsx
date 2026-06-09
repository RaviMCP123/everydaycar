import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { NetworkPageContent } from "@/src/components/network/NetworkPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.ourNetwork).catch(() => null);

  if (!page) {
    return {
      title: "Our Network — everydaycar Repair Network",
      description: "Find your nearest approved repairer across Australia.",
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

export default async function OurNetworkPage() {
  const page = await getPageBySlug(PAGE_SLUGS.ourNetwork).catch(() => null);
  if (!page) {
    return null;
  }

  return <NetworkPageContent page={page} />;
}
