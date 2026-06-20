"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Coordinates,
  geocodeAddressesBatch,
  haversineDistanceKm,
  requestUserLocation,
} from "@/lib/network/geolocation";

export type NearbyRepairerInput = {
  name: string;
  address: string;
  region: string;
  regionSortOrder?: number;
  status?: string;
  link?: string;
  latitude?: number;
  longitude?: number;
};

export type NearbyRepairer = NearbyRepairerInput & {
  distanceKm?: number | null;
};

function resolveCoords(
  repairer: NearbyRepairerInput,
  coordsByAddress: Record<string, Coordinates | null>,
): Coordinates | null {
  if (
    typeof repairer.latitude === "number" &&
    typeof repairer.longitude === "number"
  ) {
    return { latitude: repairer.latitude, longitude: repairer.longitude };
  }
  return coordsByAddress[repairer.address] ?? null;
}

export function useNearbyRepairers(repairers: NearbyRepairerInput[]) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [coordsByAddress, setCoordsByAddress] = useState<
    Record<string, Coordinates | null>
  >({});

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void requestUserLocation().then((coords) => {
        if (!cancelled && coords) setUserLocation(coords);
      });
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const missingAddresses = repairers
      .map((row) => row.address)
      .filter((address) => coordsByAddress[address] === undefined);

    if (missingAddresses.length === 0) return;

    const resolveCoordinates = async () => {
      const updates: Record<string, Coordinates | null> = {};
      const toGeocode: string[] = [];

      for (const address of missingAddresses) {
        const fromData = repairers.find((repairer) => repairer.address === address);
        if (
          fromData &&
          typeof fromData.latitude === "number" &&
          typeof fromData.longitude === "number"
        ) {
          updates[address] = {
            latitude: fromData.latitude,
            longitude: fromData.longitude,
          };
        } else {
          toGeocode.push(address);
        }
      }

      if (toGeocode.length > 0) {
        const batch = await geocodeAddressesBatch(toGeocode);
        for (const address of toGeocode) {
          updates[address] = batch[address] ?? null;
        }
      }

      if (cancelled) return;
      setCoordsByAddress((prev) => ({ ...prev, ...updates }));
    };

    void resolveCoordinates();
    return () => {
      cancelled = true;
    };
  }, [repairers, coordsByAddress]);

  const sortedRepairers = useMemo<NearbyRepairer[]>(() => {
    const rows = repairers.map((repairer) => {
      const coords = resolveCoords(repairer, coordsByAddress);
      const distanceKm =
        userLocation && coords
          ? haversineDistanceKm(userLocation, coords)
          : null;
      return { ...repairer, distanceKm };
    });

    if (!userLocation) return rows;

    return [...rows].sort((a, b) => {
      const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
      const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
      return aDistance - bDistance;
    });
  }, [repairers, coordsByAddress, userLocation]);

  return sortedRepairers;
}
