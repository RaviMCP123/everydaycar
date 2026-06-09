import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export type DashboardStats = {
  totalRepairers: number;
  pendingReferrals: number;
  activeJobs: number;
  completedJobs: number;
  contactRequests: number;
  cmsPages: number;
  cmsCategories: number;
  networkRegions: number;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel("NetworkAddress")
    private readonly networkAddressModel: Model<any>,
    @InjectModel("BookRepairSubmission")
    private readonly bookRepairModel: Model<any>,
    @InjectModel("ContactSubmission")
    private readonly contactModel: Model<any>,
    @InjectModel("Page")
    private readonly pageModel: Model<any>,
    @InjectModel("CmsCategory")
    private readonly cmsCategoryModel: Model<any>,
    @InjectModel("NetworkRegion")
    private readonly networkRegionModel: Model<any>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const [
      totalRepairers,
      pendingReferrals,
      activeJobs,
      completedJobs,
      contactRequests,
      cmsPages,
      cmsCategories,
      networkRegions,
    ] = await Promise.all([
      this.networkAddressModel.countDocuments({}),
      this.bookRepairModel.countDocuments({ status: "new" }),
      this.bookRepairModel.countDocuments({ status: "in_progress" }),
      this.bookRepairModel.countDocuments({ status: "completed" }),
      this.contactModel.countDocuments({}),
      this.pageModel.countDocuments({}),
      this.cmsCategoryModel.countDocuments({}),
      this.networkRegionModel.countDocuments({}),
    ]);

    return {
      totalRepairers,
      pendingReferrals,
      activeJobs,
      completedJobs,
      contactRequests,
      cmsPages,
      cmsCategories,
      networkRegions,
    };
  }
}
