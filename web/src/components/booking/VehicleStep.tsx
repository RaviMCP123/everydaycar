"use client";

import { RadioPill } from "@/src/components/booking/RadioPill";

const inputClass =
  "h-[38px] w-full rounded-[7px] border !border-[#d6e0ea] bg-white px-3.5 text-[13px] !text-[#071d33] outline-none transition placeholder:!text-[#9aa6b2] focus:!border-[#247dca] focus:shadow-[0_0_0_3px_rgba(36,125,202,0.10)] !text-[12px]";
const errorFieldClass = "!border-[#fda4af] focus:!border-[#fda4af]";

type BookingValues = Record<string, string>;

type StepProps = {
  errors: Partial<Record<string, string>>;
  onChange: (name: string, value: string) => void;
  values: BookingValues;
};

function Field({
  error,
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  error?: string;
  label: string;
  name: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block py-2">
      <span className="!mb-2 block text-[12px] font-bold !text-[#071d33]">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.name, event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ${error ? errorFieldClass : ""}`}
        aria-invalid={Boolean(error)}
      />
      {error ? <span className="mt-1.5 block text-[12px] !text-[#be123c]">{error}</span> : null}
    </label>
  );
}

export function VehicleStep({ errors, onChange, values }: StepProps) {
  const atFault = values.otherDriverAtFault || "yes";

  return (
    <>
      <div className="grid gap-[18px] md:grid-cols-2">
        <Field
          label="Vehicle make *"
          name="vehicleMake"
          placeholder="e.g., Toyota"
          value={values.vehicleMake || ""}
          error={errors.vehicleMake}
          onChange={onChange}
        />
        <Field
          label="Vehicle model *"
          name="vehicleModel"
          placeholder="e.g., Corolla"
          value={values.vehicleModel || ""}
          error={errors.vehicleModel}
          onChange={onChange}
        />
        <Field
          label="Year *"
          name="vehicleYear"
          placeholder="YYYY"
          value={values.vehicleYear || ""}
          error={errors.vehicleYear}
          onChange={onChange}
        />
        <Field
          label="Registration number *"
          name="registrationNumber"
          placeholder="e.g., ABC 123"
          value={values.registrationNumber || ""}
          error={errors.registrationNumber}
          onChange={onChange}
        />
      </div>

      <Field
        label="Colour (optional)"
        name="vehicleColour"
        placeholder="e.g., Silver"
        value={values.vehicleColour || ""}
        onChange={onChange}
      />

      <div>
        <p className="!mb-2 text-[12px] font-bold !text-[#071d33]">
          Was the other driver at fault? *
        </p>
        <input type="hidden" name="otherDriverAtFault" value={atFault} />
        <div className="flex flex-wrap gap-2">
          <RadioPill
            label="Yes"
            value="yes"
            selected={atFault === "yes"}
            onClick={() => onChange("otherDriverAtFault", "yes")}
          />
          <RadioPill
            label="No"
            value="no"
            selected={atFault === "no"}
            onClick={() => onChange("otherDriverAtFault", "no")}
          />
          <RadioPill
            label="Not sure"
            value="not-sure"
            selected={atFault === "not-sure"}
            onClick={() => onChange("otherDriverAtFault", "not-sure")}
          />
        </div>
      </div>
    </>
  );
}
