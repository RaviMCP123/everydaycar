import { cmsHrefToPath } from "@/lib/cms/parse-home-content";

export type FindRepairerStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroSubtitle?: string;
  searchPlaceholder?: string;
  searchButtonText?: string;
  resultsTitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  phoneNumber?: string;
  callButtonText?: string;
  bookButtonText?: string;
  bookButtonLink?: string;
};

function localizedToString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const v = (value as Record<string, unknown>).en;
    if (typeof v === "string") return v;
    const first = Object.values(value as Record<string, unknown>).find(
      (entry) => typeof entry === "string",
    );
    return typeof first === "string" ? first : "";
  }
  return "";
}

export function parseFindRepairerStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): FindRepairerStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const bookLink = localizedToString(raw.findRepairerBookButtonLink).trim();

  const content: FindRepairerStructuredContent = {
    heroImage:
      localizedToString(raw.findRepairerHeroImage).trim() || undefined,
    heroEyebrow:
      localizedToString(raw.findRepairerHeroEyebrow).trim() || undefined,
    heroTitleLine1:
      localizedToString(raw.findRepairerHeroTitleLine1).trim() || undefined,
    heroTitleLine2:
      localizedToString(raw.findRepairerHeroTitleLine2).trim() || undefined,
    heroSubtitle:
      localizedToString(raw.findRepairerHeroSubtitle).trim() || undefined,
    searchPlaceholder:
      localizedToString(raw.findRepairerSearchPlaceholder).trim() || undefined,
    searchButtonText:
      localizedToString(raw.findRepairerSearchButtonText).trim() || undefined,
    resultsTitle:
      localizedToString(raw.findRepairerResultsTitle).trim() || undefined,
    ctaTitle:
      localizedToString(raw.findRepairerCtaTitle).trim() || undefined,
    ctaDescription:
      localizedToString(raw.findRepairerCtaDescription).trim() || undefined,
    phoneNumber:
      localizedToString(raw.findRepairerPhoneNumber).trim() || undefined,
    callButtonText:
      localizedToString(raw.findRepairerCallButtonText).trim() || undefined,
    bookButtonText:
      localizedToString(raw.findRepairerBookButtonText).trim() || undefined,
    bookButtonLink: bookLink ? cmsHrefToPath(bookLink) : undefined,
  };

  const hasData = Object.values(content).some(
    (value) => typeof value === "string" && value.length > 0,
  );

  return hasData ? content : null;
}
