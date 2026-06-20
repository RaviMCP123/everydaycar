import type { Metadata } from "next";
import { FaqPageContent } from "@/src/components/faq/FaqPageContent";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { parseFaqStructuredContent } from "@/lib/cms/parse-faq-content";
import { PAGE_SLUGS } from "@/lib/cms/routes";

async function loadFaqPage() {
  return getPageBySlug(PAGE_SLUGS.faq).catch(() => null);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadFaqPage();

  if (!page) {
    return {
      title: "FAQ — everydaycar Repair Network",
      description:
        "Find answers about repairs, services, replacement vehicles, and how the EverydayCar Repair Network works.",
    };
  }

  const title = getLocalizedText(page.metaTitle) || getLocalizedText(page.title);
  const structured =
    page.content && typeof page.content === "object"
      ? parseFaqStructuredContent(page.content as Record<string, unknown>)
      : null;
  const description =
    htmlToPlainText(getLocalizedText(page.metaDescription)) ||
    htmlToPlainText(getLocalizedText(page.description)) ||
    structured?.heroSubtitle ||
    "";

  return {
    title: `${title} — everydaycar Repair Network`,
    description: description || undefined,
  };
}

export default async function FaqsPage() {
  const page = await loadFaqPage();
  return <FaqPageContent page={page} />;
}
