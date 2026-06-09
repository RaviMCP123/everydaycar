import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/api/cms";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";

type SlugPageProps = {
  params: { slug: string };
};

const RESERVED_SLUGS = new Set([
  "home",
  "about",
  "services",
  "our-network",
  "network",
  "contact",
  "repair-booking",
  "book-repair",
  "find-a-repairer",
  "privacy-policy",
  "terms-and-conditions",
]);

/** CMS pages that have dedicated routes or must exist in static export. */
const STATIC_CMS_PAGE_SLUGS = ["privacy-policy", "terms-and-conditions"];

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const categories = await getCategories({ status: true });
    const slugs = categories
      .map((category) => category.slug?.trim().toLowerCase())
      .filter((slug): slug is string => Boolean(slug))
      .filter((slug) => !RESERVED_SLUGS.has(slug));

    return Array.from(new Set([...slugs, ...STATIC_CMS_PAGE_SLUGS])).map(
      (slug) => ({ slug }),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug).catch(() => null);
  if (!page) {
    return {
      title: "everydaycar Repair Network",
    };
  }

  const title = getLocalizedText(page.metaTitle) || getLocalizedText(page.title);
  const description =
    htmlToPlainText(getLocalizedText(page.metaDescription)) ||
    htmlToPlainText(getLocalizedText(page.description));

  return {
    title: title || "everydaycar Repair Network",
    description: description || undefined,
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const page = await getPageBySlug(params.slug).catch(() => null);
  if (!page) {
    notFound();
  }

  return (
    <CmsPageLoader
      slug={params.slug}
      eyebrow={getLocalizedText(page.title)}
      initialPage={page}
    />
  );
}
