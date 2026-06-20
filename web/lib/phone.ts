/** Digits-only phone string for tel: links. */
export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
}

/** Build a tel: href from a display phone number. */
export function buildTelHref(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  const digits = normalizePhoneDigits(trimmed);
  if (!digits) return "";

  if (trimmed.startsWith("+") || digits.startsWith("61")) {
    const normalized = digits.startsWith("61") ? digits : `61${digits}`;
    return `tel:+${normalized}`;
  }

  return `tel:${digits}`;
}

/** Format Australian 10-digit numbers as 1300 721 840. */
export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhoneDigits(phone);
  if (digits.length === 10) {
    return digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  return phone.trim();
}

export function buildMailtoHref(email: string): string {
  const trimmed = email.trim();
  return trimmed ? `mailto:${trimmed}` : "";
}

/** Normalize user input to 9-digit Australian mobile (4XXXXXXXX). */
export function parseAustralianMobileDigits(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("61")) {
    return digits.slice(2);
  }
  if (digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/** Australian mobiles: 04xx locally or +61 4xx internationally. */
export function isValidAustralianMobile(input: string): boolean {
  const national = parseAustralianMobileDigits(input.trim());
  return /^4\d{8}$/.test(national);
}

/** Store/display format used by booking + contact submissions. */
export function formatAustralianMobileForSubmit(input: string): string {
  const national = parseAustralianMobileDigits(input.trim());
  if (!/^4\d{8}$/.test(national)) {
    return input.trim();
  }
  return `+61 ${national.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}`;
}
