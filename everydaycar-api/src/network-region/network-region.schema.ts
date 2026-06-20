import { Document, Schema } from "mongoose";

export interface NetworkRegion extends Document {
  name: string;
  status: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const NetworkRegionSchema = new Schema<NetworkRegion>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    status: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

NetworkRegionSchema.index({ sortOrder: 1 });

export default NetworkRegionSchema;
