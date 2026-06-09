export interface EverydaycarDashboardStats {
  totalRepairers: number;
  pendingReferrals: number;
  activeJobs: number;
  completedJobs: number;
  contactRequests: number;
  cmsPages: number;
  cmsCategories: number;
  networkRegions: number;
}

export interface EverydaycarDashboardResponse {
  statusCode: number;
  message: string;
  data: EverydaycarDashboardStats;
}
