import { baseApi } from "./baseApi";
import * as API from "@utils/apiPath";
import type {
  BookRepairRequest,
  BookRepairRequestListResponse,
} from "interface/bookRepairRequest";

export const bookRepairRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookRepairRequests: builder.query<
      BookRepairRequestListResponse,
      { [key: string]: string | number }
    >({
      query: (params) => ({
        url: API.GET_BOOK_REPAIR,
        method: "GET",
        params,
      }),
      providesTags: ["BookRepairRequest"],
    }),
    updateBookRepairRequestStatus: builder.mutation<
      { statusCode: number; message: string; data: BookRepairRequest },
      { id: string; status: "new" | "in_progress" | "completed" }
    >({
      query: ({ id, status }) => ({
        url: `${API.GET_BOOK_REPAIR}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["BookRepairRequest"],
    }),
  }),
});

export const {
  useGetBookRepairRequestsQuery,
  useUpdateBookRepairRequestStatusMutation,
} = bookRepairRequestApi;
