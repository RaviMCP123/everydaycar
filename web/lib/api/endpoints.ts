/** API path segments (without `/api` prefix — added by client). */
export const API_ENDPOINTS = {
  cms: {
    categoryList: "/cms/category/list",
  },
  page: {
    detail: (slug: string) => `/page/detail/${encodeURIComponent(slug)}`,
  },
  bookRepair: {
    create: "/book-repair",
  },
  contact: {
    create: "/contact",
  },
  networkAddress: {
    publicList: "/network-address/public",
  },
  networkRegion: {
    publicList: "/network-region/public",
  },
  geocode: {
    search: (query: string) =>
      `/geocode/search?q=${encodeURIComponent(query)}`,
    searchBatch: "/geocode/search/batch",
    reverse: (latitude: number, longitude: number) =>
      `/geocode/reverse?lat=${latitude}&lon=${longitude}`,
  },
} as const;
