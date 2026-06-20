"use client";

import { useId, useRef } from "react";
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
  const labelId = useId();
  const displayValue = formatDateToDisplay(value);

  const openCalendar = () => {
    const input = inputRef.current;
    if (!input) return;

    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // Some browsers throw if showPicker is not allowed in this context.
    }

    input.focus({ preventScroll: true });
    input.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCalendar();
    }
  };

  return (
    <div className="block py-2">
      <span
        id={labelId}
        className="!mb-2 block text-[12px] font-bold !text-[#071d33]"
      >
        {label}
      </span>

      <div
        role="button"
        tabIndex={0}
        aria-labelledby={labelId}
        onClick={openCalendar}
        onKeyDown={handleKeyDown}
        className="relative block cursor-pointer rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-[#247dca]/30"
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none flex h-[38px] w-full items-center rounded-[7px] border bg-white pl-[38px] pr-[14px] text-[13px] transition ${
            error
              ? "!border-[#fda4af]"
              : "!border-[#d6e0ea] focus-within:!border-[#247dca] focus-within:shadow-[0_0_0_3px_rgba(36,125,202,0.10)]"
          } ${displayValue ? "!text-[#071d33]" : "!text-[#9aa6b2]"}`}
        >
          {displayValue || "DD / MM / YYYY"}
        </span>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center"
        >
          <Icon name="calendar" className="h-4 w-4 !text-[#7a8797]" />
        </span>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="date"
          value={value}
          max={max}
          min={min}
          required={required}
          tabIndex={-1}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className="sr-only"
        />
      </div>

      {error ? (
        <span className="mt-1.5 block text-[12px] !text-[#be123c]">
          {error}
        </span>
      ) : null}
    </div>
  );
}
