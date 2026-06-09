export type ServicesCardContent = {
  number: string;
  title: string;
  description: string;
  image?: string;
  bullets: string[];
};

export type ServicesStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  listTitle?: string;
  cards: ServicesCardContent[];
  ctaTitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
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

export function parseServicesStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): ServicesStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const cards = [1, 2, 3]
    .map((i) => {
      const title = localizedToString(raw[`servicesCard${i}Title`]).trim();
      const description = localizedToString(
        raw[`servicesCard${i}Description`],
      ).trim();
      if (!title || !description) return null;

      const bullets = [1, 2, 3, 4]
        .map((b) => localizedToString(raw[`servicesCard${i}Bullet${b}`]).trim())
        .filter(Boolean);

      return {
        number:
          localizedToString(raw[`servicesCard${i}Number`]).trim() ||
          String(i).padStart(2, "0"),
        title,
        description,
        image: localizedToString(raw[`servicesCard${i}Image`]).trim() || undefined,
        bullets,
      };
    })
    .filter(Boolean) as ServicesCardContent[];

  const content: ServicesStructuredContent = {
    heroImage: localizedToString(raw.servicesHeroImage).trim() || undefined,
    heroEyebrow: localizedToString(raw.servicesHeroEyebrow).trim() || undefined,
    heroTitle: localizedToString(raw.servicesHeroTitle).trim() || undefined,
    heroSubtitle: localizedToString(raw.servicesHeroSubtitle).trim() || undefined,
    listTitle: localizedToString(raw.servicesListTitle).trim() || undefined,
    cards,
    ctaTitle: localizedToString(raw.servicesCtaTitle).trim() || undefined,
    ctaButtonText:
      localizedToString(raw.servicesCtaButtonText).trim() || undefined,
    ctaButtonLink:
      localizedToString(raw.servicesCtaButtonLink).trim() || undefined,
  };

  const hasData =
    Boolean(content.heroTitle) || Boolean(content.listTitle) || cards.length > 0;

  return hasData ? content : null;
}
