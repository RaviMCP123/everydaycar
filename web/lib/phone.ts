export function normalizeAustralianMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

export function isValidAustralianMobile(value: string): boolean {
  const normalized = normalizeAustralianMobile(value);
  return /^4\d{8}$/.test(normalized);
}

export function formatAustralianMobileForSubmit(value: string): string {
  const normalized = normalizeAustralianMobile(value);
  return `+61${normalized}`;
}
