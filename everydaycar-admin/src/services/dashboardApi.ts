import { baseApi } from "./baseApi";
import * as API from "@utils/apiPath";
import type { EverydaycarDashboardResponse } from "interface/dashboard/everydaycar";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<EverydaycarDashboardResponse, void>({
      query: () => ({
        url: API.GET_DASHBOARD_STATS,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
