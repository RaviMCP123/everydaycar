import { Icon } from "@/src/components/ui/Icon";

type WhyUseCardProps = {
  title?: string;
  benefits?: string[];
  preferCallText?: string;
  phoneNumber?: string;
  callButtonText?: string;
};

export function WhyUseCard({
  title,
  benefits: items,
  preferCallText,
  phoneNumber,
  callButtonText,
}: WhyUseCardProps = {}) {
  const list = (items ?? []).filter((item) => item.trim());
  const phone = phoneNumber?.trim() || "";
  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : "";
  const hasCallSection =
    Boolean(preferCallText?.trim()) ||
    Boolean(phone) ||
    Boolean(callButtonText?.trim());

  if (!title?.trim() && list.length === 0 && !hasCallSection) {
    return null;
  }

  return (
    <aside className="rounded-[12px] border !border-[#e3eaf2] bg-white px-[22px] py-6 shadow-[0_10px_26px_rgba(7,29,51,0.06)] flex flex-col gap-3">
      {title?.trim() ? (
        <h2 className="mb-[18px] text-[16px] font-bold !text-[#071d33]">
          {title}
        </h2>
      ) : null}
      {list.length > 0 ? (
        <div className="flex flex-col gap-3 border-b !border-[#edf2f7] pb-5">
          {list.map((benefit) => (
            <p
              key={benefit}
              className="flex gap-3 text-[13px] leading-[1.4] !text-[#334155]"
            >
              <Icon
                name="check"
                className="mt-0.5 h-[15px] w-[15px] !text-[#22b573]"
              />
              {benefit}
            </p>
          ))}
        </div>
      ) : null}
      {preferCallText?.trim() ? (
        <p className="mt-6 text-[12px] !text-[#7a8797]">{preferCallText}</p>
      ) : null}
      {phone ? (
        <a
          href={phoneHref}
          className="mb-3 mt-1 block text-[24px] font-bold leading-tight !text-[#247dca]"
        >
          {phone}
        </a>
      ) : null}
      {callButtonText?.trim() && phoneHref ? (
        <a
          href={phoneHref}
          className="flex h-[38px] w-full items-center justify-center gap-2 rounded-[6px] !bg-[#247dca] text-[12px] font-bold text-white transition hover:!bg-[#1b6eb5] !text-white"
        >
          <Icon name="phone" className="h-3.5 w-3.5" />
          {callButtonText}
        </a>
      ) : null}
    </aside>
  );
}
