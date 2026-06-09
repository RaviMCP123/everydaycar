import Image from "next/image";
import { resolveMediaUrl } from "@/lib/images";

type AboutHeroProps = {
  imageSrc?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function HeroSection({
  imageSrc,
  eyebrow,
  title,
  subtitle,
}: AboutHeroProps) {
  const copy = {
    imageSrc: imageSrc?.trim() ? resolveMediaUrl(imageSrc) : "",
    eyebrow: eyebrow?.trim() || "",
    title: title?.trim() || "",
    subtitle: subtitle?.trim() || "",
  };

  if (!copy.title && !copy.subtitle && !copy.eyebrow && !copy.imageSrc) {
    return null;
  }

  return (
    <section className="relative isolate min-h-[300px] overflow-hidden !bg-[var(--color-primary-navy)] text-white md:min-h-[360px]">
      {copy.imageSrc ? (
        <div className="absolute bottom-0 right-0 top-0 hidden w-1/2 overflow-hidden md:block">
          <Image
            src={copy.imageSrc}
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
        </div>
      ) : null}
      <div className="absolute bottom-0 left-0 top-0 w-full md:w-1/2">
        <div className="absolute inset-0 !bg-[radial-gradient(circle_at_18px_18px,rgba(30,115,190,0.24)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="container relative z-10 grid min-h-[300px] md:grid-cols-2 md:min-h-[360px]">
        <div className="flex items-center">
          <div className="flex w-full max-w-[620px] flex-col gap-3 py-12 pr-8">
            {copy.eyebrow ? (
              <div className="mb-[12px] flex items-center gap-3">
                <span className="h-px w-[30px] bg-white/70" />
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  {copy.eyebrow}
                </p>
              </div>
            ) : null}
            {copy.title ? (
              <h1 className="max-w-[620px] text-[clamp(32px,4vw,44px)] font-bold leading-[1.06] tracking-normal">
                {copy.title}
              </h1>
            ) : null}
            <span className="mt-[12px] block h-px w-[34px] bg-white/70" />
            {copy.subtitle ? (
              <p className="mt-[13px] max-w-[520px] text-[14px] font-medium leading-[24px] text-white/75">
                {copy.subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {copy.imageSrc ? (
          <div className="relative min-h-[260px] overflow-hidden md:hidden">
            <Image
              src={copy.imageSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
