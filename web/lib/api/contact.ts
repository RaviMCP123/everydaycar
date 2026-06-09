import { apiPost } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export type ContactSubmissionPayload = {
  name: string;
  phone: string;
  email: string;
  enquiryType?: string;
  message?: string;
};

type ContactCreateResponse = { id: string };

export function createContactRequest(payload: ContactSubmissionPayload) {
  return apiPost<ContactCreateResponse>(API_ENDPOINTS.contact.create, payload);
}
