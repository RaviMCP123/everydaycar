import { htmlToPlainText } from "@/lib/cms/content";
import { isUploadedCmsMedia } from "@/lib/cms/cms-uploaded-media";

export type HomeJoinCtaContent = {
  iconSrc?: string;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export type HomeStructuredContent = {
  heroImage?: string;
  heroKicker?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroSubtitle?: string;
  heroPrimaryButtonText?: string;
  heroPrimaryButtonLink?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonLink?: string;
  heroBadgeImages?: string[];
  trustBarTitle?: string;
  trustItems?: Array<{ image: string; label: string }>;
  valueKicker?: string;
  valueTitle?: string;
  valueDescription?: string;
  joinIcon?: string;
  joinTitle?: string;
  joinSubtitle?: string;
  joinButtonText?: string;
  joinButtonLink?: string;
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

/** Convert `page.content` from admin home template into typed web props. */
export function parseHomeStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): HomeStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const trustItems = [1, 2, 3, 4]
    .map((i) => {
      const label = localizedToString(raw[`trustItem${i}Label`]).trim();
      const icon = localizedToString(raw[`trustItem${i}Icon`]).trim();
      if (!label || !isUploadedCmsMedia(icon)) return null;
      return { label, image: icon };
    })
    .filter(Boolean) as Array<{ label: string; image: string }>;

  const heroBadgeImages = [1, 2, 3, 4]
    .map((i) => localizedToString(raw[`heroBadge${i}Image`]).trim())
    .filter(isUploadedCmsMedia);

  const heroImageRaw = localizedToString(raw.heroImage).trim();
  const joinIconRaw = localizedToString(raw.joinIcon).trim();

  const content: HomeStructuredContent = {
    heroImage: isUploadedCmsMedia(heroImageRaw) ? heroImageRaw : undefined,
    heroKicker: localizedToString(raw.heroKicker).trim() || undefined,
    heroTitleLine1: localizedToString(raw.heroTitleLine1).trim() || undefined,
    heroTitleLine2: localizedToString(raw.heroTitleLine2).trim() || undefined,
    heroSubtitle: localizedToString(raw.heroSubtitle).trim() || undefined,
    heroPrimaryButtonText:
      localizedToString(raw.heroPrimaryButtonText).trim() || undefined,
    heroPrimaryButtonLink:
      localizedToString(raw.heroPrimaryButtonLink).trim() || undefined,
    heroSecondaryButtonText:
      localizedToString(raw.heroSecondaryButtonText).trim() || undefined,
    heroSecondaryButtonLink:
      localizedToString(raw.heroSecondaryButtonLink).trim() || undefined,
    heroBadgeImages: heroBadgeImages.length > 0 ? heroBadgeImages : undefined,
    trustBarTitle: localizedToString(raw.trustBarTitle).trim() || undefined,
    trustItems,
    valueKicker: localizedToString(raw.valueKicker).trim() || undefined,
    valueTitle: localizedToString(raw.valueTitle).trim() || undefined,
    valueDescription: localizedToString(raw.valueDescription).trim() || undefined,
    joinIcon: isUploadedCmsMedia(joinIconRaw) ? joinIconRaw : undefined,
    joinTitle: localizedToString(raw.joinTitle).trim() || undefined,
    joinSubtitle: localizedToString(raw.joinSubtitle).trim() || undefined,
    joinButtonText: localizedToString(raw.joinButtonText).trim() || undefined,
    joinButtonLink: localizedToString(raw.joinButtonLink).trim() || undefined,
  };

  const hasData =
    Boolean(content.heroKicker) ||
    Boolean(content.heroTitleLine1) ||
    Boolean(content.valueTitle) ||
    trustItems.length > 0 ||
    Boolean(content.joinTitle);

  return hasData ? content : null;
}

export function isHomePageTemplate(templateKey?: string): boolean {
  const key = (templateKey || "").trim().toLowerCase();
  return (
    key === "home_template" ||
    key === "homepage_v1" ||
    key === "home_template_v1"
  );
}

function getPublicBasePath(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return raw.replace(/\/$/, "");
}

/** Turn CMS absolute URLs into internal app paths (respects basePath). */
export function cmsHrefToPath(href: string): string {
  if (!href?.trim()) return "/contact/";

  let path = href.trim();
  const basePath = getPublicBasePath();

  const stripOrigins = [
    "https://web.cloudpulsetech.in/everydaycar",
    "http://web.cloudpulsetech.in/everydaycar",
    "https://web.cloudpulsetech.in",
    (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, ""),
  ].filter(Boolean);

  for (const origin of stripOrigins) {
    if (path.toLowerCase().startsWith(origin.toLowerCase())) {
      path = path.slice(origin.length);
      break;
    }
  }

  path = path.replace(/^\/everydaycar\//i, `${basePath}/`);

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "/contact/";
    }
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || "/";
  }

  if (!path.endsWith("/")) {
    path += "/";
  }

  return path;
}

/** Read #book section copy from CMS home HTML (admin editor). */
export function parseHomeJoinCta(html: string): HomeJoinCtaContent | null {
  if (!html?.trim()) return null;

  const sectionMatch = html.match(
    /<section[^>]*\bid=["']book["'][^>]*>([\s\S]*?)<\/section>/i,
  );
  if (!sectionMatch) return null;

  const section = sectionMatch[1];

  const titleMatch =
    section.match(
      /<p[^>]*class="[^"]*text-\[20px\][^"]*"[^>]*>([\s\S]*?)<\/p>/i,
    ) ?? section.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

  const subtitleMatch = section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);

  const buttonMatch =
    section.match(
      /<a[^>]*class="[^"]*btn-primary[^"]*"[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i,
    ) ??
    section.match(
      /<a[^>]*href=["']([^"']+)["'][^>]*class="[^"]*btn-primary[^"]*"[^>]*>([\s\S]*?)<\/a>/i,
    );

  const result: HomeJoinCtaContent = {};

  if (titleMatch?.[1]) {
    result.title = htmlToPlainText(titleMatch[1]);
  }
  if (subtitleMatch?.[1]) {
    result.subtitle = htmlToPlainText(subtitleMatch[1]);
  }
  if (buttonMatch?.[2]) {
    result.buttonLabel = htmlToPlainText(buttonMatch[2]);
  }
  if (buttonMatch?.[1]) {
    result.buttonHref = cmsHrefToPath(buttonMatch[1]);
  }

  return Object.keys(result).length > 0 ? result : null;
}
