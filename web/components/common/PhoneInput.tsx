"use client";

interface PhoneInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

function sanitizePhoneInput(value: string) {
  const allowedCharacters = value.replace(/[^\d\s]/g, "");
  let digitCount = 0;
  const startsWithZero = allowedCharacters.trimStart().startsWith("0");
  const maxDigits = startsWithZero ? 10 : 9;

  return Array.from(allowedCharacters)
    .filter((character) => {
      if (!/\d/.test(character)) {
        return true;
      }

      if (digitCount >= maxDigits) {
        return false;
      }

      digitCount += 1;
      return true;
    })
    .join("");
}

export function PhoneInput({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = "412 345 678",
}: PhoneInputProps) {
  return (
    <label htmlFor={id} className="block">
      <span className=" block text-[12px] font-semibold !text-[#071d33]">
        {label}
      </span>
      <span
        className={`flex h-[40px] w-full overflow-hidden rounded-[7px] border bg-white transition focus-within:shadow-[0_0_0_3px_rgba(36,125,202,0.10)] ${
          error
            ? "!border-[#fda4af] focus-within:!border-[#fda4af]"
            : "!border-[#d6e0ea] focus-within:!border-[#247dca]"
        }`}
      >
        <span className="flex h-full w-[58px] shrink-0 select-none items-center justify-center border-r !border-[#d6e0ea] !bg-[#f5f8fc] text-[13px] font-extrabold !text-[#071d33]">
          +61
        </span>
        <input
          id={id}
          name={name}
          type="tel"
          value={value}
          required={required}
          inputMode="numeric"
          autoComplete="tel"
          placeholder={placeholder}
          onChange={(event) => onChange(sanitizePhoneInput(event.target.value))}
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 border-0 bg-white px-3.5 text-[13px] !text-[#071d33] outline-none placeholder:!text-[#9aa6b2]"
        />
      </span>
      {error ? <span className="mt-1.5 block text-[12px] !text-[#be123c]">{error}</span> : null}
    </label>
  );
}
