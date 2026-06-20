"use client";

import { useEffect, useState } from "react";
import type { PageDetail } from "@/lib/api/types";
import { getLocalizedText } from "@/lib/cms/content";
import {
  fetchPublicNetworkAddressesClient,
  type PublicNetworkAddress,
} from "@/lib/api/network-address";
import { deriveLocationName } from "@/lib/network/derive-location-name";
import {
  resolveRegionName,
  resolveRegionSortOrder,
} from "@/lib/network/resolve-region";
import { useNearbyRepairers } from "@/lib/network/use-nearby-repairers";
import type { NetworkTabRepairer } from "@/src/components/network/NetworkTabs";
import {
  parseHomeJoinCta,
  parseHomeStructuredContent,
} from "@/lib/cms/parse-home-content";
import { HeroSection } from "@/src/components/home/HeroSection";
import { JoinNetworkCTA } from "@/src/components/home/JoinNetworkCTA";
import { NetworkSection } from "@/src/components/home/NetworkSection";
import { TrustBar } from "@/src/components/home/TrustBar";
import { ValueSection } from "@/src/components/home/ValueSection";

type HomePageContentProps = {
  page?: PageDetail | null;
};

function resolveAddressText(value: PublicNetworkAddress["address"]): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return (value.en ?? Object.values(value)[0] ?? "").trim();
}

/** Reference layout + CMS copy from API description where parsed. */
export function HomePageContent({ page }: HomePageContentProps) {
  const structured =
    page && page.content
      ? parseHomeStructuredContent(page.content as Record<string, unknown>)
      : null;
  const descriptionHtml = page ? getLocalizedText(page.description) : "";
  const joinCtaFallback = descriptionHtml ? parseHomeJoinCta(descriptionHtml) : null;

  const joinCta = {
    iconSrc: structured?.joinIcon,
    title: structured?.joinTitle || joinCtaFallback?.title,
    subtitle: structured?.joinSubtitle || joinCtaFallback?.subtitle,
    buttonLabel: structured?.joinButtonText || joinCtaFallback?.buttonLabel,
    buttonHref: structured?.joinButtonLink || joinCtaFallback?.buttonHref,
  };

  const [networkRepairers, setNetworkRepairers] = useState<NetworkTabRepairer[]>(
    [],
  );

  useEffect(() => {
    fetchPublicNetworkAddressesClient().then((rows) => {
      const mapped = rows
        .map((row) => {
          const address = resolveAddressText(row.address);
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
        .filter((r) => r.address.length > 0);
      setNetworkRepairers(mapped);
    });
  }, []);

  const nearbyRepairers = useNearbyRepairers(networkRepairers);

  return (
    <div className="site-home">
      <HeroSection
        imageSrc={structured?.heroImage}
        kicker={structured?.heroKicker}
        titleLine1={structured?.heroTitleLine1}
        titleLine2={structured?.heroTitleLine2}
        subtitle={structured?.heroSubtitle}
        primaryButtonText={structured?.heroPrimaryButtonText}
        primaryButtonHref={structured?.heroPrimaryButtonLink}
        secondaryButtonText={structured?.heroSecondaryButtonText}
        secondaryButtonHref={structured?.heroSecondaryButtonLink}
        badgeImages={structured?.heroBadgeImages}
      />
      {structured?.trustBarTitle ||
      (structured?.trustItems && structured.trustItems.length > 0) ? (
        <TrustBar
          title={structured?.trustBarTitle}
          features={structured?.trustItems}
        />
      ) : null}
      {structured?.valueKicker ||
      structured?.valueTitle ||
      structured?.valueDescription ? (
        <ValueSection
          kicker={structured?.valueKicker}
          title={structured?.valueTitle}
          description={structured?.valueDescription}
        />
      ) : null}
      <NetworkSection repairers={nearbyRepairers} />
      {joinCta.title || joinCta.subtitle || joinCta.buttonLabel ? (
        <JoinNetworkCTA {...joinCta} />
      ) : null}
    </div>
  );
}
