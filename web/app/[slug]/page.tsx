import type { Metadata } from "next";
import { getCategories } from "@/lib/api/cms";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
import { CmsPageLoader } from "@/src/components/cms/CmsPageLoader";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
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
  "faq",
  "faqs",
]);

/** Fallback slugs so static export never receives an empty param list. */
const FALLBACK_CMS_SLUGS = ["privacy-policy", "terms-and-conditions", "faqs"];

function toSlugParams(slugs: string[]): Array<{ slug: string }> {
  const unique = Array.from(
    new Set(slugs.map((slug) => slug.trim().toLowerCase()).filter(Boolean)),
  );
  const list = unique.length > 0 ? unique : FALLBACK_CMS_SLUGS;
  return list.map((slug) => ({ slug }));
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const categories = await getCategories({ status: true });
    const slugs = categories
      .map((category) => category.slug?.trim().toLowerCase())
      .filter((slug): slug is string => Boolean(slug))
      .filter((slug) => !RESERVED_SLUGS.has(slug));

    return toSlugParams(slugs);
  } catch (error) {
    console.warn(
      "[CMS] generateStaticParams: API unavailable, using fallback slugs",
      error,
    );
    return toSlugParams(FALLBACK_CMS_SLUGS);
  }
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug).catch(() => null);
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
  const { slug } = await params;
  return <CmsPageLoader slug={slug} eyebrow={slug} />;
}
