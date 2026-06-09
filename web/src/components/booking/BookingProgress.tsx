interface BookingProgressProps {
  activeStep?: number;
}

const steps = [
  { id: 1, label: "About the Accident" },
  { id: 2, label: "Your Vehicle" },
  { id: 3, label: "Your Details" },
] as const;

export function BookingProgress({ activeStep = 1 }: BookingProgressProps) {
  return (
    <div className="flex h-[54px] w-full max-w-[1180px] items-center overflow-x-auto rounded-lg border !border-[#dde6ef] bg-white px-4 shadow-[0_4px_14px_rgba(7,29,51,0.04)] [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-[620px] flex-1 items-center">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;

          return (
            <div key={step.id} className="contents">
              <div className="flex shrink-0 items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-bold ${
                    isActive
                      ? "!border-[#247dca] !bg-[#247dca] text-white"
                      : "!border-[#cbd5e1] bg-white !text-[#7a8797]"
                  }`}
                >
                  {step.id}
                </span>
                <span
                  className={`whitespace-nowrap text-[13px] leading-none ${
                    isActive
                      ? "font-bold !text-[#071d33]"
                      : "font-medium !text-[#334155]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <span className="mx-3.5 h-px flex-1 !bg-[#d6dee8]" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
