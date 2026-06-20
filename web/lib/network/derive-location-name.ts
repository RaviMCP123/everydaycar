/** Remove a leading suburb/location name when it is repeated in the address body. */
export function formatDisplayAddress(
  address: string,
  locationName?: string,
): string {
  const trimmed = address.trim();
  const name = locationName?.trim();
  if (!trimmed || !name) return trimmed;

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withoutPrefix = trimmed
    .replace(new RegExp(`^${escaped}(\\s*[,\\n]\\s*|\\s+)`, "i"), "")
    .trim();

  return withoutPrefix || trimmed;
}

/** Derive suburb/location title from a full street address string. */
export function deriveLocationName(address: string): string {
  const trimmed = address.trim();
  if (!trimmed) return "";

  const statePostcode = /\b(NSW|VIC|QLD|SA|WA|TAS|ACT|NT)\s+\d{4}\b/i;
  const parts = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (let i = parts.length - 1; i >= 0; i--) {
    if (statePostcode.test(parts[i])) {
      const suburb = parts[i].replace(statePostcode, "").trim();
      if (suburb) return suburb;
    }
  }

  return parts[parts.length - 1] ?? trimmed;
}
