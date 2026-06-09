"use client";

import { useState } from "react";
import { SuccessModal } from "@/components/common/SuccessModal";
import { formatDateToApi, getTodayISO } from "@/lib/date";
import {
  formatAustralianMobileForSubmit,
  isValidAustralianMobile,
} from "@/lib/phone";
import {
  createBookRepairRequest,
  type BookRepairSubmissionPayload,
} from "@/lib/api/book-repair";
import { AboutAccidentStep } from "@/src/components/booking/AboutAccidentStep";
import { BookingFormCard } from "@/src/components/booking/BookingFormCard";
import { BookingProgress } from "@/src/components/booking/BookingProgress";
import { VehicleStep } from "@/src/components/booking/VehicleStep";
import { WhyUseCard } from "@/src/components/booking/WhyUseCard";
import { YourDetailsStep } from "@/src/components/booking/YourDetailsStep";
import type { FormEvent } from "react";

const stepMeta = [
  { badge: "Step 1 of 3", title: "About the Accident" },
  { badge: "Step 2 of 3", title: "Your Vehicle" },
  { badge: "Step 3 of 3", title: "Your Details" },
] as const;

const initialValues = {
  accidentDate: "",
  accidentLocation: "",
  driveable: "yes",
  accidentDescription: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  registrationNumber: "",
  vehicleColour: "",
  otherDriverAtFault: "yes",
  fullName: "",
  mobileNumber: "",
  email: "",
  callbackTime: "As soon as possible",
  suburb: "",
};

const requiredFieldsByStep = [
  ["accidentDate", "accidentLocation"],
  ["vehicleMake", "vehicleModel", "vehicleYear", "registrationNumber"],
  ["fullName", "mobileNumber", "suburb"],
] as const;

const fieldLabels: Record<string, string> = {
  accidentDate: "Date of accident",
  accidentLocation: "Accident location",
  vehicleMake: "Vehicle make",
  vehicleModel: "Vehicle model",
  vehicleYear: "Year",
  registrationNumber: "Registration number",
  fullName: "Full name",
  mobileNumber: "Mobile number",
  suburb: "Suburb / postcode",
};

type BookingValues = typeof initialValues;
type BookingErrors = Partial<Record<keyof BookingValues, string>>;
type BookingSubmissionPayload = Omit<
  BookingValues,
  "accidentDate" | "mobileNumber"
> & {
  accidentDate: string;
  mobileNumber: string;
};

type BookingSidebarContent = {
  title?: string;
  benefits?: string[];
  preferCallText?: string;
  phoneNumber?: string;
  callButtonText?: string;
};

type BookingSectionProps = {
  sidebarContent?: BookingSidebarContent;
};

const errorMessageClass =
  "rounded-[8px] border border-[#fda4af] bg-[#fff1f2] px-3.5 py-3 text-[13px] !text-[#be123c]";

const delay = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

function isFutureIsoDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date > getTodayISO();
}

function getStepErrors(values: BookingValues, step: number) {
  const nextErrors: BookingErrors = {};

  requiredFieldsByStep[step].forEach((field) => {
    if (!values[field].trim()) {
      nextErrors[field] = `${fieldLabels[field]} is required.`;
    }
  });

  if (step === 0 && isFutureIsoDate(values.accidentDate)) {
    nextErrors.accidentDate = "Date of accident cannot be in the future.";
  }

  if (step === 1 && values.vehicleYear && !/^\d{4}$/.test(values.vehicleYear.trim())) {
    nextErrors.vehicleYear = "Enter a valid four-digit year.";
  }

  if (step === 2 && values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (step === 2 && values.mobileNumber && !isValidAustralianMobile(values.mobileNumber)) {
    nextErrors.mobileNumber = "Enter a valid Australian mobile number.";
  }

  return nextErrors;
}

function getBookingSubmissionPayload(values: BookingValues): BookingSubmissionPayload {
  return {
    ...values,
    accidentDate: formatDateToApi(values.accidentDate),
    mobileNumber: formatAustralianMobileForSubmit(values.mobileNumber),
  };
}

async function submitBookingRequest(payload: BookingSubmissionPayload) {
  await createBookRepairRequest(payload as BookRepairSubmissionPayload);
  await delay(200);
}

export function BookingSection({ sidebarContent }: BookingSectionProps = {}) {
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState<BookingValues>(initialValues);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const maxAccidentDate = getTodayISO();
  const currentStep = stepMeta[activeStep];

  function updateValue(name: string, value: string) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  }

  function validateStep(step: number) {
    const nextErrors = getStepErrors(values, step);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateBookingForm() {
    for (let step = 0; step < stepMeta.length; step += 1) {
      const nextErrors = getStepErrors(values, step);

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setActiveStep(step);
        return false;
      }
    }

    setErrors({});
    return true;
  }

  const goBack = () => {
    setFormError("");
    setErrors({});
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const goNext = () => {
    setFormError("");
    if (!validateStep(activeStep)) {
      return;
    }
    setActiveStep((step) => Math.min(step + 1, stepMeta.length - 1));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!validateBookingForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBookingRequest(getBookingSubmissionPayload(values));
      setValues(initialValues);
      setErrors({});
      setActiveStep(0);
      setIsSuccessOpen(true);
    } catch {
      setFormError("Something went wrong while submitting your repair request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen !bg-[#f5f8fc] py-10">
      <div className="container grid w-full max-w-[1180px] grid-cols-1 items-start gap-[22px] px-6 xl:px-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form className="flex min-w-0 flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <BookingProgress activeStep={activeStep + 1} />
          {formError ? <div className={errorMessageClass}>{formError}</div> : null}
          <BookingFormCard
            title={currentStep.title}
            stepBadge={currentStep.badge}
            footer={
              activeStep === 2 ? (
                <div className="w-full">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex h-10 items-center justify-center rounded-[7px] border !border-[#d6e0ea] bg-white px-[18px] text-[12px] font-bold !text-[#071d33] transition hover:!border-[#247dca]"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-10 items-center justify-center rounded-[7px] !bg-[#247dca] px-[18px] text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(36,125,202,0.28)] transition hover:!bg-[#1b6eb5] disabled:cursor-not-allowed disabled:opacity-75"
                    >
                      {isSubmitting ? "Submitting..." : "Book a Repairer ->"}
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] leading-[1.5] !text-[#7a8797]">
                    By submitting this form you agree to our Privacy Policy. Your
                    details will only be used to connect you with an approved repairer.
                  </p>
                </div>
              ) : (
                <>
                  {activeStep > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex h-10 items-center justify-center rounded-[7px] border !border-[#d6e0ea] bg-white px-[18px] text-[12px] font-bold !text-[#071d33] transition hover:!border-[#247dca]"
                    >
                      &larr; Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-10 items-center justify-center rounded-[7px] !bg-[#247dca] px-[18px] text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(36,125,202,0.28)] transition hover:!bg-[#1b6eb5]"
                  >
                    Next &rarr;
                  </button>
                </>
              )
            }
          >
            {activeStep === 0 ? (
              <AboutAccidentStep
                errors={errors}
                maxDate={maxAccidentDate}
                onChange={updateValue}
                values={values}
              />
            ) : null}
            {activeStep === 1 ? (
              <VehicleStep errors={errors} onChange={updateValue} values={values} />
            ) : null}
            {activeStep === 2 ? (
              <YourDetailsStep errors={errors} onChange={updateValue} values={values} />
            ) : null}
          </BookingFormCard>
        </form>
        <WhyUseCard
          title={sidebarContent?.title}
          benefits={sidebarContent?.benefits}
          preferCallText={sidebarContent?.preferCallText}
          phoneNumber={sidebarContent?.phoneNumber}
          callButtonText={sidebarContent?.callButtonText}
        />
      </div>

      <SuccessModal
        open={isSuccessOpen}
        title="Repair Request Submitted!"
        message="Your repair request has been received. Our accident management team will contact you shortly."
        buttonText="Done"
        onClose={() => setIsSuccessOpen(false)}
      />
    </section>
  );
}
