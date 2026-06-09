import Image from "next/image";
import { FeatureItem } from "@/src/components/about/FeatureItem";
import { images } from "@/src/image";
import { resolveMediaUrl } from "@/lib/images";

type OverviewItem = {
  image: string;
  title?: string;
  text: string;
};

type WhoWeAreSectionProps = {
  title?: string;
  imageSrc?: string;
  items: OverviewItem[];
};

export function WhoWeAreSection({
  title,
  imageSrc,
  items,
}: WhoWeAreSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const resolvedImageSrc = imageSrc?.trim()
    ? resolveMediaUrl(imageSrc)
    : images.whoWeAre;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-5">
          {title?.trim() ? (
            <h2 className="max-w-[620px] text-[clamp(32px,4vw,38px)] font-bold leading-[1.12] !text-[var(--color-primary-navy)]">
              {title}
            </h2>
          ) : null}
          <div className="mt-7 flex flex-col gap-7">
            {items.map((item) => (
              <FeatureItem
                key={item.title || item.text}
                image={item.image}
                title={item.title}
                text={item.text}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[14px] shadow-[0_18px_42px_rgba(7,29,51,0.14)] lg:justify-self-end">
          <Image
            src={resolvedImageSrc}
            alt=""
            width={760}
            height={620}
            sizes="(max-width: 1024px) 90vw, 520px"
            className="aspect-[0.93/1] h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
