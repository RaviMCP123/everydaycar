"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  fetchPublicNetworkRegionsClient,
  type PublicNetworkRegion,
} from "@/lib/api/network-region";
import { images } from "@/src/image";

const MAX_REGIONS = 5;

type ServedLocationsSectionProps = {
  intro?: string;
};

function RegionItem({ name }: { name: string }) {
  return (
    <li className="flex min-w-[138px] items-center gap-[11px] text-[12px] font-bold leading-tight text-white">
      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full !bg-[#286cf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-white/15">
        <Image
          src={images.victoria}
          alt=""
          width={18}
          height={18}
          className="h-[18px] w-[18px]"
        />
      </span>
      <span className="max-w-[100px] text-[12px] font-semibold leading-[1.2]">
        {name}
      </span>
    </li>
  );
}

export function ServedLocationsSection({ intro }: ServedLocationsSectionProps) {
  const [regions, setRegions] = useState<PublicNetworkRegion[]>([]);
  const resolvedIntro = intro?.trim();

  useEffect(() => {
    let cancelled = false;

    fetchPublicNetworkRegionsClient().then((rows) => {
      if (cancelled) return;
      setRegions(rows.slice(0, MAX_REGIONS));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!resolvedIntro && regions.length === 0) {
    return null;
  }

  return (
    <section className="!bg-[var(--color-bright-blue)] py-9 text-white">
      <div className="container rounded-[20px] bg-white/20 px-7 py-[30px] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] md:px-9">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {resolvedIntro ? (
            <p className="max-w-[40%] text-[16px] font-bold leading-tight">
              {resolvedIntro}
            </p>
          ) : null}

          {regions.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-2 lg:gap-y-3">
              {regions.map((region) => (
                <RegionItem
                  key={region._id || region.id || region.name}
                  name={region.name}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
