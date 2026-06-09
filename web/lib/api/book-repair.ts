import { apiPost } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export type BookRepairSubmissionPayload = {
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
};

type BookRepairCreateResponse = { id: string };

export function createBookRepairRequest(
  payload: BookRepairSubmissionPayload,
) {
  return apiPost<BookRepairCreateResponse>(API_ENDPOINTS.bookRepair.create, payload);
}
