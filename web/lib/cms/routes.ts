import type { CmsCategory, NavLink } from "@/lib/api/types";

/** Page slug used when fetching static content from the API. */
export const PAGE_SLUGS = {
  home: "home",
  about: "about",
  services: "services",
  ourNetwork: "our-network",
  bookARepair: "book-a-repair",
  findARepairer: "find-a-repairer",
  contact: "contact",
  footer: "footer",
  privacy: "privacy-policy",
  terms: "terms-and-conditions",
} as const;

export function categorySlugToHref(slug: string | undefined): string {
  if (!slug) return "/";
  const normalized = slug.trim().toLowerCase();
  if (normalized === "home") return "/";
  return `/${normalized}`;
}

export function getPlacementSortOrder(
  category: CmsCategory,
  placement: "header" | "footer" | "banner" | "quicklinks",
): number {
  const item = category.placement?.find((p) => p.type === placement);
  return item?.sortOrder ?? category.sortOrder ?? 0;
}

export function sortCategoriesByPlacement(
  categories: CmsCategory[],
  placement: "header" | "footer",
): CmsCategory[] {
  return [...categories].sort(
    (a, b) =>
      getPlacementSortOrder(a, placement) - getPlacementSortOrder(b, placement),
  );
}

export function categoriesToNavLinks(categories: CmsCategory[]): NavLink[] {
  return sortCategoriesByPlacement(categories, "header")
    .filter((cat) => cat.slug && cat.slug !== "home")
    .map((cat) => {
      const href = categorySlugToHref(cat.slug);
      const activeHrefs =
        href === "/contact" ? ["/contact", "/contact-us"] : undefined;
      const networkActive =
        href === "/our-network" ? ["/our-network", "/network"] : undefined;

      return {
        label: cat.name,
        href,
        activeHrefs: activeHrefs ?? networkActive,
      };
    });
}

/** Default nav when API is unavailable (matches original static site). */
export const DEFAULT_HEADER_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Our Network",
    href: "/our-network",
    activeHrefs: ["/our-network", "/network"],
  },
  { label: "Contact", href: "/contact", activeHrefs: ["/contact", "/contact-us"] },
];

export const DEFAULT_FOOTER_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Network", href: "/our-network" },
  { label: "Contact", href: "/contact" },
];
