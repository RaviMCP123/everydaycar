import { baseApi } from "./baseApi";
import * as API from "@utils/apiPath";
import type {
  NetworkRegionApiResponse,
  NetworkRegionListApiResponse,
} from "interface/networkRegion";

export const networkRegionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkRegions: builder.query<
      NetworkRegionApiResponse,
      { [key: string]: string | number }
    >({
      query: (params) => ({
        url: API.GET_NETWORK_REGION,
        method: "GET",
        params,
      }),
      providesTags: ["NetworkRegion"],
    }),
    getNetworkRegionList: builder.query<NetworkRegionListApiResponse, void>({
      query: () => ({
        url: API.GET_NETWORK_REGION_LIST,
        method: "GET",
      }),
      providesTags: ["NetworkRegion"],
    }),
    createNetworkRegion: builder.mutation<
      any,
      { params: { name: string; status?: boolean }; onClose?: () => void }
    >({
      query: ({ params }) => ({
        url: API.GET_NETWORK_REGION,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["NetworkRegion"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          arg.onClose?.();
        } catch {
          // noop
        }
      },
    }),
    updateNetworkRegion: builder.mutation<
      any,
      { id: string; params: { name?: string; status?: boolean }; onClose?: () => void }
    >({
      query: ({ id, params }) => ({
        url: `${API.GET_NETWORK_REGION}/${id}`,
        method: "PUT",
        body: params,
      }),
      invalidatesTags: ["NetworkRegion"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          arg.onClose?.();
        } catch {
          // noop
        }
      },
    }),
    updateNetworkRegionStatus: builder.mutation<
      any,
      { id: string; status: boolean }
    >({
      query: ({ id, status }) => ({
        url: `${API.GET_NETWORK_REGION}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["NetworkRegion"],
    }),
    deleteNetworkRegion: builder.mutation<any, string>({
      query: (id) => ({
        url: `${API.GET_NETWORK_REGION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkRegion"],
    }),
    reorderNetworkRegions: builder.mutation<
      NetworkRegionListApiResponse,
      { ids: string[] }
    >({
      query: ({ ids }) => ({
        url: API.REORDER_NETWORK_REGION,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: ["NetworkRegion"],
    }),
  }),
});

export const {
  useGetNetworkRegionsQuery,
  useGetNetworkRegionListQuery,
  useCreateNetworkRegionMutation,
  useUpdateNetworkRegionMutation,
  useUpdateNetworkRegionStatusMutation,
  useDeleteNetworkRegionMutation,
  useReorderNetworkRegionsMutation,
} = networkRegionApi;
