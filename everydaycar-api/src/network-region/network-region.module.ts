import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";
import { NetworkRegionController } from "./network-region.controller";
import NetworkRegionSchema from "./network-region.schema";
import { NetworkRegionService } from "./network-region.service";
import NetworkAddressSchema from "../network-address/network-address.schema";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: "NetworkRegion", schema: NetworkRegionSchema },
      { name: "NetworkAddress", schema: NetworkAddressSchema },
    ]),
  ],
  controllers: [NetworkRegionController],
  providers: [NetworkRegionService],
  exports: [NetworkRegionService],
})
export class NetworkRegionModule {}
