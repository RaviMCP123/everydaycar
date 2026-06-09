import { getCategories } from "@/lib/api/cms";
import type { NavLink } from "@/lib/api/types";
import {
  categoriesToNavLinks,
  categorySlugToHref,
  DEFAULT_FOOTER_NAV,
  DEFAULT_HEADER_NAV,
  sortCategoriesByPlacement,
} from "./routes";

export type SiteNavigation = {
  header: NavLink[];
  footer: NavLink[];
};

export async function fetchSiteNavigation(): Promise<SiteNavigation> {
  try {
    const [headerCategories, footerCategories] = await Promise.all([
      getCategories({ status: true, placement: "header" }),
      getCategories({ status: true, placement: "footer" }),
    ]);

    const headerFromApi = categoriesToNavLinks(headerCategories);
    const footerFromApi = sortCategoriesByPlacement(footerCategories, "footer")
      .filter((cat) => cat.slug)
      .map((cat) => ({
        label: cat.name,
        href: categorySlugToHref(cat.slug),
      }));

    return {
      header: [
        { label: "Home", href: "/" },
        ...(headerFromApi.length > 0 ? headerFromApi : DEFAULT_HEADER_NAV.slice(1)),
      ],
      footer: footerFromApi.length > 0 ? footerFromApi : DEFAULT_FOOTER_NAV,
    };
  } catch {
    return {
      header: DEFAULT_HEADER_NAV,
      footer: DEFAULT_FOOTER_NAV,
    };
  }
}
