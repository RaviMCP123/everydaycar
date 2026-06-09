import { Document, Schema, Types } from "mongoose";

export interface NetworkAddress extends Document {
  regionId: Types.ObjectId;
  address: { [langCode: string]: string };
  link?: string;
  statusText?: string;
  latitude?: number;
  longitude?: number;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const NetworkAddressSchema = new Schema<NetworkAddress>(
  {
    regionId: {
      type: Schema.Types.ObjectId,
      ref: "NetworkRegion",
      required: true,
    },
    address: { type: Map, of: String, required: true },
    link: { type: String, default: "" },
    statusText: { type: String, default: "Approved" },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

NetworkAddressSchema.index({ regionId: 1 });

export default NetworkAddressSchema;
