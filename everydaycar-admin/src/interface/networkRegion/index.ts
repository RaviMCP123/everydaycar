import { Pagination } from "../common";

export interface NetworkRegion {
  _id?: string;
  id?: string;
  name: string;
  status: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NetworkRegionApiResponse {
  statusCode: number;
  message: string;
  data: { results: NetworkRegion[]; pagination: Pagination };
}

export interface NetworkRegionListApiResponse {
  statusCode: number;
  message: string;
  data: NetworkRegion[];
}
