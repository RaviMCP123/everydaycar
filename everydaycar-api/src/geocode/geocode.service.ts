import { BadRequestException, Injectable, Logger } from "@nestjs/common";

export type GeocodeCoordinates = {
  latitude: number;
  longitude: number;
};

export type ReverseGeocodeResult = {
  label: string;
  suburb?: string;
  postcode?: string;
  state?: string;
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const CACHE_TTL_MS = 60 * 60 * 1000;
const MIN_REQUEST_INTERVAL_MS = 1100;

@Injectable()
export class GeocodeService {
  private readonly logger = new Logger(GeocodeService.name);
  private readonly searchCache = new Map<string, CacheEntry<GeocodeCoordinates | null>>();
  private readonly reverseCache = new Map<string, CacheEntry<ReverseGeocodeResult | null>>();
  private lastNominatimRequestAt = 0;
  private nominatimTail: Promise<unknown> = Promise.resolve();

  private get userAgent(): string {
    const appName = process.env.APP_NAME || "Everydaycar";
    const appUrl = process.env.APP_URL || "http://localhost:8000";
    return `${appName}/1.0 (${appUrl})`;
  }

  private runOnNominatimQueue<T>(task: () => Promise<T>): Promise<T> {
    const next = this.nominatimTail.then(task, task);
    this.nominatimTail = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  private async waitNominatimSlot(): Promise<void> {
    const elapsed = Date.now() - this.lastNominatimRequestAt;
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await new Promise((resolve) =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed),
      );
    }
    this.lastNominatimRequestAt = Date.now();
  }

  private readCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  private writeCache<T>(cache: Map<string, CacheEntry<T>>, key: string, value: T): void {
    cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  async searchAddress(query: string): Promise<GeocodeCoordinates | null> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      throw new BadRequestException("Query is required.");
    }

    const cacheKey = normalizedQuery.toLowerCase();
    const cached = this.readCache(this.searchCache, cacheKey);
    if (cached !== undefined) return cached;

    try {
      return await this.runOnNominatimQueue(async () => {
        await this.waitNominatimSlot();
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          normalizedQuery,
        )}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": this.userAgent,
          },
        });

        if (!response.ok) {
          this.logger.warn(`Nominatim search failed (${response.status})`);
          this.writeCache(this.searchCache, cacheKey, null);
          return null;
        }

        const rows = (await response.json()) as Array<{ lat?: string; lon?: string }>;
        const first = rows[0];
        if (!first?.lat || !first?.lon) {
          this.writeCache(this.searchCache, cacheKey, null);
          return null;
        }

        const latitude = Number(first.lat);
        const longitude = Number(first.lon);
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
          this.writeCache(this.searchCache, cacheKey, null);
          return null;
        }

        const result = { latitude, longitude };
        this.writeCache(this.searchCache, cacheKey, result);
        return result;
      });
    } catch (error) {
      this.logger.warn(`Nominatim search error: ${String(error)}`);
      this.writeCache(this.searchCache, cacheKey, null);
      return null;
    }
  }

  async reverseCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult | null> {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new BadRequestException("Valid latitude and longitude are required.");
    }
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new BadRequestException("Latitude or longitude is out of range.");
    }

    const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
    const cached = this.readCache(this.reverseCache, cacheKey);
    if (cached !== undefined) return cached;

    try {
      return await this.runOnNominatimQueue(async () => {
        await this.waitNominatimSlot();
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": this.userAgent,
          },
        });

        if (!response.ok) {
          this.logger.warn(`Nominatim reverse failed (${response.status})`);
          this.writeCache(this.reverseCache, cacheKey, null);
          return null;
        }

        const data = (await response.json()) as {
          address?: Record<string, string>;
        };
        const address = data.address;
        if (!address) {
          this.writeCache(this.reverseCache, cacheKey, null);
          return null;
        }

        const suburb =
          address.suburb ||
          address.town ||
          address.city ||
          address.village ||
          address.hamlet ||
          address.municipality ||
          address.county ||
          "";
        const postcode = address.postcode?.trim() || "";
        const label = suburb || postcode;
        if (!label) {
          this.writeCache(this.reverseCache, cacheKey, null);
          return null;
        }

        const result: ReverseGeocodeResult = {
          label: postcode && suburb ? `${suburb} ${postcode}` : label,
          suburb: suburb || undefined,
          postcode: postcode || undefined,
          state: address.state || undefined,
        };
        this.writeCache(this.reverseCache, cacheKey, result);
        return result;
      });
    } catch (error) {
      this.logger.warn(`Nominatim reverse error: ${String(error)}`);
      this.writeCache(this.reverseCache, cacheKey, null);
      return null;
    }
  }

  async searchAddressesBatch(
    queries: string[],
  ): Promise<Record<string, GeocodeCoordinates | null>> {
    const unique = [...new Set(queries.map((query) => query.trim()).filter(Boolean))];
    const results: Record<string, GeocodeCoordinates | null> = {};

    for (const query of unique) {
      results[query] = await this.searchAddress(query);
    }

    return results;
  }
}
