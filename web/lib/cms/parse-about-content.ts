export type AboutWhoItem = {
  icon?: string;
  title?: string;
  text: string;
};

export type AboutWhyCard = {
  icon?: string;
  title: string;
  text: string;
};

export type AboutStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  whoTitle?: string;
  whoImage?: string;
  whoItems: AboutWhoItem[];
  whyTitle?: string;
  whyCards: AboutWhyCard[];
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

/** Convert About template `page.content` into typed props for web components. */
export function parseAboutStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): AboutStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const whoItems = [1, 2, 3]
    .map((i) => {
      const text = localizedToString(raw[`aboutWhoItem${i}Text`]).trim();
      if (!text) return null;
      return {
        icon: localizedToString(raw[`aboutWhoItem${i}Icon`]).trim() || undefined,
        title:
          localizedToString(raw[`aboutWhoItem${i}Title`]).trim() || undefined,
        text,
      };
    })
    .filter(Boolean) as AboutWhoItem[];

  const whyCards = [1, 2, 3, 4]
    .map((i) => {
      const title = localizedToString(raw[`aboutWhyCard${i}Title`]).trim();
      const text = localizedToString(raw[`aboutWhyCard${i}Text`]).trim();
      if (!title || !text) return null;
      return {
        icon: localizedToString(raw[`aboutWhyCard${i}Icon`]).trim() || undefined,
        title,
        text,
      };
    })
    .filter(Boolean) as AboutWhyCard[];

  const content: AboutStructuredContent = {
    heroImage: localizedToString(raw.aboutHeroImage).trim() || undefined,
    heroEyebrow: localizedToString(raw.aboutHeroEyebrow).trim() || undefined,
    heroTitle: localizedToString(raw.aboutHeroTitle).trim() || undefined,
    heroSubtitle: localizedToString(raw.aboutHeroSubtitle).trim() || undefined,
    whoTitle: localizedToString(raw.aboutWhoTitle).trim() || undefined,
    whoImage: localizedToString(raw.aboutWhoImage).trim() || undefined,
    whoItems,
    whyTitle: localizedToString(raw.aboutWhyTitle).trim() || undefined,
    whyCards,
  };

  const hasData =
    Boolean(content.heroTitle) ||
    Boolean(content.whoTitle) ||
    Boolean(content.whyTitle) ||
    whoItems.length > 0 ||
    whyCards.length > 0;

  return hasData ? content : null;
}
