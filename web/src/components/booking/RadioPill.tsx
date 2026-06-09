"use client";

type RadioPillProps = {
  label: string;
  onClick: () => void;
  selected: boolean;
  value: string;
};

export function RadioPill({ label, onClick, selected, value }: RadioPillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-7 cursor-pointer items-center gap-[7px] rounded-[6px] border px-[13px] !text-[12px] font-bold transition ${
        selected
          ? "!border-[#247dca] !bg-[#247dca] text-white"
          : "!border-[#d6e0ea] bg-white !text-[#5f6f82]"
      }`}
      value={value}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full !text-[10px] ${
          selected ? "bg-white" : "border !border-[#b6c4d3] bg-white"
        }`}
      />
      {label}
    </button>
  );
}
