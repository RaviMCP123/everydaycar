"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NetworkCard } from "@/src/components/network/NetworkCard";

export type NetworkTabRepairer = {
  name: string;
  address: string;
  region: string;
  status?: string;
  link?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number | null;
};

type NetworkTab = {
  label: string;
  value: string;
};

type NetworkTabsProps = {
  repairers: NetworkTabRepairer[];
  gridClassName?: string;
  limit?: number;
};

function sortByDistance(repairers: NetworkTabRepairer[]) {
  return [...repairers].sort((a, b) => {
    const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
    const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
    return aDistance - bDistance;
  });
}

function getTabs(repairers: NetworkTabRepairer[]): NetworkTab[] {
  const tabs = Array.from(
    new Map(
      repairers.map((repairer) => [
        repairer.region,
        { label: repairer.region, value: repairer.region },
      ]),
    ).values(),
  );

  const nearest = sortByDistance(repairers).find(
    (repairer) => repairer.distanceKm != null,
  );
  if (!nearest) return tabs;

  const nearestIndex = tabs.findIndex((tab) => tab.value === nearest.region);
  if (nearestIndex <= 0) return tabs;

  const [nearestTab] = tabs.splice(nearestIndex, 1);
  return [nearestTab, ...tabs];
}

export function NetworkTabs({
  repairers,
  gridClassName = "mt-7 grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-3",
  limit,
}: NetworkTabsProps) {
  const tabs = useMemo(() => getTabs(repairers), [repairers]);
  const userSelectedRegionRef = useRef(false);
  const [activeRegion, setActiveRegion] = useState("");
  const selectedRegion = tabs.some((tab) => tab.value === activeRegion)
    ? activeRegion
    : (tabs[0]?.value ?? "");

  useEffect(() => {
    if (userSelectedRegionRef.current) return;
    const nearest = sortByDistance(repairers).find(
      (repairer) => repairer.distanceKm != null,
    );
    const defaultRegion = nearest?.region ?? repairers[0]?.region ?? tabs[0]?.value ?? "";
    if (defaultRegion) setActiveRegion(defaultRegion);
  }, [repairers, tabs]);

  const filteredRepairers = sortByDistance(
    repairers.filter((repairer) => repairer.region === selectedRegion),
  ).slice(0, limit);

  if (repairers.length === 0) {
    return (
      <p className="mt-7 rounded-[8px] border !border-[#d6e0ea] bg-white px-5 py-6 text-center text-[14px] font-semibold !text-[var(--color-muted-text)]">
        No repairers available yet.
      </p>
    );
  }

  return (
    <div className="mt-8">
      {tabs.length > 0 ? (
        <div className="overflow-x-auto whitespace-nowrap py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max min-w-full flex-nowrap justify-center gap-3">
            {tabs.map((tab) => {
              const isActive = selectedRegion === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    userSelectedRegionRef.current = true;
                    setActiveRegion(tab.value);
                  }}
                  className={`shrink-0 rounded-full border px-6 py-3 text-[13px] font-bold leading-none transition ${
                    isActive
                      ? "!border-[var(--color-button-blue)] !bg-[var(--color-button-blue)] !text-white shadow-[0_10px_22px_rgba(30,115,190,0.22)]"
                      : "!border-[#d6e0ea] bg-white !text-[var(--color-primary-navy)] hover:!border-[var(--color-button-blue)] hover:!bg-[#f5f8fc] hover:!text-[var(--color-button-blue)]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {filteredRepairers.length > 0 ? (
        <div className={gridClassName}>
          {filteredRepairers.map((repairer) => (
            <NetworkCard
              key={`${repairer.region}-${repairer.address}-${repairer.link || ""}`}
              repairer={repairer}
            />
          ))}
        </div>
      ) : (
        <p className="mt-7 rounded-[8px] border !border-[#d6e0ea] bg-white px-5 py-6 text-center text-[14px] font-semibold !text-[var(--color-muted-text)]">
          No repairers available in this location yet.
        </p>
      )}
    </div>
  );
}
