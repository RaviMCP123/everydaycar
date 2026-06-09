import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/src/components/ui/Icon";
import { resolveMediaUrl } from "@/lib/images";

type Service = {
  title: string;
  description: string;
  image: string;
  number: string;
  reversed: boolean;
  bullets: readonly string[];
};

export function ServiceCard({ service }: { service: Service }) {
  const imageSrc = service.image?.trim()
    ? resolveMediaUrl(service.image)
    : service.image;
  return (
    <article
      className={`grid overflow-hidden rounded-[8px] my-4 bg-white shadow-[0_18px_42px_rgba(18,42,74,0.1)] transition hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(18,42,74,0.14)] ${
        service.reversed ? "lg:grid-cols-[66%_34%]" : "lg:grid-cols-[34%_66%]"
      }`}
    >
      <div className={`relative min-h-[230px] lg:min-h-[260px] ${service.reversed ? "lg:order-2" : ""}`}>
        <Image
          src={imageSrc}
          alt={service.title}
          fill
          sizes="(max-width: 1024px) 100vw, 380px"
          className="object-cover"
        />
        <span className="absolute bottom-7 left-8 text-[42px] font-bold leading-none text-white/65">
          {service.number}
        </span>
      </div>
      <div className="flex flex-col justify-center gap-6 p-6 md:px-9 md:py-8">
        <h2 className="text-[18px] font-bold leading-tight !text-[var(--color-primary-navy)]">
          {service.title}
        </h2>
        <p className="mt-3 max-w-[560px] text-[14px] leading-[1.65] !text-[var(--color-muted-text)]">
          {service.description}
        </p>
        <ul className="mt-5 space-y-2 flex flex-col gap-1">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-center gap-3 text-[12px] leading-5 !text-[#071d33]"
            >
              <Icon
                name="arrowRight"
                className="h-[12px] w-[12px] shrink-0 !text-[var(--color-button-blue)]"
              />
              {bullet}
            </li>
          ))}
        </ul>
        <Link
          href="#"
          className="mt-4 inline-flex w-fit items-center gap-2 text-[11px] font-bold !text-[#1E73BE] transition hover:gap-3"
        >
          Learn More <Icon name="arrowRight" className="h-[13px] w-[13px]" />
        </Link>
      </div>
    </article>
  );
}
