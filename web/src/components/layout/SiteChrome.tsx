"use client";

import { useCallback, useState } from "react";
import type { NavLink } from "@/lib/api/types";
import type { FooterCmsContent } from "@/lib/cms/footer-content";
import { CmsFooterLoader } from "@/src/components/cms/CmsFooterLoader";
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
  footerEmail?: string;
  footerCopyrightText?: string;
  privacyHref?: string;
  faqHref?: string;
  termsHref?: string;
};

export function SiteChrome({
  children,
  headerNav: initialHeaderNav,
  footerNav: initialFooterNav,
  footerTagline,
  footerAddress,
  footerPhone,
  footerEmail,
  footerCopyrightText,
  privacyHref,
  faqHref,
  termsHref,
}: SiteChromeProps) {
  const [headerNav, setHeaderNav] = useState(initialHeaderNav);
  const [footerNav, setFooterNav] = useState(initialFooterNav);
  const [footerContent, setFooterContent] = useState<FooterCmsContent>({
    tagline: footerTagline,
    address: footerAddress,
    phone: footerPhone,
    email: footerEmail,
    copyrightText: footerCopyrightText,
  });
  const [livePrivacyHref, setLivePrivacyHref] = useState(privacyHref);
  const [liveFaqHref, setLiveFaqHref] = useState(faqHref);
  const [liveTermsHref, setLiveTermsHref] = useState(termsHref);

  const onHeaderChange = useCallback((links: NavLink[]) => {
    setHeaderNav(links);
  }, []);

  const onFooterChange = useCallback((links: NavLink[]) => {
    setFooterNav(links);
  }, []);

  const onFooterContentChange = useCallback((content: FooterCmsContent) => {
    setFooterContent((prev) => ({ ...prev, ...content }));
  }, []);

  const sitePhone = footerContent.phone ?? footerPhone;

  return (
    <>
      <CmsNavigationLoader
        initialHeader={initialHeaderNav}
        initialFooter={initialFooterNav}
        onHeaderChange={onHeaderChange}
        onFooterChange={onFooterChange}
      />
      <CmsFooterLoader
        onFooterContentChange={onFooterContentChange}
        onPrivacyHrefChange={setLivePrivacyHref}
        onFaqHrefChange={setLiveFaqHref}
        onTermsHrefChange={setLiveTermsHref}
      />
      <Header navigation={headerNav} phone={sitePhone} />
      <main className="flex-1">{children}</main>
      <Footer
        footerLinks={footerNav}
        tagline={footerContent.tagline ?? footerTagline}
        address={footerContent.address ?? footerAddress}
        phone={sitePhone}
        email={footerContent.email ?? footerEmail}
        copyrightText={footerContent.copyrightText ?? footerCopyrightText}
        privacyHref={livePrivacyHref ?? privacyHref}
        faqHref={liveFaqHref ?? faqHref}
        termsHref={liveTermsHref ?? termsHref}
      />
    </>
  );
}
