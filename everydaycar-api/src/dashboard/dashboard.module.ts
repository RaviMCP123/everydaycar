import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";
import BookRepairSubmissionSchema from "../book-repair/book-repair.schema";
import ContactSubmissionSchema from "../contact/contact.schema";
import NetworkAddressSchema from "../network-address/network-address.schema";
import NetworkRegionSchema from "../network-region/network-region.schema";
import CmsCategorySchema from "../cms/cms-category.schema";
import PageSchema from "../page/page.schema";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: "NetworkAddress", schema: NetworkAddressSchema },
      { name: "BookRepairSubmission", schema: BookRepairSubmissionSchema },
      { name: "ContactSubmission", schema: ContactSubmissionSchema },
      { name: "Page", schema: PageSchema },
      { name: "CmsCategory", schema: CmsCategorySchema },
      { name: "NetworkRegion", schema: NetworkRegionSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
