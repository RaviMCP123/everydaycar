"use client";

import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/api/types";
import { fetchCategoriesClient } from "@/lib/api/cms";
import {
  categoriesToNavLinks,
  categorySlugToHref,
  sortCategoriesByPlacement,
} from "@/lib/cms/routes";

type CmsNavigationLoaderProps = {
  initialHeader: NavLink[];
  initialFooter: NavLink[];
  onHeaderChange: (links: NavLink[]) => void;
  onFooterChange: (links: NavLink[]) => void;
};

/** Refreshes header/footer nav from API in the browser (static export). */
export function CmsNavigationLoader({
  initialHeader,
  initialFooter,
  onHeaderChange,
  onFooterChange,
}: CmsNavigationLoaderProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchCategoriesClient({ status: true, placement: "header" }),
      fetchCategoriesClient({ status: true, placement: "footer" }),
    ]).then(([headerCategories, footerCategories]) => {
      if (cancelled) return;

      const headerFromApi = categoriesToNavLinks(headerCategories);
      const footerFromApi = sortCategoriesByPlacement(footerCategories, "footer")
        .filter((cat) => cat.slug)
        .map((cat) => ({
          label: cat.name,
          href: categorySlugToHref(cat.slug),
        }));

      if (headerFromApi.length > 0) {
        onHeaderChange([
          { label: "Home", href: "/" },
          ...headerFromApi,
        ]);
      }

      if (footerFromApi.length > 0) {
        onFooterChange(footerFromApi);
      }

      setTick((n) => n + 1);
    });

    return () => {
      cancelled = true;
    };
  }, [onHeaderChange, onFooterChange]);

  return null;
}
