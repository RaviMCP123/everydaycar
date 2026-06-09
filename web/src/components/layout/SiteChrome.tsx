"use client";

import { useCallback, useState } from "react";
import type { NavLink } from "@/lib/api/types";
import { CmsNavigationLoader } from "@/src/components/cms/CmsNavigationLoader";
import { Footer } from "./Footer";
import { Header } from "./Header";

type SiteChromeProps = {
  children: React.ReactNode;
  headerNav: NavLink[];
  footerNav: NavLink[];
  footerTagline?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerGetInTouchTitle?: string;
  footerCopyrightText?: string;
  privacyHref?: string;
  termsHref?: string;
};

export function SiteChrome({
  children,
  headerNav: initialHeaderNav,
  footerNav: initialFooterNav,
  footerTagline,
  footerAddress,
  footerPhone,
  footerGetInTouchTitle,
  footerCopyrightText,
  privacyHref,
  termsHref,
}: SiteChromeProps) {
  const [headerNav, setHeaderNav] = useState(initialHeaderNav);
  const [footerNav, setFooterNav] = useState(initialFooterNav);

  const onHeaderChange = useCallback((links: NavLink[]) => {
    setHeaderNav(links);
  }, []);

  const onFooterChange = useCallback((links: NavLink[]) => {
    setFooterNav(links);
  }, []);

  return (
    <>
      <CmsNavigationLoader
        initialHeader={initialHeaderNav}
        initialFooter={initialFooterNav}
        onHeaderChange={onHeaderChange}
        onFooterChange={onFooterChange}
      />
      <Header navigation={headerNav} />
      <main className="flex-1">{children}</main>
      <Footer
        footerLinks={footerNav}
        tagline={footerTagline}
        address={footerAddress}
        phone={footerPhone}
        getInTouchTitle={footerGetInTouchTitle}
        copyrightText={footerCopyrightText}
        privacyHref={privacyHref}
        termsHref={termsHref}
      />
    </>
  );
}
