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
  faq: "faqs",
} as const;

export function categorySlugToHref(slug: string | undefined): string {
  const normalized = String(slug ?? "").trim().toLowerCase();
  if (!normalized || normalized === "undefined") return "/";
  if (normalized === "home") return "/";
  return `/${normalized}`;
}

export function isValidCategorySlug(slug: string | undefined): slug is string {
  const normalized = String(slug ?? "").trim().toLowerCase();
  return normalized.length > 0 && normalized !== "undefined";
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

export function categoriesToNavLinks(
  categories: CmsCategory[],
  placement: "header" | "footer" = "header",
): NavLink[] {
  return sortCategoriesByPlacement(categories, placement)
    .filter((cat) => isValidCategorySlug(cat.slug))
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

export function buildHeaderNav(categories: CmsCategory[]): NavLink[] {
  const links = categoriesToNavLinks(categories, "header");
  if (links.length === 0) return DEFAULT_HEADER_NAV;
  if (links.some((link) => link.href === "/")) return links;
  return [{ label: "Home", href: "/" }, ...links];
}

export function buildFooterNav(categories: CmsCategory[]): NavLink[] {
  const links = categoriesToNavLinks(categories, "footer");
  return links.length > 0 ? links : DEFAULT_FOOTER_NAV;
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

/** Paths with their own pre-built static HTML (not only [slug]). */
export const STATIC_APP_PATHS = new Set([
  "",
  "about",
  "services",
  "our-network",
  "network",
  "contact",
  "contact-us",
  "book-a-repair",
  "book-repair",
  "repair-booking",
  "find-a-repairer",
  "privacy-policy",
  "terms-and-conditions",
  "faq",
  "faqs",
  "404",
  "_next",
]);

export function getPublicBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return raw.replace(/\/$/, "");
}

/** Extract CMS slug from a browser pathname (supports optional basePath). */
export function slugFromPathname(
  pathname: string,
  basePath = getPublicBasePath(),
): string | null {
  let path = pathname.trim();
  if (!path) return null;

  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || "/";
  }

  const segments = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const slug = segments[0].toLowerCase();
  if (!slug || slug === "undefined" || slug === "404.html") return null;
  if (STATIC_APP_PATHS.has(slug)) return null;

  return slug;
}
