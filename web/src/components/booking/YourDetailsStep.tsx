import { PhoneInput } from "@/components/common/PhoneInput";

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
  help,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  error?: string;
  help?: string;
  label: string;
  name: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block py-2">
      <span className="!mb-2 block text-[12px] font-bold !text-[#071d33]">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.name, event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ${error ? errorFieldClass : ""}`}
        aria-invalid={Boolean(error)}
      />
      {help ? <span className="mt-2 block text-[11px] !text-[#8a97a5]">{help}</span> : null}
      {error ? <span className="mt-1.5 block text-[12px] !text-[#be123c]">{error}</span> : null}
    </label>
  );
}

export function YourDetailsStep({ errors, onChange, values }: StepProps) {
  return (
    <>
      <Field
        label="Full name *"
        name="fullName"
        placeholder="Enter your full name"
        value={values.fullName || ""}
        error={errors.fullName}
        onChange={onChange}
      />
      <div>
        <PhoneInput
          id="mobileNumber"
          label="Mobile number *"
          name="mobileNumber"
          value={values.mobileNumber || ""}
          placeholder="412 345 678"
          required
          error={errors.mobileNumber}
          onChange={(value) => onChange("mobileNumber", value)}
        />
        <span className="-mt-1 block text-[11px] !text-[#8a97a5]">
          This is the number we call back on
        </span>
      </div>
      <Field
        label="Email address (optional)"
        name="email"
        placeholder="name@email.com"
        type="email"
        value={values.email || ""}
        error={errors.email}
        onChange={onChange}
      />

      <label className="block py-2">
        <span className="!mb-2 block text-[12px] font-bold !text-[#071d33]">
          Preferred callback time
        </span>
        <select
          name="callbackTime"
          value={values.callbackTime || "As soon as possible"}
          onChange={(event) => onChange(event.target.name, event.target.value)}
          className={`${inputClass} appearance-none !text-[#64748b]`}
        >
          <option>As soon as possible</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>
      </label>

      <Field
        label="Your suburb / postcode *"
        name="suburb"
        placeholder="e.g., Fitzroy VIC 3065"
        value={values.suburb || ""}
        help="Used to match nearest repairer"
        error={errors.suburb}
        onChange={onChange}
      />
    </>
  );
}
