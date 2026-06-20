import type { PublicNetworkAddress } from "@/lib/api/network-address";

const REGION_BY_CODE: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  ACT: "Australian Capital Territory",
  NT: "Northern Territory",
};

export function resolveRegionName(
  regionId: PublicNetworkAddress["regionId"],
  fallbackAddress: string,
): string {
  if (typeof regionId === "string" && regionId.trim()) {
    const value = regionId.trim();
    if (!/^[a-f0-9]{24}$/i.test(value)) return value;
  }
  if (regionId && typeof regionId === "object" && regionId.name?.trim()) {
    return regionId.name.trim();
  }

  const stateMatch = fallbackAddress.match(/\b(NSW|VIC|QLD|SA|WA|TAS|ACT|NT)\b/i);
  const code = stateMatch?.[1]?.toUpperCase();
  return (code && REGION_BY_CODE[code]) || "Other";
}

export function resolveRegionSortOrder(
  regionId: PublicNetworkAddress["regionId"],
): number {
  if (
    regionId &&
    typeof regionId === "object" &&
    typeof regionId.sortOrder === "number"
  ) {
    return regionId.sortOrder;
  }
  return Number.MAX_SAFE_INTEGER;
}
