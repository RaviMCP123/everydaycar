"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PageDetail } from "@/lib/api/types";
import { getLocalizedText } from "@/lib/cms/content";
import { useCmsPage } from "@/lib/cms/use-cms-page";
import { parseFindRepairerStructuredContent } from "@/lib/cms/parse-find-repairer-content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import {
  fetchPublicNetworkAddressesClient,
  type PublicNetworkAddress,
} from "@/lib/api/network-address";
import { resolveMediaUrl } from "@/lib/images";
import { Icon } from "@/src/components/ui/Icon";

function getGoogleMapsDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;
}

type Coordinates = { latitude: number; longitude: number };

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(from: Coordinates, to: Coordinates) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      address,
    )}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const first = rows[0];
    if (!first?.lat || !first?.lon) return null;
    const latitude = Number(first.lat);
    const longitude = Number(first.lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}

export function RepairerCard({
  address,
  distanceLabel,
  statusText,
  link,
  email,
}: {
  address: string;
  distanceLabel?: string;
  statusText?: string;
  link?: string;
  email?: string;
}) {
  const [street, ...rest] = address.split(",");
  const suburb = rest.join(",").trim();
  const mapsUrl = link && /^https?:\/\//i.test(link) ? link : getGoogleMapsDirectionsUrl(address);

  return (
    <article className="flex flex-col gap-3 rounded-[6px] border !border-[#e7eef6] bg-white p-5 shadow-[0_8px_22px_rgba(7,29,51,0.05)] transition hover:!border-[var(--color-button-blue)] hover:ring-1 hover:!ring-[rgba(30,115,190,0.12)]">
      <div>
        <span className="inline-flex rounded-[3px] !bg-[#f3f6f9] px-2.5 py-1 text-[12px] font-semibold leading-none !text-[#7a8797]">
          {distanceLabel || "Distance unavailable"}
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full !bg-[rgba(30,115,190,1)] text-white">
            <Icon name="location" className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <h3 className="text-[14px] font-bold leading-[1.35] !text-[var(--color-primary-navy)]">
              {street}
            </h3>

            {suburb ? (
              <p className="text-[14px] font-bold leading-[1.35] !text-[var(--color-primary-navy)]">
                {suburb}
              </p>
            ) : null}

            {email?.trim() ? (
              <a
                href={`mailto:${email.trim()}`}
                className="mt-2 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold leading-5 !text-[rgba(30,115,190,1)] transition hover:!text-[#1b6eb5]"
              >
                <Icon name="mail" className="h-3.5 w-3.5 shrink-0" />
                {email.trim()}
              </a>
            ) : null}

            <Link
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${address}`}
              className="mt-3 inline-flex w-fit items-center gap-2 text-[14px] font-semibold !text-[rgba(30,115,190,1)] transition hover:gap-3 hover:!text-[#1b6eb5]"
            >
              Get directions
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[4px] !bg-[#e9f8ef] px-3 py-1.5 text-[11px] font-bold uppercase leading-none !text-[#12b76a]">
          <Icon name="check" className="h-3 w-3" />
          {statusText || "Approved"}
        </span>
      </div>
    </article>
  );
}

type FindARepairerPageContentProps = {
  page?: PageDetail | null;
};

export function FindARepairerPageContent({
  page: initialPage = null,
}: FindARepairerPageContentProps) {
  const pathname = usePathname();
  const page = useCmsPage(PAGE_SLUGS.findARepairer, initialPage);
  const [query, setQuery] = useState("");
  const [repairers, setRepairers] = useState<
    Array<{
      key: string;
      address: string;
      link?: string;
      statusText?: string;
      email?: string;
      latitude?: number;
      longitude?: number;
    }>
  >([]);
  const [isLoadingRepairers, setIsLoadingRepairers] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocodingAddresses, setIsGeocodingAddresses] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [coordsByAddress, setCoordsByAddress] = useState<
    Record<string, Coordinates | null>
  >({});

  const structured =
    page?.content && typeof page.content === "object"
      ? parseFindRepairerStructuredContent(page.content as Record<string, unknown>)
      : null;

  const heroImage = resolveMediaUrl(structured?.heroImage);
  const phoneNumber = structured?.phoneNumber?.trim() || "";
  const phoneHref = phoneNumber
    ? `tel:${phoneNumber.replace(/\s+/g, "")}`
    : "";

  const visibleRepairers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return repairers;
    return repairers.filter((repairer) =>
      repairer.address.toLowerCase().includes(normalizedQuery),
    );
  }, [query, repairers]);

  useEffect(() => {
    let cancelled = false;

    const mapAddressText = (value: PublicNetworkAddress["address"]) => {
      if (!value) return "";
      if (typeof value === "string") return value.trim();
      return getLocalizedText(value).trim();
    };

    const loadAddresses = async () => {
      setIsLoadingRepairers(true);
      const rows = await fetchPublicNetworkAddressesClient();
      if (cancelled) return;

      const normalized = rows
        .map((row, index) => {
          const address = mapAddressText(row.address);
          const key = row._id || row.id || `${address}-${index}`;
          return {
            key,
            address,
            link: row.link || "",
            email: row.email || "",
            statusText: row.statusText || "Approved",
            latitude: row.latitude,
            longitude: row.longitude,
          };
        })
        .filter((row) => row.address.length > 0);

      setRepairers(normalized);
      setIsLoadingRepairers(false);
    };

    void loadAddresses();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const resolveCoordinates = async () => {
      const missingAddresses = visibleRepairers
        .map((row) => row.address)
        .filter((address) => coordsByAddress[address] === undefined);
      if (missingAddresses.length === 0) return;

      setIsGeocodingAddresses(true);
      const updates: Record<string, Coordinates | null> = {};
      await Promise.all(
        missingAddresses.map(async (address) => {
          const fromData = visibleRepairers.find((repairer) => repairer.address === address);
          if (
            fromData &&
            typeof fromData.latitude === "number" &&
            typeof fromData.longitude === "number"
          ) {
            updates[address] = {
              latitude: fromData.latitude,
              longitude: fromData.longitude,
            };
            return;
          }
          updates[address] = await geocodeAddress(address);
        }),
      );

      if (cancelled) return;
      setCoordsByAddress((prev) => ({ ...prev, ...updates }));
      setIsGeocodingAddresses(false);
    };

    void resolveCoordinates();
    return () => {
      cancelled = true;
    };
  }, [visibleRepairers, coordsByAddress]);

  const sortedRepairers = useMemo(() => {
    const rows = visibleRepairers.map((repairer) => {
      const coords = coordsByAddress[repairer.address];
      const distanceKm =
        userLocation && coords
          ? haversineDistanceKm(userLocation, coords)
          : null;
      return { repairer, distanceKm };
    });

    if (!userLocation) return rows;
    return rows.sort((a, b) => {
      const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
      const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
      return aDistance - bDistance;
    });
  }, [visibleRepairers, coordsByAddress, userLocation]);

  const requestLocationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }
    setLocationError("");
    setIsLocating(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        });
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setLocationError(
        "Location permission denied or unavailable. Showing default order.",
      );
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    const normalised = pathname.replace(/\/+$/, "");
    if (normalised !== "/find-a-repairer") return;
    const timer = window.setTimeout(() => {
      void requestLocationPermission();
    }, 300);
    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, requestLocationPermission]);

  if (!page) {
    return null;
  }

  return (
    <>
      <section className="relative isolate min-h-[300px] overflow-hidden !bg-[var(--color-primary-navy)] text-white">
        {heroImage ? (
          <div className="absolute bottom-0 right-0 top-0 hidden w-1/2 overflow-hidden md:block">
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 top-0 w-full md:w-1/2">
          <div className="absolute inset-0 !bg-[radial-gradient(circle_at_18px_18px,rgba(30,115,190,0.24)_1px,transparent_1px)] [background-size:18px_18px]" />
        </div>

        <div className="container relative z-10 grid min-h-[300px] md:grid-cols-2">
          <div className="flex items-center">
            <div className="flex w-full max-w-[520px] flex-col gap-3 py-12 pr-8">
              {structured?.heroEyebrow ? (
                <div className="mb-[12px] flex items-center gap-3">
                  <span className="h-px w-[30px] bg-white/70" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                    {structured.heroEyebrow}
                  </p>
                </div>
              ) : null}
              {structured?.heroTitleLine1 || structured?.heroTitleLine2 ? (
                <h1 className="max-w-[460px] text-[clamp(32px,4vw,48px)] font-bold leading-[1.06] tracking-normal">
                  {structured?.heroTitleLine1}
                  {structured?.heroTitleLine2 ? (
                    <span className="block">{structured.heroTitleLine2}</span>
                  ) : null}
                </h1>
              ) : null}
              <span className="mt-[12px] block h-px w-[34px] bg-white/70" />
              {structured?.heroSubtitle ? (
                <p className="mt-[13px] max-w-[520px] text-[14px] font-medium leading-[24px] text-white/75">
                  {structured.heroSubtitle}
                </p>
              ) : null}
            </div>
          </div>
          {heroImage ? (
            <div className="relative min-h-[260px] overflow-hidden md:hidden">
              <Image
                src={heroImage}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="!bg-[#f5f8fc] py-10 md:py-12">
        <div className="container flex flex-col gap-5">
          <div className="mb-8 flex flex-col gap-3 rounded-[10px] border !border-[#dfe8f2] bg-white p-[10px] shadow-[0_16px_34px_rgba(7,29,51,0.08)] md:flex-row md:items-center">
            <input
              type="text"
              aria-label="Search suburb or postcode"
              placeholder={structured?.searchPlaceholder || "Search"}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 flex-1 rounded-[6px] border-0 px-5 text-[12px] !text-[var(--color-primary-navy)] outline-none transition placeholder:!text-[#a3acb8] focus:!bg-[#f8fbfe]"
            />
            <button
              type="button"
              onClick={() => void requestLocationPermission()}
              className="inline-flex h-10 min-h-0 items-center justify-center gap-2 rounded-[6px] border !border-[#dce5ef] bg-white px-4 text-[12px] font-bold !text-[#1e73be] transition hover:!border-[#1e73be] disabled:opacity-60"
              disabled={isLocating}
            >
              <Icon name="location" className="h-[13px] w-[13px]" />
              {isLocating
                ? "Locating..."
                : userLocation
                  ? "Location Active"
                  : "Use My Location"}
            </button>
            {structured?.searchButtonText ? (
              <button
                type="button"
                className="btn btn-primary h-10 min-h-0 rounded-[6px] px-5 text-[12px] font-bold shadow-[0_8px_18px_rgba(30,115,190,0.26)] md:w-auto"
              >
                <Icon name="search" className="h-[13px] w-[13px]" />
                {structured.searchButtonText}
              </button>
            ) : null}
          </div>
          {locationError ? (
            <p className="-mt-5 mb-5 text-[12px] text-[#b42318]">{locationError}</p>
          ) : null}
          <div className="flex flex-col gap-3">
            {structured?.resultsTitle ? (
              <h2 className="mb-5 text-[18px] font-bold !text-[var(--color-primary-navy)]">
                {structured.resultsTitle}
              </h2>
            ) : null}
            {isLoadingRepairers ? (
              <p className="-mt-2 mb-2 text-[12px] text-[#7a8797]">
                Loading repairers...
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sortedRepairers.map(({ repairer, distanceKm }) => (
                <RepairerCard
                  key={repairer.key}
                  address={repairer.address}
                  statusText={repairer.statusText}
                  link={repairer.link}
                  email={repairer.email}
                  distanceLabel={
                    distanceKm !== null && Number.isFinite(distanceKm)
                      ? `~${Math.abs(distanceKm).toFixed(1)} km away`
                      : userLocation && isGeocodingAddresses
                        ? "Calculating..."
                        : undefined
                  }
                />
              ))}
            </div>
            {!isLoadingRepairers && sortedRepairers.length === 0 ? (
              <p className="text-[13px] text-[#7a8797]">
                No repairers found for your search.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {structured?.ctaTitle ||
      structured?.ctaDescription ||
      structured?.callButtonText ||
      structured?.bookButtonText ? (
        <section className="bg-white pb-12">
          <div className="container flex flex-col items-center gap-3 rounded-[6px] !bg-[var(--color-primary-navy)] px-6 py-8 text-center text-white">
            {structured?.ctaTitle ? (
              <h2 className="text-[22px] font-bold leading-tight">
                {structured.ctaTitle}
              </h2>
            ) : null}
            {structured?.ctaDescription ? (
              <p className="mx-auto mt-3 max-w-[760px] text-[11px] leading-5 text-white/72">
                {structured.ctaDescription}
              </p>
            ) : null}
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {structured?.callButtonText && phoneHref ? (
                <a
                  href={phoneHref}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[4px] border border-white/18 bg-white/8 px-5 text-[12px] font-bold text-white transition hover:bg-white/14"
                >
                  <Icon name="phone" className="h-[13px] w-[13px]" />
                  {structured.callButtonText}
                </a>
              ) : null}
              {structured?.bookButtonText && structured?.bookButtonLink ? (
                <Link
                  href={structured.bookButtonLink}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[4px] !bg-[var(--color-button-blue)] px-5 text-[12px] font-bold text-white transition hover:!bg-[var(--color-bright-blue)]"
                >
                  {structured.bookButtonText}{" "}
                  <Icon name="arrowRight" className="h-[13px] w-[13px]" />
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
