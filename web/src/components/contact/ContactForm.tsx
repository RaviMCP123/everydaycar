"use client";

import { useState } from "react";
import { PhoneInput } from "@/components/common/PhoneInput";
import { SuccessModal } from "@/components/common/SuccessModal";
import { createContactRequest } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/client";
import {
  formatAustralianMobileForSubmit,
  isValidAustralianMobile,
} from "@/lib/phone";
import type { FormEvent, ReactNode } from "react";

function Field({
  children,
  error,
  label,
  span = false,
}: {
  children: ReactNode;
  error?: string;
  label: string;
  span?: boolean;
}) {
  return (
    <label className={`block ${span ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block text-[12px] font-semibold !text-[var(--color-primary-navy)]">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-[12px] !text-[#be123c]">{error}</span> : null}
    </label>
  );
}

const fieldClass =
  "h-10 w-full rounded-[7px] border !border-[#dde5ee] bg-white px-3.5 !text-[13px] !text-[var(--color-primary-navy)] outline-none transition placeholder:!text-[#7a8797] focus:!border-[#247dca] focus:shadow-[0_0_0_3px_rgba(36,125,202,0.10)]";
const errorFieldClass = "!border-[#fda4af] focus:!border-[#fda4af]";
const errorMessageClass =
  "rounded-[8px] border border-[#fda4af] bg-[#fff1f2] px-3.5 py-3 text-[13px] !text-[#be123c]";

type ContactErrors = Partial<Record<"fullName" | "phone" | "email", string>>;

type ContactFormProps = {
  title?: string;
  submitText?: string;
};

export function ContactForm({ title, submitText }: ContactFormProps = {}) {
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: ContactErrors = {};

    if (!String(formData.get("fullName") ?? "").trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!phone.trim()) {
      nextErrors.phone = "Mobile number is required.";
    } else if (!isValidAustralianMobile(phone)) {
      nextErrors.phone = "Enter a valid Australian mobile number.";
    }

    const email = String(formData.get("email") ?? "").trim();
    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactRequest({
        name: String(formData.get("fullName") ?? "").trim(),
        phone: formatAustralianMobileForSubmit(phone),
        email,
        enquiryType: String(formData.get("enquiryType") ?? "General Enquiry"),
        message: String(formData.get("message") ?? "").trim(),
      });
      form.reset();
      setPhone("");
      setIsSuccessOpen(true);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong while sending your message. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-[8px] border !border-[#e3eaf2] bg-white px-5 py-6 shadow-[0_12px_30px_rgba(7,29,51,0.07)] md:px-8 md:pb-8 md:pt-9 flex flex-col gap-5"
      >
        <h2 className="mb-7 text-[24px] font-bold leading-[1.2] !text-[var(--color-primary-navy)] md:text-[26px]">
          {title?.trim() || "Send us a message"}
        </h2>

        {formError ? <div className={errorMessageClass}>{formError}</div> : null}

        <div className="grid gap-[18px] md:grid-cols-2">
          <Field label="Full Name *" error={errors.fullName} span>
            <input
              name="fullName"
              placeholder="Enter your full name"
              className={`${fieldClass} ${errors.fullName ? errorFieldClass : ""}`}
              aria-invalid={Boolean(errors.fullName)}
            />
          </Field>

          <PhoneInput
            id="contactPhone"
            name="phone"
            label="Phone Number *"
            value={phone}
            placeholder="412 345 678"
            required
            error={errors.phone}
            onChange={setPhone}
          />

          <Field label="Email Address *" error={errors.email}>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              className={`${fieldClass} ${errors.email ? errorFieldClass : ""}`}
              aria-invalid={Boolean(errors.email)}
            />
          </Field>

          <Field label="Enquiry Type" span>
            <select name="enquiryType" className={`${fieldClass} appearance-none !text-[#64748b]`}>
              <option>General Enquiry</option>
              <option>Repairer Partnership</option>
              <option>Referral Followup</option>
              <option>Others</option>
            </select>
          </Field>

          <Field label="Message" span>
            <textarea
              name="message"
              placeholder="How can we help you today?"
              className="h-[116px] w-full resize-none rounded-[7px] border !border-[#dde5ee] bg-white px-3.5 py-[13px] !text-[13px] !text-[var(--color-primary-navy)] outline-none transition placeholder:!text-[#7a8797] focus:!border-[#247dca] focus:shadow-[0_0_0_3px_rgba(36,125,202,0.10)]"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex h-[42px] w-full items-center justify-center rounded-[5px] !bg-[#247dca] text-[13px] font-bold text-white transition hover:!bg-[#1b6eb5] disabled:cursor-not-allowed disabled:opacity-75"
        >
          {isSubmitting ? "Sending..." : (submitText?.trim() || "Send Message ->")}
        </button>
      </form>

      <SuccessModal
        open={isSuccessOpen}
        title="Message Sent Successfully!"
        message="Thank you for contacting EverydayCar. Our team will get back to you as soon as possible."
        buttonText="Done"
        onClose={() => setIsSuccessOpen(false)}
      />
    </>
  );
}
