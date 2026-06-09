import { Document, Schema } from "mongoose";

export interface BookRepairSubmission extends Document {
  accidentDate: string;
  accidentLocation: string;
  driveable: "yes" | "no" | "not-sure";
  accidentDescription?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  registrationNumber: string;
  vehicleColour?: string;
  otherDriverAtFault: "yes" | "no";
  fullName: string;
  mobileNumber: string;
  email?: string;
  callbackTime?: string;
  suburb: string;
  status: "new" | "in_progress" | "completed";
}

const BookRepairSubmissionSchema = new Schema<BookRepairSubmission>(
  {
    accidentDate: { type: String, required: true },
    accidentLocation: { type: String, required: true },
    driveable: {
      type: String,
      enum: ["yes", "no", "not-sure"],
      required: true,
    },
    accidentDescription: { type: String, required: false, default: "" },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehicleYear: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    vehicleColour: { type: String, required: false, default: "" },
    otherDriverAtFault: { type: String, enum: ["yes", "no"], required: true },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: false, default: "" },
    callbackTime: { type: String, required: false, default: "" },
    suburb: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in_progress", "completed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export default BookRepairSubmissionSchema;
