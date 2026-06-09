/** Standard API envelope from everydaycar-api */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type PlacementType = "header" | "footer" | "banner" | "quicklinks";

export interface CmsPlacement {
  type: PlacementType;
  sortOrder: number;
}

export interface CmsCategory {
  _id: string;
  name: string;
  slug?: string;
  placement?: CmsPlacement[];
  sortOrder?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type LocalizedField = string | Record<string, string>;

export interface PageDetail {
  _id: string;
  title: LocalizedField;
  description: LocalizedField;
  slug: string;
  category?: string;
  templateKey?: string;
  status?: boolean;
  metaTitle?: LocalizedField;
  metaDescription?: LocalizedField;
  customSlug?: string;
  customCss?: string;
  email?: string;
  phone?: string;
  address?: LocalizedField;
  copyrightText?: LocalizedField;
  footerDescription?: LocalizedField;
  bannerTitle?: LocalizedField;
  bannerDescription?: LocalizedField;
  bannerImage?: string;
  content?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavLink {
  label: string;
  href: string;
  activeHrefs?: string[];
}
