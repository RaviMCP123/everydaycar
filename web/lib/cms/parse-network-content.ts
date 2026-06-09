export type NetworkRegionAddress = {
  address: string;
  link?: string;
  status?: string;
};

export type NetworkRegion = {
  region: string;
  repairers: NetworkRegionAddress[];
};

export type NetworkStructuredContent = {
  heroImage?: string;
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroSubtitle?: string;
  regions: NetworkRegion[];
  stats: Array<{ number: string; label: string }>;
  joinTitle?: string;
  joinDescription?: string;
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

export function parseNetworkStructuredContent(
  raw: Record<string, unknown> | undefined | null,
): NetworkStructuredContent | null {
  if (!raw || typeof raw !== "object") return null;

  const rawRegions = Array.isArray(raw.networkRegions) ? raw.networkRegions : [];
  const regions: NetworkRegion[] = rawRegions
    .map((region) => {
      const regionObj =
        region && typeof region === "object"
          ? (region as Record<string, unknown>)
          : null;
      if (!regionObj) return null;

      const regionTitle = localizedToString(regionObj.regionTitle).trim();
      const rawAddresses = Array.isArray(regionObj.addresses)
        ? regionObj.addresses
        : [];

      const repairers = rawAddresses
        .map((row) => {
          const rowObj =
            row && typeof row === "object" ? (row as Record<string, unknown>) : null;
          if (!rowObj) return null;
          const address = localizedToString(rowObj.address).trim();
          if (!address) return null;
          const link = localizedToString(rowObj.link).trim();
          const status = localizedToString(rowObj.status).trim();
          return {
            address,
            link: link || undefined,
            status: status || "Approved",
          };
        })
        .filter(Boolean) as NetworkRegionAddress[];

      if (!regionTitle || repairers.length === 0) return null;

      return {
        region: regionTitle,
        repairers,
      };
    })
    .filter(Boolean) as NetworkRegion[];

  const stats = [1, 2, 3]
    .map((i) => {
      const number = localizedToString(raw[`networkStat${i}Number`]).trim();
      const label = localizedToString(raw[`networkStat${i}Label`]).trim();
      if (!number || !label) return null;
      return { number, label };
    })
    .filter(Boolean) as Array<{ number: string; label: string }>;

  const content: NetworkStructuredContent = {
    heroImage: localizedToString(raw.networkHeroImage).trim() || undefined,
    heroEyebrow: localizedToString(raw.networkHeroEyebrow).trim() || undefined,
    heroTitleLine1:
      localizedToString(raw.networkHeroTitleLine1).trim() || undefined,
    heroTitleLine2:
      localizedToString(raw.networkHeroTitleLine2).trim() || undefined,
    heroSubtitle: localizedToString(raw.networkHeroSubtitle).trim() || undefined,
    regions,
    stats,
    joinTitle: localizedToString(raw.networkJoinTitle).trim() || undefined,
    joinDescription:
      localizedToString(raw.networkJoinDescription).trim() || undefined,
    joinButtonText:
      localizedToString(raw.networkJoinButtonText).trim() || undefined,
    joinButtonLink:
      localizedToString(raw.networkJoinButtonLink).trim() || undefined,
  };

  const hasData =
    Boolean(content.heroTitleLine1) ||
    regions.length > 0 ||
    stats.length > 0 ||
    Boolean(content.joinTitle);

  return hasData ? content : null;
}
