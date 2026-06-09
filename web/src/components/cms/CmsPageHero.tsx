import Image from "next/image";
import { htmlToPlainText } from "@/lib/cms/content";
import { images } from "@/src/image";

type CmsPageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  compact?: boolean;
};

export function CmsPageHero({
  eyebrow = "Everydaycar",
  title,
  subtitle,
  imageSrc = images.networkHero,
  compact = false,
}: CmsPageHeroProps) {
  const plainSubtitle = subtitle ? htmlToPlainText(subtitle) : "";

  return (
    <section
      className={`relative isolate min-h-[300px] overflow-hidden !bg-[var(--color-primary-navy)] text-white ${
        compact ? "" : "md:min-h-[360px]"
      }`}
    >
      <div className="absolute bottom-0 right-0 top-0 hidden w-1/2 overflow-hidden md:block">
        <Image
          src={imageSrc}
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

      <div
        className={`container relative z-10 grid min-h-[300px] md:grid-cols-2 ${
          compact ? "" : "md:min-h-[360px]"
        }`}
      >
        <div className="flex items-center">
          <div className="flex w-full max-w-[520px] flex-col gap-3 py-12 pr-8">
            <div className="mb-[12px] flex items-center gap-3">
              <span className="h-px w-[30px] bg-white/70" />
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                {eyebrow}
              </p>
            </div>
            <h1 className="max-w-[520px] text-[clamp(34px,4vw,48px)] font-bold leading-[1.12] tracking-normal">
              {title}
            </h1>
            <span className="mt-[12px] block h-px w-[34px] bg-white/70" />
            {plainSubtitle ? (
              <p className="mt-[13px] max-w-[520px] text-[14px] font-medium leading-[24px] text-white/75">
                {plainSubtitle}
              </p>
            ) : null}
          </div>
        </div>
        <div className="relative min-h-[260px] overflow-hidden md:hidden">
          <Image
            src={imageSrc}
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
