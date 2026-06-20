import { Icon } from "@/src/components/ui/Icon";

type SearchNetworkProps = {
  value?: string;
  placeholder?: string;
  buttonText?: string;
  isDetectingLocation?: boolean;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onSubmit?: () => void;
};

export function SearchNetwork({
  value = "",
  placeholder = "Search by suburb or postcode...",
  buttonText = "Search",
  isDetectingLocation = false,
  onValueChange,
  onFocus,
  onSubmit,
}: SearchNetworkProps = {}) {
  const handleSubmit = () => {
    onSubmit?.();
  };

  const inputPlaceholder = isDetectingLocation
    ? "Detecting your location..."
    : placeholder;

  return (
    <section className="flex items-start !bg-[#f5f8fc] pt-[34px]">
      <div className="container">
        <div className="flex min-h-[64px] flex-col gap-3 rounded-[10px] border !border-[#dfe8f2] bg-white p-[10px] shadow-[0_16px_34px_rgba(7,29,51,0.08)] md:flex-row md:items-center">
          <input
            type="text"
            aria-label="Search by suburb or postcode"
            placeholder={inputPlaceholder}
            value={value}
            onChange={(event) => onValueChange?.(event.target.value)}
            onFocus={onFocus}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
            className="h-10 flex-1 rounded-[6px] border-0 px-5 !text-[12px] !text-[var(--color-primary-navy)] outline-none transition placeholder:!text-[#667085] focus:!bg-[#f8fbfe]"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDetectingLocation}
            className="btn btn-primary h-10 min-h-0 rounded-[6px] px-5 text-[12px] font-bold shadow-[0_8px_18px_rgba(30,115,190,0.26)] disabled:opacity-70 md:w-auto"
          >
            <Icon name="search" className="h-[13px] w-[13px]" />
            {isDetectingLocation ? "Detecting..." : buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
