import Image from "next/image";
import Link from "next/link";
import type { HomeJoinCtaContent } from "@/lib/cms/parse-home-content";
import { Icon } from "@/src/components/ui/Icon";
import { images } from "@/src/image";
import { resolveMediaUrl } from "@/lib/images";

export function JoinNetworkCTA({
  iconSrc,
  title,
  subtitle,
  buttonLabel,
  buttonHref,
}: HomeJoinCtaContent & { iconSrc?: string } = {}) {
  const copy = {
    iconSrc: iconSrc?.trim() ? resolveMediaUrl(iconSrc) : images.handshakeIcon,
    title: title?.trim() || "",
    subtitle: subtitle?.trim() || "",
    buttonLabel: buttonLabel?.trim() || "",
    buttonHref: buttonHref?.trim() || "",
  };

  if (!copy.title && !copy.subtitle && !copy.buttonLabel) {
    return null;
  }

  return (
    <section id="book" className="bg-white pb-16 md:pb-20">
      <div className="container rounded-[16px] !bg-[var(--color-primary-navy)] px-6 py-9 text-white shadow-[0_18px_42px_rgba(7,29,51,0.16)] md:px-11">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5 sm:gap-6">
            <span className="relative h-[50px] w-[50px] shrink-0">
              <Image
                src={copy.iconSrc}
                alt=""
                fill
                sizes="50px"
                className="object-contain"
              />
            </span>
            <div className="flex flex-col gap-1">
              {copy.title ? (
                <h2 className="text-[clamp(22px,3vw,28px)] font-bold leading-tight">
                  {copy.title}
                </h2>
              ) : null}
              {copy.subtitle ? (
                <p className="text-[13px] leading-6 text-white/72">
                  {copy.subtitle}
                </p>
              ) : null}
            </div>
          </div>
          {copy.buttonLabel && copy.buttonHref ? (
            <Link
              href={copy.buttonHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] !bg-[var(--color-button-blue)] px-6 text-[13px] font-bold text-white transition hover:!bg-[var(--color-bright-blue)]"
            >
              {copy.buttonLabel}
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
