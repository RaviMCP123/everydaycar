import type { Metadata } from "next";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.home).catch(() => null);

  if (!page) {
    return {
      title: "everydaycar Repair Network",
      description:
        "Australia's trusted accident repair network connecting drivers with approved repairers.",
    };
  }

  const title = getLocalizedText(page.metaTitle) || getLocalizedText(page.title);
  const description = getLocalizedText(page.metaDescription);

  return {
    title: title || "everydaycar Repair Network",
    description: description || undefined,
  };
}

export default function Home() {
  return <CmsPageLoader slug={PAGE_SLUGS.home} eyebrow="Home" />;
}
