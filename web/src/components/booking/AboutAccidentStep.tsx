"use client";

import { DateInput } from "@/components/common/DateInput";
import { RadioPill } from "@/src/components/booking/RadioPill";
import { Icon } from "@/src/components/ui/Icon";

const inputClass =
  "h-[38px] w-full rounded-[7px] border !border-[#d6e0ea] bg-white px-3.5 text-[13px] !text-[#071d33] outline-none transition placeholder:!text-[#9aa6b2] focus:!border-[#247dca] focus:shadow-[0_0_0_3px_rgba(36,125,202,0.10)] !text-[12px]";
const errorFieldClass = "!border-[#fda4af] focus:!border-[#fda4af]";

type BookingValues = Record<string, string>;

type StepProps = {
  errors: Partial<Record<string, string>>;
  maxDate: string;
  onChange: (name: string, value: string) => void;
  values: BookingValues;
};

function FieldLabel({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="block py-2">
      <span className="!mb-2 block text-[12px] font-bold !text-[#071d33]">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-[12px] !text-[#be123c]">{error}</span> : null}
    </label>
  );
}

export function AboutAccidentStep({ errors, maxDate, onChange, values }: StepProps) {
  const driveable = values.driveable || "yes";

  return (
    <>
      <DateInput
        id="accidentDate"
        name="accidentDate"
        label="Date of accident *"
        value={values.accidentDate || ""}
        max={maxDate}
        required
        error={errors.accidentDate}
        onChange={(value) => onChange("accidentDate", value)}
      />

      <FieldLabel label="Where did the accident occur? *" error={errors.accidentLocation}>
        <div className="relative">
          <Icon
            name="location"
            className="absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 [filter:brightness(0)_saturate(100%)_invert(50%)_sepia(11%)_saturate(499%)_hue-rotate(174deg)_brightness(86%)_contrast(83%)]"
          />
          <input
            name="accidentLocation"
            value={values.accidentLocation || ""}
            onChange={(event) => onChange(event.target.name, event.target.value)}
            placeholder="Suburb / postcode"
            className={`${inputClass} pl-10 ${errors.accidentLocation ? errorFieldClass : ""}`}
            aria-invalid={Boolean(errors.accidentLocation)}
          />
        </div>
      </FieldLabel>

      <div>
        <p className="!mb-2 text-[12px] font-bold !text-[#071d33]">
          Was your vehicle driveable after the accident? *
        </p>
        <input type="hidden" name="driveable" value={driveable} />
        <div className="flex flex-wrap gap-2">
          <RadioPill
            label="Yes"
            value="yes"
            selected={driveable === "yes"}
            onClick={() => onChange("driveable", "yes")}
          />
          <RadioPill
            label="No"
            value="no"
            selected={driveable === "no"}
            onClick={() => onChange("driveable", "no")}
          />
          <RadioPill
            label="Not sure"
            value="not-sure"
            selected={driveable === "not-sure"}
            onClick={() => onChange("driveable", "not-sure")}
          />
        </div>
      </div>

      <FieldLabel label="Describe what happened (optional)">
        <textarea
          name="accidentDescription"
          value={values.accidentDescription || ""}
          onChange={(event) => onChange(event.target.name, event.target.value)}
          placeholder="Tell us what happened (e.g., location, other vehicle details, damage)"
          className="h-[76px] w-full resize-none rounded-[7px] border !border-[#d6e0ea] bg-white px-3.5 py-[13px] text-[13px] leading-normal !text-[#071d33] outline-none transition placeholder:!text-[#9aa6b2] focus:!border-[#247dca] focus:shadow-[0_0_0_3px_rgba(36,125,202,0.10)] !text-[12px]"
        />
      </FieldLabel>
    </>
  );
}
