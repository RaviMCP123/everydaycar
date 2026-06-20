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

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const EMAIL_GLOBAL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_GLOBAL_PATTERN =
  /(?:\+?61[\s()-]*)?(?:\(?0\)?[\s-]*)?(?:(?:1300|1800|13\d{2})[\s-]?\d{3}[\s-]?\d{3}|0[2-578]\d(?:[\s-]?\d{4}){2}|0?4\d{2}[\s-]?\d{3}[\s-]?\d{3})/g;

function toTelHref(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }
  if (digits.startsWith("61")) {
    return `tel:+${digits}`;
  }
  return `tel:${digits}`;
}

function isEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

function isPhoneLike(value: string): boolean {
  const trimmed = value.trim();
  const digits = trimmed.replace(/[^\d+]/g, "");
  return digits.length >= 8 && /^[\d+\s()/-]+$/.test(trimmed);
}

function cleanupContactAnchorOpenTag(tag: string): string {
  let cleaned = tag.replace(/\sstyle="[^"]*"/gi, "");
  if (/class="/i.test(cleaned)) {
    cleaned = cleaned.replace(/class="([^"]*)"/i, (_match, classNames: string) => {
      const merged = classNames.includes("cms-contact-link")
        ? classNames
        : `${classNames} cms-contact-link`.trim();
      return `class="${merged}"`;
    });
  } else {
    cleaned = cleaned.replace("<a", '<a class="cms-contact-link"');
  }
  return cleaned;
}

function fixContactAnchorHrefs(html: string): string {
  return html.replace(
    /<a\b([^>]*?)href=["']([^"']+)["']([^>]*)>/gi,
    (match, before, href, after) => {
      let trimmed = href.trim();
      if (/^https?:\/\/([^/]+@[^/]+)$/i.test(trimmed)) {
        trimmed = trimmed.replace(/^https?:\/\//i, "");
      }

      let nextHref = trimmed;
      if (!/^(?:mailto:|tel:|https?:|#|\/)/i.test(trimmed)) {
        if (isEmailAddress(trimmed)) {
          nextHref = `mailto:${trimmed}`;
        } else if (isPhoneLike(trimmed)) {
          nextHref = toTelHref(trimmed);
        } else {
          return match;
        }
      }

      if (nextHref.startsWith("mailto:") || nextHref.startsWith("tel:")) {
        const attrs = `${before}${after}`.replace(/\sstyle="[^"]*"/gi, "");
        return cleanupContactAnchorOpenTag(`<a${attrs}href="${nextHref}">`);
      }

      return match;
    },
  );
}

function autolinkPlainText(text: string): string {
  const placeholders: string[] = [];
  let out = text;

  out = out.replace(EMAIL_GLOBAL_PATTERN, (email) => {
    const idx = placeholders.length;
    placeholders.push(
      `<a href="mailto:${email}" class="cms-contact-link font-semibold">${email}</a>`,
    );
    return `__LINK_${idx}__`;
  });

  out = out.replace(PHONE_GLOBAL_PATTERN, (phone) => {
    const trimmed = phone.trim();
    if (trimmed.length < 8) return phone;
    const idx = placeholders.length;
    placeholders.push(
      `<a href="${toTelHref(trimmed)}" class="cms-contact-link font-semibold">${trimmed}</a>`,
    );
    return `__LINK_${idx}__`;
  });

  return out.replace(/__LINK_(\d+)__/g, (_, index) => placeholders[Number(index)] ?? "");
}

export function linkifyContactInfoInHtml(html: string): string {
  if (!html) return "";
  const withFixedAnchors = fixContactAnchorHrefs(html);
  return linkifyTextOutsideAnchors(withFixedAnchors);
}

function linkifyTextOutsideAnchors(html: string): string {
  const anchors: string[] = [];
  let out = html.replace(/<a\b[\s\S]*?<\/a>/gi, (anchor) => {
    const idx = anchors.length;
    anchors.push(anchor);
    return `__ANCHOR_${idx}__`;
  });

  let prev = "";
  let passes = 0;
  while (out !== prev && passes < 12) {
    prev = out;
    out = out.replace(/>([^<]+)</g, (_match, text: string) => {
      const linked = autolinkPlainText(text);
      return linked === text ? _match : `>${linked}<`;
    });
    passes += 1;
  }

  return out.replace(/__ANCHOR_(\d+)__/g, (_, index) => anchors[Number(index)] ?? "");
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
  out = linkifyContactInfoInHtml(out);

  return out;
}
