export type LegalStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  description?: string;
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

export function parseLegalStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): LegalStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const content: LegalStructuredContent = {
    heroImage: localizedToString(raw.legalHeroImage).trim() || undefined,
    heroEyebrow: localizedToString(raw.legalHeroEyebrow).trim() || undefined,
    heroTitle: localizedToString(raw.legalHeroTitle).trim() || undefined,
    heroDescription:
      localizedToString(raw.legalHeroDescription).trim() || undefined,
    description: localizedToString(raw.legalDescription).trim() || undefined,
  };

  const hasData =
    Boolean(content.heroTitle) ||
    Boolean(content.heroDescription) ||
    Boolean(content.description);

  return hasData ? content : null;
}

export function isLegalPageTemplate(templateKey?: string): boolean {
  const key = (templateKey || "").trim().toLowerCase();
  return key === "legal_page_template" || key === "legal_page_template_v1";
}

import { normalizeCmsHtml } from "./content";

function stripLegalInlineStyles(html: string): string {
  return html
    .replace(/<(section|div|p)\b([^>]*)\sstyle="[^"]*"/gi, "<$1$2")
    .replace(/<(ul|li)\b([^>]*)\sstyle="[^"]*"/gi, "<$1$2");
}

/** Strip pasted page shells so privacy + terms share one layout wrapper. */
export function extractLegalBodyHtml(html: string): string {
  let out = html.trim();
  if (!out) return "";

  for (let i = 0; i < 3; i++) {
    const mainMatch = out.match(/^<main\b[^>]*>([\s\S]*)<\/main>$/i);
    if (!mainMatch) break;
    out = mainMatch[1].trim();
  }

  const containerMatch = out.match(
    /^<div\b[^>]*class="[^"]*\bcontainer\b[^"]*"[^>]*>([\s\S]*)<\/div>$/i,
  );
  if (containerMatch) {
    out = containerMatch[1].trim();
  }

  return out;
}

export function prepareLegalBodyHtml(html: string): string {
  const body = extractLegalBodyHtml(html);
  if (!body) return "";
  return stripLegalInlineStyles(normalizeCmsHtml(body));
}
