"use client";

import { useEffect, useMemo, useState } from "react";
import type { PageDetail } from "@/lib/api/types";
import {
  fetchPublicNetworkAddressesClient,
  type PublicNetworkAddress,
} from "@/lib/api/network-address";
import { parseNetworkStructuredContent } from "@/lib/cms/parse-network-content";
import { deriveLocationName } from "@/lib/network/derive-location-name";
import { useNearbyRepairers } from "@/lib/network/use-nearby-repairers";
import { JoinRepairerCTA } from "@/src/components/network/JoinRepairerCTA";
import { NetworkHero } from "@/src/components/network/NetworkHero";
import { NetworkSection } from "@/src/components/network/NetworkSection";
import type { NetworkTabRepairer } from "@/src/components/network/NetworkTabs";
import { NetworkStats } from "@/src/components/network/NetworkStats";
import { SearchNetwork } from "@/src/components/network/SearchNetwork";

type NetworkPageContentProps = {
  page?: PageDetail | null;
};

function resolveAddressText(value: PublicNetworkAddress["address"]): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return (value.en ?? Object.values(value)[0] ?? "").trim();
}

function resolveRegionName(
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
  return (code && REGION_BY_CODE[code]) || "Other";
}

export function NetworkPageContent({ page }: NetworkPageContentProps) {
  const [searchValue, setSearchValue] = useState("");
  const [repairers, setRepairers] = useState<NetworkTabRepairer[]>([]);

  const structured =
    page?.content && typeof page.content === "object"
      ? parseNetworkStructuredContent(page.content as Record<string, unknown>)
      : null;

  useEffect(() => {
    fetchPublicNetworkAddressesClient().then((rows) => {
      const mapped = rows
        .map((row) => {
          const address = resolveAddressText(row.address);
          if (!address) return null;
          return {
            name: deriveLocationName(address),
            address,
            region: resolveRegionName(row.regionId, address),
            status: row.statusText || "Approved",
            link: row.link || undefined,
            latitude: row.latitude,
            longitude: row.longitude,
          };
        })
        .filter(Boolean) as NetworkTabRepairer[];
      setRepairers(mapped);
    });
  }, []);

  const nearbyRepairers = useNearbyRepairers(repairers);

  const filteredRepairers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return nearbyRepairers;
    return nearbyRepairers.filter(
      (repairer) =>
        repairer.name.toLowerCase().includes(query) ||
        repairer.address.toLowerCase().includes(query) ||
        repairer.region.toLowerCase().includes(query),
    );
  }, [nearbyRepairers, searchValue]);

  return (
    <>
      <NetworkHero
        imageSrc={structured?.heroImage}
        eyebrow={structured?.heroEyebrow}
        titleLine1={structured?.heroTitleLine1}
        titleLine2={structured?.heroTitleLine2}
        subtitle={structured?.heroSubtitle}
      />
      <SearchNetwork
        value={searchValue}
        onValueChange={setSearchValue}
        onSubmit={() => undefined}
      />
      <NetworkSection repairers={filteredRepairers} />
      <NetworkStats stats={structured?.stats} />
      <JoinRepairerCTA
        title={structured?.joinTitle}
        description={structured?.joinDescription}
        buttonText={structured?.joinButtonText}
        buttonHref={structured?.joinButtonLink}
      />
    </>
  );
}
