import { Schema, Document } from "mongoose";

export interface ContactSubmission extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  enquiryType?: string;
  comments: string;
}

const ContactSubmissionSchema = new Schema<ContactSubmission>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    enquiryType: { type: String, default: "General Enquiry" },
    comments: { type: String, default: "" },
  },
  { timestamps: true },
);

export default ContactSubmissionSchema;
