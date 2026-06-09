import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";
import { NetworkAddressController } from "./network-address.controller";
import NetworkAddressSchema from "./network-address.schema";
import { NetworkAddressService } from "./network-address.service";
import NetworkRegionSchema from "../network-region/network-region.schema";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: "NetworkAddress", schema: NetworkAddressSchema },
      { name: "NetworkRegion", schema: NetworkRegionSchema },
    ]),
  ],
  controllers: [NetworkAddressController],
  providers: [NetworkAddressService],
  exports: [NetworkAddressService],
})
export class NetworkAddressModule {}
