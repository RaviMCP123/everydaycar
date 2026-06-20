export type AboutWhoItem = {
  icon?: string;
  title?: string;
  text: string;
};

export type AboutCompanyFactsItem = {
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
  notDoTitle?: string;
  notDoText?: string;
  servedIntro?: string;
  companyFactsTitle?: string;
  companyFactsImage?: string;
  companyFactsItems: AboutCompanyFactsItem[];
  joinTitle?: string;
  joinDescription?: string;
  joinButtonText?: string;
  joinButtonLink?: string;
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

function parseLegacyWhoItems(raw: Record<string, unknown>): AboutWhoItem[] {
  const items: AboutWhoItem[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const text = localizedToString(raw[`aboutWhoItem${i}Text`]).trim();
    if (!text) continue;
    items.push({
      icon:
        localizedToString(raw[`aboutWhoItem${i}Icon`]).trim() || undefined,
      title:
        localizedToString(raw[`aboutWhoItem${i}Title`]).trim() || undefined,
      text,
    });
  }

  return items;
}

function parseWhoItems(raw: Record<string, unknown>): AboutWhoItem[] {
  if (Array.isArray(raw.aboutWhoItems)) {
    return raw.aboutWhoItems
      .map((entry) => {
        const item =
          entry && typeof entry === "object"
            ? (entry as Record<string, unknown>)
            : null;
        if (!item) return null;

        const text = localizedToString(item.text).trim();
        if (!text) return null;

        return {
          icon: localizedToString(item.icon).trim() || undefined,
          title: localizedToString(item.title).trim() || undefined,
          text,
        };
      })
      .filter(Boolean) as AboutWhoItem[];
  }

  return parseLegacyWhoItems(raw);
}

function parseCompanyFactsItems(raw: Record<string, unknown>): AboutCompanyFactsItem[] {
  if (!Array.isArray(raw.aboutCompanyFactsItems)) {
    return [];
  }

  return raw.aboutCompanyFactsItems
    .map((entry) => {
      const item =
        entry && typeof entry === "object"
          ? (entry as Record<string, unknown>)
          : null;
      if (!item) return null;

      const text = localizedToString(item.text).trim();
      if (!text) return null;

      return {
        icon: localizedToString(item.icon).trim() || undefined,
        title: localizedToString(item.title).trim() || undefined,
        text,
      };
    })
    .filter(Boolean) as AboutCompanyFactsItem[];
}

/** Convert About template `page.content` into typed props for web components. */
export function parseAboutStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): AboutStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const whoItems = parseWhoItems(raw);
  const companyFactsItems = parseCompanyFactsItems(raw);

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
    notDoTitle: localizedToString(raw.aboutNotDoTitle).trim() || undefined,
    notDoText: localizedToString(raw.aboutNotDoText).trim() || undefined,
    servedIntro: localizedToString(raw.aboutServedIntro).trim() || undefined,
    companyFactsTitle:
      localizedToString(raw.aboutCompanyFactsTitle).trim() || undefined,
    companyFactsImage:
      localizedToString(raw.aboutCompanyFactsImage).trim() || undefined,
    companyFactsItems,
    joinTitle: localizedToString(raw.aboutJoinTitle).trim() || undefined,
    joinDescription:
      localizedToString(raw.aboutJoinDescription).trim() || undefined,
    joinButtonText:
      localizedToString(raw.aboutJoinButtonText).trim() || undefined,
    joinButtonLink:
      localizedToString(raw.aboutJoinButtonLink).trim() || undefined,
    whyTitle: localizedToString(raw.aboutWhyTitle).trim() || undefined,
    whyCards,
  };

  const hasData =
    Boolean(content.heroTitle) ||
    Boolean(content.whoTitle) ||
    Boolean(content.notDoTitle) ||
    Boolean(content.notDoText) ||
    Boolean(content.servedIntro) ||
    Boolean(content.companyFactsTitle) ||
    Boolean(content.joinTitle) ||
    Boolean(content.joinDescription) ||
    Boolean(content.whyTitle) ||
    whoItems.length > 0 ||
    companyFactsItems.length > 0 ||
    whyCards.length > 0;

  return hasData ? content : null;
}
