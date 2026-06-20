import { apiGetClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export type PublicNetworkAddress = {
  _id?: string;
  id?: string;
  address?: Record<string, string> | string;
  link?: string;
  email?: string;
  statusText?: string;
  latitude?: number;
  longitude?: number;
  regionId?:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
        sortOrder?: number;
      };
  status?: boolean;
};

export async function fetchPublicNetworkAddressesClient(): Promise<
  PublicNetworkAddress[]
> {
  return (
    (await apiGetClient<PublicNetworkAddress[]>(
      API_ENDPOINTS.networkAddress.publicList,
    )) ?? []
  );
}
