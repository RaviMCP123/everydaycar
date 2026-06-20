import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { RepairBookingPageContent } from "@/src/components/repair-booking/RepairBookingPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUGS.bookARepair).catch(() => null);

  if (!page) {
    return {
      title: "Book a Repair — everydaycar Repair Network",
      description: "Book your accident repair and get support quickly.",
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

export default function BookARepairPage() {
  return <RepairBookingPageContent />;
}
