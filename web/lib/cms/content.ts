import type { LocalizedField } from "@/lib/api/types";
import { resolveMediaUrl } from "@/lib/images";

const DEFAULT_LANG = "en";

/** Extract display text from API multilingual fields. */
export function getLocalizedText(
  field: LocalizedField | undefined | null,
  lang = DEFAULT_LANG,
): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return (
      field[lang] ??
      field[DEFAULT_LANG] ??
      Object.values(field).find((v) => typeof v === "string" && v.trim()) ??
      ""
    );
  }
  return String(field);
}

/** Strip HTML tags for plain-text excerpts (meta, hero subtitles). */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getPublicBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return raw.replace(/\/$/, "");
}

/** Rewrite CMS links/images from other hosts to this site's base path. */
function rewriteSiteUrls(html: string): string {
  const basePath = getPublicBasePath();
  let out = html;

  const legacyOrigins = [
    "https://web.cloudpulsetech.in/everydaycar",
    "http://web.cloudpulsetech.in/everydaycar",
    "https://web.cloudpulsetech.in",
  ];

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  if (siteUrl) {
    legacyOrigins.push(siteUrl);
  }

  for (const origin of legacyOrigins) {
    out = out.replace(new RegExp(escapeRegExp(origin), "gi"), basePath);
  }

  out = out.replace(/\/everydaycar\/images\//gi, `${basePath}/images/`);
  out = out.replace(/\/everydaycar\//gi, `${basePath}/`);

  return out;
}

/** CKEditor paste often adds zero margins/padding that override section spacing. */
function stripBlockingZeroSpacing(styles: string): string {
  return styles
    .replace(/(?:^|;)\s*padding:\s*0(?:px)?(?=\s*;|\s*$)/gi, "")
    .replace(/(?:^|;)\s*margin:\s*0(?:px)?(?=\s*;|\s*$)/gi, "")
    .replace(/(?:^|;)\s*margin-top:\s*0(?:px)?(?=\s*;|\s*$)/gi, "")
    .replace(/(?:^|;)\s*margin-bottom:\s*0(?:px)?(?=\s*;|\s*$)/gi, "")
    .replace(/(?:^|;)\s*margin-block:\s*[^;]+(?=\s*;|\s*$)/gi, "")
    .replace(/(?:^|;)\s*padding-top:\s*0(?:px)?(?=\s*;|\s*$)/gi, "")
    .replace(/(?:^|;)\s*padding-bottom:\s*0(?:px)?(?=\s*;|\s*$)/gi, "")
    .replace(/;\s*;/g, ";")
    .replace(/^;|;$/g, "")
    .trim();
}

function sanitizeCmsInlineStyles(html: string): string {
  let out = html.replace(/\sstyle="([^"]*)"/gi, (_match, styles: string) => {
    const cleaned = stripBlockingZeroSpacing(styles);
    return cleaned ? ` style="${cleaned}"` : "";
  });

  // Pasted lists often ship per-item margins that stack with layout CSS.
  out = out.replace(/<(ul|li)\b([^>]*)\sstyle="[^"]*"/gi, "<$1$2");
  // Section headings paste global .section-title size (44px) over legal clamp.
  out = out.replace(/<(h2)\b([^>]*)\sstyle="[^"]*"/gi, "<$1$2");

  return out;
}

/** Rewrite upload URLs in CMS HTML so images load from the API host. */
export function normalizeCmsHtml(html: string): string {
  if (!html) return "";

  let out = rewriteSiteUrls(html);

  out = out.replace(/viewbox=/gi, "viewBox=");

  out = out.replace(
    /(<(?:img|a)[^>]+(?:src|href)=["'])([^"']+)(["'])/gi,
    (_match, prefix, url, suffix) => {
      const resolved = resolveMediaUrl(url);
      return `${prefix}${resolved}${suffix}`;
    },
  );

  out = sanitizeCmsInlineStyles(out);

  return out;
}
