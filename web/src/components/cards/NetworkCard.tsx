import { getGoogleMapsDirectionsUrl } from "@/lib/maps";
import { Icon } from "@/src/components/ui/Icon";

export type NetworkCardRepairer = {
  status: string;
  address: string;
  link?: string;
  highlighted?: boolean;
};

export function NetworkCard({ repairer }: { repairer: NetworkCardRepairer }) {
  const mapsUrl =
    repairer.link?.trim() && /^https?:\/\//i.test(repairer.link.trim())
      ? repairer.link.trim()
      : getGoogleMapsDirectionsUrl(repairer.address);

  return (
    <article className="flex min-h-[138px] flex-col gap-4 rounded-[10px] border !border-[#e3eaf2] bg-white px-6 py-6 transition hover:!border-[var(--color-button-blue)]">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full !bg-[#e7f8ed] px-3 py-1 text-[11px] font-bold tracking-normal !text-[#168a3f]">
        <Icon name="check" className="h-[10px] w-[10px]" />
        {repairer.status}
      </span>
      <p className="flex gap-2 text-[14px] font-bold leading-6 !text-[var(--color-primary-navy)]">
        <span className="mt-1 grid size-4 shrink-0 place-items-center !text-[var(--color-button-blue)]">
          <Icon name="location" className="h-6 w-6 pt-0.5 [filter:brightness(0)_saturate(100%)_invert(42%)_sepia(91%)_saturate(1380%)_hue-rotate(184deg)_brightness(86%)_contrast(91%)]" />
        </span>
        {repairer.address}
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Get directions to ${repairer.address}`}
        className="mt-auto inline-flex w-fit items-center gap-1 text-[11px] font-bold !text-[#247dca] transition hover:gap-2 hover:!text-[#1b6eb5]"
      >
        Get Directions
        <Icon name="arrowRight" className="h-[13px] w-[13px]" />
      </a>
    </article>
  );
}
