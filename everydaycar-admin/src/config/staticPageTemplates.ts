/**
 * Static page templates in the app (user-facing names / stored keys).
 * Stored in the database as `page.templateKey`.
 */
export const STATIC_PAGE_TEMPLATES = [
  { value: "home_template", label: "Home Template" },
  { value: "about_template", label: "About Page Template" },
  { value: "services_template", label: "Services Page Template" },
  // { value: "network_template", label: "Network Page Template" },
  { value: "our_network_template", label: "Our Network Page Template" },
  // { value: "repair_booking_template", label: "Repair Booking Template" },
  { value: "book_repair_template", label: "Book Repair Template" },
  { value: "find_a_repairer_template", label: "Find a Repairer Template" },
  { value: "contact_template", label: "Contact Page Template" },
  { value: "legal_page_template", label: "Legal Page Template" },
  { value: "faq_template", label: "FAQ Page Template" },
  // { value: "contactus_template", label: "Contact Us Template" },
  // { value: "page_template", label: "Generic Page Template" },
  // { value: "innerpage_template", label: "Inner Page Template" },
  // { value: "portfolio_template", label: "Portfolio" },
  { value: "footer_template", label: "Footer" },
] as const;

export type StaticPageTemplateKey = (typeof STATIC_PAGE_TEMPLATES)[number]["value"];

/** For SimpleTemplateEditor / getTemplateByKey: map to the built-in page template config. */
export const PAGE_LIKE_CANONICAL_KEYS: StaticPageTemplateKey[] = [
  "about_template",
  "services_template",
  // "network_template",
  "our_network_template",
  // "repair_booking_template",
  "book_repair_template",
  "find_a_repairer_template",
  "contact_template",
  "legal_page_template",
  "faq_template",
  // "page_template",
  // "portfolio_template",
];

const LEGACY_TO_FOUR: Record<string, string> = {
  home_template: "home_template",
  PAGE_TEMPLATE_V1: "page_template",
  INNER_PAGE_V1: "innerpage_template",
  HOMEPAGE_V1: "home_template",
  "contact-us": "contactus_template",
  "footer-template": "footer_template",
  faq: "faq_template",
  faqs: "faq_template",
  "terms-condition": "legal_page_template",
  "terms-and-conditions": "legal_page_template",
  "privacy-policy": "legal_page_template",
  "register-school": "page_template",
};

/**
 * When loading the form, use one of the static keys.
 * Maps old templateKey values. If the page was PAGE_TEMPLATE with
 * `category === "portfolio"`, it becomes `portfolio_template`.
 */
export function canonicalizeStaticTemplateKey(
  key: string | undefined,
  category?: string,
): string {
  const c = (category || "").toLowerCase();
  const k = (key || "").trim();

  if (
    k === "home_template" ||
    k === "about_template" ||
    k === "services_template" ||
    k === "network_template" ||
    k === "our_network_template" ||
    k === "repair_booking_template" ||
    k === "book_repair_template" ||
    k === "find_a_repairer_template" ||
    k === "contact_template" ||
    k === "legal_page_template" ||
    k === "faq_template" ||
    k === "page_template" ||
    k === "innerpage_template" ||
    k === "portfolio_template" ||
    k === "contactus_template" ||
    k === "footer_template"
  ) {
    if (k === "page_template" && c === "portfolio") return "portfolio_template";
    return k;
  }
  if (!k) {
    if (CATEGORY_TO_TEMPLATE_KEY[c]) return CATEGORY_TO_TEMPLATE_KEY[c];
    return "home_template";
  }
  if (k === "PAGE_TEMPLATE_V1" && c === "portfolio") {
    return "portfolio_template";
  }
  if (k === "PAGE_TEMPLATE_V1") {
    return "page_template";
  }
  if (k === "contact-us") return "contactus_template";
  if (k === "footer-template") return "footer_template";
  if (LEGACY_TO_FOUR[k]) {
    const m = LEGACY_TO_FOUR[k];
    if (m === "page_template" && c === "portfolio") return "portfolio_template";
    return m;
  }
  return c === "portfolio" ? "portfolio_template" : "home_template";
}

/** Banners + page sections + quad: Page / Portfolio, or legacy PAGE_TEMPLATE_V1 */
export function isPageWithSectionsTemplate(key: string | undefined): boolean {
  if (!key) return false;
  if (
    key === "about_template" ||
    key === "services_template" ||
    key === "network_template" ||
    key === "our_network_template" ||
    key === "repair_booking_template" ||
    key === "book_repair_template" ||
    key === "find_a_repairer_template" ||
    key === "contact_template" ||
    key === "legal_page_template" ||
    key === "faq_template" ||
    key === "page_template" ||
    key === "portfolio_template" ||
    key === "PAGE_TEMPLATE_V1"
  ) {
    return true;
  }
  return false;
}

export function isContactContentTemplate(key: string | undefined): boolean {
  if (!key) return false;
  return key === "contactus_template" || key === "contact-us";
}

export function isFooterContentTemplate(key: string | undefined): boolean {
  if (!key) return false;
  return key === "footer_template" || key === "footer-template";
}

export function isInnerPageContentTemplate(key: string | undefined): boolean {
  if (!key) return false;
  return key === "innerpage_template" || key === "INNER_PAGE_V1";
}

const CATEGORY_TO_TEMPLATE_KEY: Record<string, StaticPageTemplateKey> = {
  home: "home_template",
  about: "about_template",
  services: "services_template",
  // network: "network_template",
  "our-network": "our_network_template",
  // "repair-booking": "repair_booking_template",
  "book-repair": "book_repair_template",
  "find-a-repairer": "find_a_repairer_template",
  contact: "contact_template",
  // "contact-us": "contactus_template",
  "privacy-policy": "legal_page_template",
  "terms-and-conditions": "legal_page_template",
  "terms-condition": "legal_page_template",
  faq: "faq_template",
  faqs: "faq_template",
  footer: "footer_template",
};

export function getDefaultTemplateKeyForCategory(
  category?: string,
): StaticPageTemplateKey {
  const c = (category || "").trim().toLowerCase();
  if (CATEGORY_TO_TEMPLATE_KEY[c]) {
    return CATEGORY_TO_TEMPLATE_KEY[c];
  }
  return "home_template";
}
