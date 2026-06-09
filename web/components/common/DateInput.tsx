"use client";

import { useRef } from "react";
import { formatDateToDisplay } from "@/lib/date";
import { Icon } from "@/src/components/ui/Icon";

interface DateInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  max?: string;
  min?: string;
}

export function DateInput({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  error,
  max,
  min,
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayValue = formatDateToDisplay(value);

  const openCalendar = () => {
    const input = inputRef.current;

    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.click();
      input.focus();
    }
  };

  return (
    <label htmlFor={id} className="block py-2">
      <span className="!mb-2 block text-[12px] font-bold !text-[#071d33]">
        {label}
      </span>

      <span className="relative block">
        {/* Clickable left calendar icon */}
        <button
          type="button"
          onClick={openCalendar}
          className="absolute left-3 top-1/2 z-30 flex h-5 w-5 -translate-y-1/2 items-center justify-center"
          aria-label="Open calendar"
        >
          <Icon
            name="calendar"
            className="h-4 w-4 !text-[#7a8797]"
          />
        </button>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="date"
          value={value}
          max={max}
          min={min}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className="peer absolute inset-0 z-10 h-[38px] w-full cursor-pointer opacity-0"
        />

        <span
          aria-hidden="true"
          onClick={openCalendar}
          className={`flex h-[38px] w-full cursor-pointer items-center rounded-[7px] border bg-white pl-[38px] pr-[14px] text-[13px] outline-none transition ${
            error
              ? "!border-[#fda4af]"
              : "!border-[#d6e0ea] peer-focus:!border-[#247dca] peer-focus:shadow-[0_0_0_3px_rgba(36,125,202,0.10)]"
          } ${displayValue ? "!text-[#071d33]" : "!text-[#9aa6b2]"}`}
        >
          {displayValue || "DD / MM / YYYY"}
        </span>
      </span>

      {error ? (
        <span className="mt-1.5 block text-[12px] !text-[#be123c]">
          {error}
        </span>
      ) : null}
    </label>
  );
}