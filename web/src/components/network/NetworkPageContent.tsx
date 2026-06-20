"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PageDetail } from "@/lib/api/types";
import {
  fetchPublicNetworkAddressesClient,
  type PublicNetworkAddress,
} from "@/lib/api/network-address";
import { useCmsPage } from "@/lib/cms/use-cms-page";
import { parseNetworkStructuredContent } from "@/lib/cms/parse-network-content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { deriveLocationName } from "@/lib/network/derive-location-name";
import { resolveCurrentLocationLabel } from "@/lib/network/geolocation";
import {
  resolveRegionName,
  resolveRegionSortOrder,
} from "@/lib/network/resolve-region";
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

function isActiveAddress(row: PublicNetworkAddress): boolean {
  if (typeof row.status === "boolean") return row.status;
  const region = row.regionId;
  if (region && typeof region === "object" && "status" in region) {
    return Boolean(region.status);
  }
  return true;
}

export function NetworkPageContent({
  page: initialPage = null,
}: NetworkPageContentProps) {
  const page = useCmsPage(PAGE_SLUGS.ourNetwork, initialPage);
  const [searchValue, setSearchValue] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [repairers, setRepairers] = useState<NetworkTabRepairer[]>([]);
  const locationFilledRef = useRef(false);
  const userEditedSearchRef = useRef(false);

  const structured =
    page?.content && typeof page.content === "object"
      ? parseNetworkStructuredContent(page.content as Record<string, unknown>)
      : null;

  useEffect(() => {
    fetchPublicNetworkAddressesClient().then((rows) => {
      const mapped = rows
        .filter(isActiveAddress)
        .map((row) => {
          const address = resolveAddressText(row.address);
          if (!address) return null;
          return {
            name: deriveLocationName(address),
            address,
            region: resolveRegionName(row.regionId, address),
            regionSortOrder: resolveRegionSortOrder(row.regionId),
            status: row.statusText || "Approved",
            link: row.link || undefined,
            email: row.email || undefined,
            latitude: row.latitude,
            longitude: row.longitude,
          };
        })
        .filter(Boolean) as NetworkTabRepairer[];
      setRepairers(mapped);
    });
  }, []);

  const detectAndFillLocation = useCallback(async () => {
    if (locationFilledRef.current || userEditedSearchRef.current) return;

    setIsDetectingLocation(true);
    try {
      const label = await resolveCurrentLocationLabel();
      if (label && !userEditedSearchRef.current) {
        setSearchValue(label);
        locationFilledRef.current = true;
      }
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  useEffect(() => {
    void detectAndFillLocation();
  }, [detectAndFillLocation]);

  const handleSearchValueChange = useCallback((value: string) => {
    userEditedSearchRef.current = true;
    setSearchValue(value);
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
        onValueChange={handleSearchValueChange}
        onFocus={() => {
          void detectAndFillLocation();
        }}
        onSubmit={() => {
          if (!searchValue.trim()) {
            void detectAndFillLocation();
          }
        }}
        isDetectingLocation={isDetectingLocation}
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
