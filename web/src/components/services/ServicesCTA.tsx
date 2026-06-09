import Link from "next/link";
import { Icon } from "@/src/components/ui/Icon";

type ServicesCTAProps = {
  title?: string;
  buttonText?: string;
  buttonHref?: string;
};

// const DEFAULTS = {
//   title: "Ready to join the network?",
//   buttonText: "Book a Repair",
//   buttonHref: "/book-a-repair",
// } as const;

export function ServicesCTA({
  title,
  buttonText,
  buttonHref,
}: ServicesCTAProps = {}) {
  const copy = {
    title: title?.trim() || "",
    buttonText: buttonText?.trim() || "",
    buttonHref: buttonHref?.trim() || "",
  };

  return (
    <section className="bg-white pb-14 pt-0 md:pb-16">
      <div className="container flex max-w-[1120px] flex-col gap-5 rounded-[12px] border !border-[#e4eef7] !bg-[#f4f8fc] px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <h2 className="text-[20px] font-bold !text-[var(--color-primary-navy)]">
          {copy.title}
        </h2>
        <Link href={copy.buttonHref} className="btn btn-primary min-h-0 rounded-[5px] px-[18px] py-3 text-[13px] font-bold">
          {copy.buttonText} <Icon name="arrowRight" className="h-[13px] w-[13px]" />
        </Link>
      </div>
    </section>
  );
}
