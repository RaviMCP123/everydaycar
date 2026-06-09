import { Document, Schema } from "mongoose";

export interface NetworkRegion extends Document {
  name: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const NetworkRegionSchema = new Schema<NetworkRegion>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default NetworkRegionSchema;
