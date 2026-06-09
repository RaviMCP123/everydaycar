import { Pagination } from "../common";

export interface NetworkAddress {
  _id?: string;
  id?: string;
  regionId:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
        status?: boolean;
      };
  address: Record<string, string>;
  link?: string;
  statusText?: string;
  latitude?: number;
  longitude?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NetworkAddressApiResponse {
  statusCode: number;
  message: string;
  data: { results: NetworkAddress[]; pagination: Pagination };
}

export interface NetworkAddressListApiResponse {
  statusCode: number;
  message: string;
  data: NetworkAddress[];
}
