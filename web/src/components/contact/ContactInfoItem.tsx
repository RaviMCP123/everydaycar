import type { ComponentProps, ReactNode } from "react";
import { Icon } from "@/src/components/ui/Icon";

type ContactInfoItemProps = {
  icon: ComponentProps<typeof Icon>["name"];
  title: string;
  children: ReactNode;
};

export function ContactInfoItem({ icon, title, children }: ContactInfoItemProps) {
  const iconClassName =
    icon === "location"
      ? "h-[19px] w-[19px] [filter:brightness(0)_saturate(100%)_invert(42%)_sepia(91%)_saturate(1380%)_hue-rotate(184deg)_brightness(86%)_contrast(91%)]"
      : "h-[19px] w-[19px]";

  return (
    <div className="flex items-start gap-4">
      <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full !bg-[#eef6ff] !text-[#247dca]">
        <Icon name={icon} className={iconClassName} />
      </span>
      <div>
        <h3 className="text-[14px] font-bold leading-[1.2] !text-[var(--color-primary-navy)]">
          {title}
        </h3>
        <div className="mt-[3px] text-[13px] leading-[1.45] !text-[#64748b]">
          {children}
        </div>
      </div>
    </div>
  );
}
