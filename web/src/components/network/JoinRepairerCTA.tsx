import Link from "next/link";
import { Icon } from "@/src/components/ui/Icon";

type JoinRepairerCTAProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
};

export function JoinRepairerCTA({
  title,
  description,
  buttonText,
  buttonHref,
}: JoinRepairerCTAProps = {}) {
  return (
    <section className="flex items-center min-h-[250px] border-y !border-[#dfe8f2] !bg-[#f5f8fc] py-10 md:py-12">
      <div className="container">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-[clamp(20px,2.4vw,28px)] font-bold leading-tight !text-[var(--color-primary-navy)]">
              {title?.trim() || "Are you a repairer? Join our network."}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] !text-[#526170]">
              {description?.trim() ||
                "We're actively recruiting approved repairers across Victoria. If you operate a licensed repair facility and want a steady stream of referred work, we'd like to hear from you."}
            </p>
          </div>
          <Link
            href={buttonHref?.trim() || "/contact"}
            className="btn btn-primary min-h-0 shrink-0 rounded-[4px] px-5 py-3 text-[11px] font-bold md:w-auto"
          >
            {buttonText?.trim() || "Become a Partner"}{" "}
            <Icon name="arrowRight" className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
