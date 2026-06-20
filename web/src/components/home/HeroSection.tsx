import Image from "next/image";
import Link from "next/link";
import { isUploadedCmsMedia } from "@/lib/cms/cms-uploaded-media";
import { resolveMediaUrl } from "@/lib/images";
import { Icon } from "@/src/components/ui/Icon";

type HeroSectionProps = {
  imageSrc?: string;
  kicker?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  badgeImages?: string[];
};

export function HeroSection(props: HeroSectionProps = {}) {
  const copy = {
    imageSrc: props.imageSrc?.trim() ? resolveMediaUrl(props.imageSrc) : "",
    kicker: props.kicker?.trim() || "",
    titleLine1: props.titleLine1?.trim() || "",
    titleLine2: props.titleLine2?.trim() || "",
    subtitle: props.subtitle?.trim() || "",
    primaryButtonText: props.primaryButtonText?.trim() || "",
    primaryButtonHref: props.primaryButtonHref?.trim() || "",
    secondaryButtonText: props.secondaryButtonText?.trim() || "",
    secondaryButtonHref: props.secondaryButtonHref?.trim() || "",
    badgeImages:
      props.badgeImages
        ?.filter((src) => isUploadedCmsMedia(src))
        .map((src) => resolveMediaUrl(src.trim()))
        .filter(Boolean) ?? [],
  };

  return (
    <section className="relative isolate min-h-[calc(100svh-var(--header-height))] overflow-hidden !bg-[var(--color-primary-navy)] text-white">
      {copy.imageSrc ? (
        <Image
          src={copy.imageSrc}
          alt="Everyday Car mechanics"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[42%_center] md:object-center"
        />
      ) : null}
      <div className="absolute inset-0 !bg-[linear-gradient(90deg,rgba(7,29,51,0.72)_0%,rgba(7,29,51,0.5)_42%,rgba(7,29,51,0.86)_70%,rgba(7,29,51,0.95)_100%)] md:!bg-[linear-gradient(90deg,_#071d330a_0%,_#071d3314_43%,_#071d33c2_66%,_#071d33f0_100%)]" />
      <div className="container relative z-10 flex min-h-[calc(100svh-var(--header-height))] items-stretch justify-end py-8 sm:py-10 md:py-12 lg:py-14">
        <div className="flex w-full max-w-[740px] flex-col justify-between gap-10 lg:w-[54%]">
          {copy.badgeImages.length > 0 ? (
            <div
              className="flex flex-wrap items-start gap-x-7 gap-y-4"
              aria-label="Customer review ratings"
            >
              {copy.badgeImages.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`Partner badge ${i + 1}`}
                  width={i === 1 ? 175 : 150}
                  height={i === 1 ? 76 : 70}
                  className={i === 1 ? "h-auto w-[160px]" : "h-auto w-[140px]"}
                />
              ))}
            </div>
          ) : (
            <div />
          )}
          <div className="flex min-h-[70%] flex-col gap-3.5 sm:gap-4 lg:gap-5">
            {copy.kicker ? (
              <p className="section-kicker !text-[var(--color-bright-blue)]">
                {copy.kicker}
              </p>
            ) : null}
            {copy.titleLine1 || copy.titleLine2 ? (
              <h1 className="text-[clamp(38px,5vw,58px)] leading-[1.06] tracking-normal !font-[var(--font-weight-bold)]">
                {copy.titleLine1}
                {copy.titleLine2 ? (
                  <span className="block !text-[var(--color-bright-blue)] !font-[var(--font-weight-bold)]">
                    {copy.titleLine2}
                  </span>
                ) : null}
              </h1>
            ) : null}
            {copy.subtitle ? (
              <p className="max-w-[620px] text-[16px] font-medium leading-7 text-white/78">
                {copy.subtitle}
              </p>
            ) : null}
            {copy.primaryButtonText ||
            copy.secondaryButtonText ? (
              <div className="mt-2 flex flex-col gap-3 sm:mt-4 sm:flex-row lg:mt-5">
                {copy.primaryButtonText && copy.primaryButtonHref ? (
                  <Link
                    href={copy.primaryButtonHref}
                    className="btn btn-primary !font-semibold"
                  >
                    {copy.primaryButtonText}
                    <Icon name="arrowRight" />
                  </Link>
                ) : null}
                {copy.secondaryButtonText && copy.secondaryButtonHref ? (
                  <Link
                    href={copy.secondaryButtonHref}
                    className="btn btn-outline !font-semibold"
                  >
                    <Icon name="location" />
                    {copy.secondaryButtonText}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
