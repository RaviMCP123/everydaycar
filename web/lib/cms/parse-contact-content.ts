export type ContactStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  infoPhone?: string;
  infoPhoneLabel?: string;
  infoEmail?: string;
  infoAddress?: string;
  infoHoursLine1?: string;
  infoHoursLine2?: string;
  formTitle?: string;
  formSubmitText?: string;
  mapOfficeLabel?: string;
  mapAddress?: string;
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

export function parseContactStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): ContactStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const content: ContactStructuredContent = {
    heroImage: localizedToString(raw.contactHeroImage).trim() || undefined,
    heroEyebrow: localizedToString(raw.contactHeroEyebrow).trim() || undefined,
    heroTitle: localizedToString(raw.contactHeroTitle).trim() || undefined,
    heroSubtitle: localizedToString(raw.contactHeroSubtitle).trim() || undefined,
    infoPhone: localizedToString(raw.contactInfoPhone).trim() || undefined,
    infoPhoneLabel:
      localizedToString(raw.contactInfoPhoneLabel).trim() || undefined,
    infoEmail: localizedToString(raw.contactInfoEmail).trim() || undefined,
    infoAddress: localizedToString(raw.contactInfoAddress).trim() || undefined,
    infoHoursLine1:
      localizedToString(raw.contactInfoHoursLine1).trim() || undefined,
    infoHoursLine2:
      localizedToString(raw.contactInfoHoursLine2).trim() || undefined,
    formTitle: localizedToString(raw.contactFormTitle).trim() || undefined,
    formSubmitText:
      localizedToString(raw.contactFormSubmitText).trim() || undefined,
    mapOfficeLabel:
      localizedToString(raw.contactMapOfficeLabel).trim() || undefined,
    mapAddress:
      localizedToString(raw.contactMapAddress).trim() || undefined,
  };

  const hasData =
    Boolean(content.heroTitle) ||
    Boolean(content.infoPhone) ||
    Boolean(content.infoEmail) ||
    Boolean(content.formTitle) ||
    Boolean(content.mapAddress);

  return hasData ? content : null;
}
