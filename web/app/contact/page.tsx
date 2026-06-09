import type { Metadata } from "next";
import { ContactPageContent } from "@/src/components/contact/ContactPageContent";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.contact).catch(() => null);

  if (!page) {
    return {
      title: "Contact — everydaycar Repair Network",
      description: "Get in touch with the everydaycar repair network.",
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

export default async function ContactPage() {
  const page = await getPageBySlug(PAGE_SLUGS.contact).catch(() => null);
  return <ContactPageContent page={page} />;
}
