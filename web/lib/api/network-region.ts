import { apiGetClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export type PublicNetworkRegion = {
  _id?: string;
  id?: string;
  name: string;
  sortOrder?: number;
};

export async function fetchPublicNetworkRegionsClient(): Promise<
  PublicNetworkRegion[]
> {
  return (
    (await apiGetClient<PublicNetworkRegion[]>(
      API_ENDPOINTS.networkRegion.publicList,
    )) ?? []
  );
}
