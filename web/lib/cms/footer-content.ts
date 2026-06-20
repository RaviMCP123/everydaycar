import type { PageDetail } from "@/lib/api/types";
import { getLocalizedText, htmlToPlainText } from "@/lib/cms/content";

export type FooterCmsContent = {
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  copyrightText?: string;
};

function localizedFromContent(
  content: Record<string, unknown> | null,
  key: string,
): string {
  if (!content) return "";
  const value = content[key];
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return getLocalizedText(value as Record<string, string>).trim();
  }
  return "";
}

export function parseFooterCmsContent(
  footerPage: PageDetail | null,
): FooterCmsContent {
  if (!footerPage) return {};

  const content =
    footerPage.content && typeof footerPage.content === "object"
      ? (footerPage.content as Record<string, unknown>)
      : null;

  const result: FooterCmsContent = {};

  const tagline =
    localizedFromContent(content, "footerTagline") ||
    getLocalizedText(footerPage.footerDescription ?? footerPage.description);
  if (tagline) result.tagline = htmlToPlainText(tagline);

  const addressText =
    localizedFromContent(content, "footerAddress") ||
    getLocalizedText(footerPage.address || "").trim();
  if (addressText) result.address = htmlToPlainText(addressText);

  const phoneText =
    localizedFromContent(content, "footerPhone") || footerPage.phone || "";
  if (phoneText) result.phone = phoneText;

  const emailText =
    localizedFromContent(content, "footerEmail") || footerPage.email || "";
  if (emailText) result.email = emailText;

  const copyrightText =
    localizedFromContent(content, "footerCopyright") ||
    getLocalizedText(footerPage.copyrightText || "").trim();
  if (copyrightText) result.copyrightText = htmlToPlainText(copyrightText);

  return result;
}
