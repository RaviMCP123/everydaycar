export type BookRepairStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroSubtitle?: string;
  heroBenefits: string[];
  whyUseTitle?: string;
  whyUseBenefits: string[];
  preferCallText?: string;
  phoneNumber?: string;
  callButtonText?: string;
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

export function parseBookRepairStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): BookRepairStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const heroBenefits = [1, 2, 3, 4]
    .map((i) => localizedToString(raw[`bookRepairBenefit${i}`]).trim())
    .filter(Boolean);

  const whyUseBenefits = [1, 2, 3, 4, 5]
    .map((i) => localizedToString(raw[`bookRepairWhyUseBenefit${i}`]).trim())
    .filter(Boolean);

  const content: BookRepairStructuredContent = {
    heroImage: localizedToString(raw.bookRepairHeroImage).trim() || undefined,
    heroEyebrow: localizedToString(raw.bookRepairHeroEyebrow).trim() || undefined,
    heroTitleLine1:
      localizedToString(raw.bookRepairHeroTitleLine1).trim() || undefined,
    heroTitleLine2:
      localizedToString(raw.bookRepairHeroTitleLine2).trim() || undefined,
    heroSubtitle: localizedToString(raw.bookRepairHeroSubtitle).trim() || undefined,
    heroBenefits,
    whyUseTitle: localizedToString(raw.bookRepairWhyUseTitle).trim() || undefined,
    whyUseBenefits,
    preferCallText:
      localizedToString(raw.bookRepairPreferCallText).trim() || undefined,
    phoneNumber: localizedToString(raw.bookRepairPhoneNumber).trim() || undefined,
    callButtonText:
      localizedToString(raw.bookRepairCallButtonText).trim() || undefined,
  };

  const hasData =
    Boolean(content.heroTitleLine1) ||
    Boolean(content.heroSubtitle) ||
    content.heroBenefits.length > 0 ||
    Boolean(content.whyUseTitle);

  return hasData ? content : null;
}
