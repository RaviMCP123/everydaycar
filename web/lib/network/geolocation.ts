import { apiGetClient, buildApiUrl } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type Coordinates = { latitude: number; longitude: number };

export function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineDistanceKm(from: Coordinates, to: Coordinates) {
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

export async function geocodeAddress(
  address: string,
): Promise<Coordinates | null> {
  const normalized = address.trim();
  if (!normalized) return null;

  const batch = await geocodeAddressesBatch([normalized]);
  return batch[normalized] ?? null;
}

export async function geocodeAddressesBatch(
  addresses: string[],
): Promise<Record<string, Coordinates | null>> {
  const unique = [...new Set(addresses.map((address) => address.trim()).filter(Boolean))];
  if (unique.length === 0) return {};

  if (unique.length === 1) {
    const single = await apiGetClient<Coordinates | null>(
      API_ENDPOINTS.geocode.search(unique[0]),
    );
    return { [unique[0]]: single };
  }

  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.geocode.searchBatch), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queries: unique }),
      cache: "no-store",
    });

    const body = (await response.json()) as {
      data?: Record<string, Coordinates | null>;
    };

    if (!response.ok || !body?.data) {
      return Object.fromEntries(unique.map((address) => [address, null]));
    }

    return unique.reduce<Record<string, Coordinates | null>>((acc, address) => {
      acc[address] = body.data?.[address] ?? null;
      return acc;
    }, {});
  } catch {
    return Object.fromEntries(unique.map((address) => [address, null]));
  }
}

export type ReverseGeocodeResult = {
  label: string;
  suburb?: string;
  postcode?: string;
  state?: string;
};

export async function reverseGeocodeCoordinates(
  coords: Coordinates,
): Promise<ReverseGeocodeResult | null> {
  return apiGetClient<ReverseGeocodeResult | null>(
    API_ENDPOINTS.geocode.reverse(coords.latitude, coords.longitude),
  );
}

export async function resolveCurrentLocationLabel(): Promise<string | null> {
  const coords = await requestUserLocation();
  if (!coords) return null;
  const result = await reverseGeocodeCoordinates(coords);
  return result?.label?.trim() || null;
}

export function requestUserLocation(): Promise<Coordinates | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      },
    );
  });
}
