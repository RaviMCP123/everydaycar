import type { ReactNode } from "react";

type BookingFormCardProps = {
  children: ReactNode;
  footer: ReactNode;
  stepBadge: string;
  title: string;
};

export function BookingFormCard({
  children,
  footer,
  stepBadge,
  title,
}: BookingFormCardProps) {
  return (
    <section className="mt-5 rounded-[12px] border !border-[#e3eaf2] bg-white p-5 shadow-[0_12px_30px_rgba(7,29,51,0.08)] flex flex-col gap-4">
      <div className="flex h-12 items-center justify-between rounded-[2px] !bg-[#071d33] px-[22px] text-white">
        <h2 className="text-[14px] font-bold">{title}</h2>
        <span className="rounded-full !bg-[#247dca] px-2.5 py-[5px] text-[11px] font-bold leading-none text-white">
          {stepBadge}
        </span>
      </div>
      <div className="flex flex-col gap-[18px]">{children}</div>
      <div className="mt-6 flex items-center justify-between gap-3">{footer}</div>
    </section>
  );
}
