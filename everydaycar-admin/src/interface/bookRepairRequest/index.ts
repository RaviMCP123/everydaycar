export interface BookRepairRequest {
  _id?: string;
  id?: string;
  accidentDate: string;
  accidentLocation: string;
  driveable: "yes" | "no";
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
  createdAt?: string | { $date?: string };
}

export interface BookRepairRequestListResponse {
  statusCode: number;
  message: string;
  data: {
    results: BookRepairRequest[];
    pagination: {
      total: number;
      page: number;
      currentPage: number;
      limit: number;
    };
  };
}
