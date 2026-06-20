import { getCategories } from "@/lib/api/cms";
import type { NavLink } from "@/lib/api/types";
import {
  buildFooterNav,
  buildHeaderNav,
  DEFAULT_FOOTER_NAV,
  DEFAULT_HEADER_NAV,
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

    return {
      header: buildHeaderNav(headerCategories),
      footer: buildFooterNav(footerCategories),
    };
  } catch {
    return {
      header: DEFAULT_HEADER_NAV,
      footer: DEFAULT_FOOTER_NAV,
    };
  }
}
