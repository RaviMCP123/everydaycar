import { apiGet, apiGetClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { CmsCategory, PlacementType } from "./types";

export type GetCategoriesParams = {
  status?: boolean;
  placement?: PlacementType | PlacementType[] | string;
};

function buildCategoryQuery(params?: GetCategoriesParams): string {
  if (!params) return "";

  const search = new URLSearchParams();

  if (params.status !== undefined) {
    search.set("status", String(params.status));
  }

  if (params.placement !== undefined) {
    const value = Array.isArray(params.placement)
      ? params.placement.join(",")
      : params.placement;
    search.set("placement", value);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getCategories(
  params?: GetCategoriesParams,
): Promise<CmsCategory[]> {
  const query = buildCategoryQuery(params);
  return apiGet<CmsCategory[]>(`${API_ENDPOINTS.cms.categoryList}${query}`);
}

export async function fetchCategoriesClient(
  params?: GetCategoriesParams,
): Promise<CmsCategory[]> {
  const query = buildCategoryQuery(params);
  return (
    (await apiGetClient<CmsCategory[]>(
      `${API_ENDPOINTS.cms.categoryList}${query}`,
    )) ?? []
  );
}
