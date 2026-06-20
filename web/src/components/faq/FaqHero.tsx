import Image from "next/image";
import { images } from "@/src/image";
import { resolveMediaUrl } from "@/lib/images";

type FaqHeroProps = {
  imageSrc?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function FaqHero({
  imageSrc,
  eyebrow,
  title,
  subtitle,
}: FaqHeroProps) {
  const heroImage = imageSrc?.trim()
    ? resolveMediaUrl(imageSrc)
    : images.servicesHero;

  if (!title && !subtitle && !eyebrow && !imageSrc) {
    return null;
  }

  return (
    <section className="relative isolate min-h-[300px] overflow-hidden !bg-[var(--color-primary-navy)] text-white">
      <div className="absolute bottom-0 right-0 top-0 hidden w-1/2 overflow-hidden md:block">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
      </div>

      <div className="absolute bottom-0 left-0 top-0 w-full md:w-1/2">
        <div className="absolute inset-0 !bg-[radial-gradient(circle_at_18px_18px,rgba(30,115,190,0.24)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="container relative z-10 grid min-h-[300px] md:grid-cols-2">
        <div className="flex items-center">
          <div className="flex w-full max-w-[520px] flex-col gap-3 py-12 pr-8">
            {eyebrow?.trim() ? (
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-[30px] bg-white/70" />
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  {eyebrow}
                </p>
              </div>
            ) : null}
            {title?.trim() ? (
              <h1 className="max-w-[520px] text-[clamp(34px,4vw,48px)] font-bold leading-[1.12]">
                {title}
              </h1>
            ) : null}
            <span className="mt-3 block h-px w-[34px] bg-white/70" />
            {subtitle?.trim() ? (
              <p className="mt-3 max-w-[520px] text-[14px] font-medium leading-6 text-white/75">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-[260px] overflow-hidden md:hidden">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
        </div>
      </div>
    </section>
  );
}
