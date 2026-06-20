import type { Metadata } from "next";
import { SiteChrome } from "@/src/components/layout/SiteChrome";
import { fetchSiteNavigation } from "@/lib/cms/navigation";
import { getPageBySlug } from "@/lib/api/pages";
import {
  parseFooterCmsContent,
  type FooterCmsContent,
} from "@/lib/cms/footer-content";
import { PAGE_SLUGS, categorySlugToHref } from "@/lib/cms/routes";
import "./globals.scss";
import { poppins } from "@/lib/fonts";
import { imagePath } from "@/src/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "everydaycar Repair Network",
  description:
    "Australia's trusted accident repair network connecting drivers with approved repairers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await fetchSiteNavigation();

  let footerContent: FooterCmsContent = {};
  let privacyHref = "/privacy-policy";
  let faqHref = "/faqs";
  let termsHref = "/terms-and-conditions";

  try {
    const footerPage = await getPageBySlug(PAGE_SLUGS.footer);
    footerContent = parseFooterCmsContent(footerPage);
    const privacyPage = await getPageBySlug(PAGE_SLUGS.privacy);
    if (privacyPage?.slug) {
      privacyHref = categorySlugToHref(privacyPage.slug);
    }
    const faqPage = await getPageBySlug(PAGE_SLUGS.faq);
    if (faqPage?.slug) {
      faqHref = categorySlugToHref(faqPage.slug);
    }
    const termsPage = await getPageBySlug(PAGE_SLUGS.terms);
    if (termsPage?.slug) {
      termsHref = categorySlugToHref(termsPage.slug);
    }
  } catch {
    /* footer content loads client-side via CmsFooterLoader when API is unavailable */
  }

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${poppins.className} h-full font-sans antialiased`}
      style={
        {
          "--cms-home-hero-image": `url('${imagePath("/images/home-hero.png")}')`,
        } as React.CSSProperties
      }
    >
      <body className="flex min-h-full flex-col font-sans" data-base-path={basePath || undefined}>
        <SiteChrome
          headerNav={navigation.header}
          footerNav={navigation.footer}
          footerTagline={footerContent.tagline}
          footerAddress={footerContent.address}
          footerPhone={footerContent.phone}
          footerEmail={footerContent.email}
          footerCopyrightText={footerContent.copyrightText}
          privacyHref={privacyHref}
          faqHref={faqHref}
          termsHref={termsHref}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
