import type { Metadata } from "next";
import { SiteChrome } from "@/src/components/layout/SiteChrome";
import { fetchSiteNavigation } from "@/lib/cms/navigation";
import { getPageBySlug } from "@/lib/api/pages";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";
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

  let footerTagline: string | undefined;
  let footerAddress: string | undefined;
  let footerPhone = "1300721840";
  let footerGetInTouchTitle = "Get In Touch";
  let footerCopyrightText:
    | string
    | undefined = "(c) 2026 Everyday Car Repair Network Pty Ltd | everydaycar.com.au | ABN 68 634 541 058";
  let privacyHref = "/contact";
  let termsHref = "/terms-and-conditions";

  try {
    const footerPage = await getPageBySlug(PAGE_SLUGS.footer);
    if (footerPage) {
      const content =
        footerPage.content && typeof footerPage.content === "object"
          ? (footerPage.content as Record<string, unknown>)
          : null;

      const localizedFromContent = (key: string): string => {
        if (!content) return "";
        const value = content[key];
        if (typeof value === "string") return value.trim();
        if (value && typeof value === "object" && !Array.isArray(value)) {
          return getLocalizedText(value as Record<string, string>).trim();
        }
        return "";
      };

      const desc =
        localizedFromContent("footerTagline") ||
        getLocalizedText(footerPage.footerDescription ?? footerPage.description);
      if (desc) {
        footerTagline = htmlToPlainText(desc);
      }

      const addressText =
        localizedFromContent("footerAddress") ||
        getLocalizedText(footerPage.address || "").trim();
      if (addressText) footerAddress = htmlToPlainText(addressText);

      const phoneText =
        localizedFromContent("footerPhone") || footerPage.phone || "";
      if (phoneText) footerPhone = phoneText;

      const getInTouchText =
        localizedFromContent("footerGetInTouchTitle") || "";
      if (getInTouchText) footerGetInTouchTitle = getInTouchText;

      const copyrightText =
        localizedFromContent("footerCopyright") ||
        getLocalizedText(footerPage.copyrightText || "").trim();
      if (copyrightText) footerCopyrightText = htmlToPlainText(copyrightText);
    }
    const privacyPage = await getPageBySlug(PAGE_SLUGS.privacy);
    if (privacyPage?.slug) {
      privacyHref = categorySlugToHref(privacyPage.slug);
    }
    const termsPage = await getPageBySlug(PAGE_SLUGS.terms);
    if (termsPage?.slug) {
      termsHref = categorySlugToHref(termsPage.slug);
    }
  } catch {
    /* use defaults */
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
          footerTagline={footerTagline}
          footerAddress={footerAddress}
          footerPhone={footerPhone}
          footerGetInTouchTitle={footerGetInTouchTitle}
          footerCopyrightText={footerCopyrightText}
          privacyHref={privacyHref}
          termsHref={termsHref}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
