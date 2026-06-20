/** True only for media uploaded via CMS/API — not bundled static site assets. */
export function isUploadedCmsMedia(url: string | undefined | null): boolean {
  const trimmed = (url || "").trim();
  if (!trimmed || trimmed.startsWith("blob:")) return false;

  if (/^\/images\//i.test(trimmed)) return false;
  if (/\/images\//i.test(trimmed)) return false;

  if (trimmed.includes("/uploads/")) return true;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}
