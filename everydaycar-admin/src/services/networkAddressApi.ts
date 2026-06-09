import { baseApi } from "./baseApi";
import * as API from "@utils/apiPath";
import type {
  NetworkAddressApiResponse,
  NetworkAddressListApiResponse,
} from "interface/networkAddress";

export const networkAddressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkAddresses: builder.query<
      NetworkAddressApiResponse,
      { [key: string]: string | number }
    >({
      query: (params) => ({
        url: API.GET_NETWORK_ADDRESS,
        method: "GET",
        params,
      }),
      providesTags: ["NetworkAddress"],
    }),
    getNetworkAddressList: builder.query<NetworkAddressListApiResponse, void>({
      query: () => ({
        url: API.GET_NETWORK_ADDRESS_LIST,
        method: "GET",
      }),
      providesTags: ["NetworkAddress"],
    }),
    createNetworkAddress: builder.mutation<any, { params: any; onClose?: () => void }>({
      query: ({ params }) => ({
        url: API.GET_NETWORK_ADDRESS,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["NetworkAddress"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          arg.onClose?.();
        } catch {
          // noop
        }
      },
    }),
    updateNetworkAddress: builder.mutation<any, { id: string; params: any; onClose?: () => void }>({
      query: ({ id, params }) => ({
        url: `${API.GET_NETWORK_ADDRESS}/${id}`,
        method: "PUT",
        body: params,
      }),
      invalidatesTags: ["NetworkAddress"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          arg.onClose?.();
        } catch {
          // noop
        }
      },
    }),
    updateNetworkAddressStatus: builder.mutation<any, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `${API.GET_NETWORK_ADDRESS}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["NetworkAddress"],
    }),
    deleteNetworkAddress: builder.mutation<any, string>({
      query: (id) => ({
        url: `${API.GET_NETWORK_ADDRESS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkAddress"],
    }),
  }),
});

export const {
  useGetNetworkAddressesQuery,
  useGetNetworkAddressListQuery,
  useCreateNetworkAddressMutation,
  useUpdateNetworkAddressMutation,
  useUpdateNetworkAddressStatusMutation,
  useDeleteNetworkAddressMutation,
} = networkAddressApi;
