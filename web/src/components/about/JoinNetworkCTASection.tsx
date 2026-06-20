import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/src/components/ui/Icon";
import { images } from "@/src/image";

type JoinNetworkCTASectionProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

export function JoinNetworkCTASection({
  title,
  description,
  buttonText,
  buttonLink,
}: JoinNetworkCTASectionProps) {
  const copy = {
    title: title?.trim() || "",
    description: description?.trim() || "",
    buttonText: buttonText?.trim() || "",
    buttonLink: buttonLink?.trim() || "",
  };

  if (!copy.title && !copy.description && !copy.buttonText) {
    return null;
  }

  return (
    <section id="book" className="bg-white pb-16 md:pb-20">
      <div className="container rounded-[16px] !bg-[var(--color-primary-navy)] px-6 py-9 text-white shadow-[0_18px_42px_rgba(7,29,51,0.16)] md:px-11">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5 sm:gap-6">
            <span className="relative h-[50px] w-[50px] shrink-0">
              <Image
                src={images.handshakeIcon}
                alt=""
                fill
                sizes="50px"
                className="object-contain"
              />
            </span>
            <div className="flex flex-col gap-3">
              {copy.title ? (
                <p className="text-[20px] font-bold leading-tight text-white md:text-[22px]">
                  {copy.title}
                </p>
              ) : null}
              {copy.description ? (
                <h2 className="text-[14px] font-semibold leading-5 text-white/80 md:text-[16px]">
                  {copy.description}
                </h2>
              ) : null}
            </div>
          </div>
          {copy.buttonText && copy.buttonLink ? (
            <Link
              href={copy.buttonLink}
              className="btn btn-primary shrink-0 px-8 !font-bold md:min-w-[194px]"
            >
              {copy.buttonText} <Icon name="arrowRight" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
