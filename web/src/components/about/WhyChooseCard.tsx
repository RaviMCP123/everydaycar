import Image from "next/image";
import { resolveMediaUrl } from "@/lib/images";

export function WhyChooseCard({
  image,
  imageAlt,
  title,
  text,
}: {
  image: string;
  imageAlt: string;
  title: string;
  text: string;
}) {
  const iconSrc = image?.trim() ? resolveMediaUrl(image) : image;
  return (
    <article className="flex min-h-[330px] flex-col items-center gap-2 justify-center rounded-[8px] border !border-[#e3eaf2] bg-white px-8 py-10 text-center shadow-[0_12px_30px_rgba(7,29,51,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(18,42,74,0.1)]">
      <div className="mx-auto mb-8 grid size-[60px] place-items-center rounded-full p-2 !bg-[#eef5ff]">
        <Image
          src={iconSrc}
          alt={imageAlt}
          width={20}
          height={20}
          className="h-11 w-11 object-contain [filter:brightness(0)_saturate(100%)_invert(36%)_sepia(84%)_saturate(1120%)_hue-rotate(181deg)_brightness(91%)_contrast(92%)]"
        />
      </div>
      <h3 className="text-[20px] font-bold leading-[1.14] !text-[#071d33]">
        {title}
      </h3>
      <p className="mt-6 text-[14px] font-normal leading-[1.45] !text-[#111827]">
        {text}
      </p>
    </article>
  );
}
