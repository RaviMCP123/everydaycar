export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  listTitle?: string;
  items: FaqItem[];
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

function parseFaqItems(raw: Record<string, unknown>): FaqItem[] {
  if (!Array.isArray(raw.faqItems)) {
    return [];
  }

  return raw.faqItems
    .map((entry) => {
      const item =
        entry && typeof entry === "object"
          ? (entry as Record<string, unknown>)
          : null;
      if (!item) return null;

      const question = localizedToString(item.question).trim();
      const answer = localizedToString(item.answer).trim();
      if (!question && !answer) return null;

      return { question, answer };
    })
    .filter(Boolean) as FaqItem[];
}

export function parseFaqStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): FaqStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const items = parseFaqItems(raw);

  const content: FaqStructuredContent = {
    heroImage: localizedToString(raw.faqHeroImage).trim() || undefined,
    heroEyebrow: localizedToString(raw.faqHeroEyebrow).trim() || undefined,
    heroTitle: localizedToString(raw.faqHeroTitle).trim() || undefined,
    heroSubtitle: localizedToString(raw.faqHeroSubtitle).trim() || undefined,
    listTitle: localizedToString(raw.faqListTitle).trim() || undefined,
    items,
  };

  const hasData =
    Boolean(content.heroTitle) ||
    Boolean(content.heroSubtitle) ||
    Boolean(content.listTitle) ||
    items.length > 0;

  return hasData ? content : null;
}

export function isFaqPageTemplate(templateKey?: string): boolean {
  const key = (templateKey || "").trim().toLowerCase();
  return key === "faq_template" || key === "faq_template_v1";
}
