import { getGoogleMapsDirectionsUrl } from "@/lib/maps";
import { Icon } from "@/src/components/ui/Icon";

type Repairer = {
  name: string;
  address: string;
  status?: string;
  link?: string;
};

export function NetworkCard({ repairer }: { repairer: Repairer }) {
  const mapsUrl =
    repairer.link?.trim() && /^https?:\/\//i.test(repairer.link.trim())
      ? repairer.link.trim()
      : getGoogleMapsDirectionsUrl(repairer.address);
  const status = repairer.status?.trim() || "Approved";

  return (
    <article className="flex min-h-[130px] flex-col justify-between rounded-[10px] border !border-[#e8eef5] bg-white px-5 py-6 shadow-[0_8px_24px_rgba(7,29,51,0.06)] transition hover:!border-[var(--color-button-blue)] hover:ring-1 hover:!ring-[rgba(30,115,190,0.15)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full !bg-[rgba(30,115,190,1)] text-white">
            <Icon name="location" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold leading-[1.35] !text-[var(--color-primary-navy)]">
              {repairer.name}
            </h3>
            <p className="mt-1 text-[13px] font-semibold leading-5 !text-[#56687a]">
              {repairer.address}
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] !bg-[#e9f8ef] px-3 py-2 text-[11px] font-bold uppercase leading-none !text-[#12b76a]">
          <Icon name="check" className="h-3.5 w-3.5" />
          {status}
        </span>
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Get directions to ${repairer.name}`}
        className="mt-5 inline-flex w-fit items-center gap-1 text-[11px] font-bold leading-none !text-[#247dca] transition hover:gap-2 hover:!text-[#1b6eb5]"
      >
        Get Directions <Icon name="arrowRight" className="h-[13px] w-[13px]" />
      </a>
    </article>
  );
}
