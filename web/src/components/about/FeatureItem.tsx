import Image from "next/image";
import { resolveMediaUrl } from "@/lib/images";

export function FeatureItem({
  image,
  title,
  text,
}: {
  image: string;
  title?: string;
  text: string;
}) {
  const iconSrc = image?.trim() ? resolveMediaUrl(image) : image;
  return (
    <article className="flex gap-6">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full !bg-[#eaf4ff]">
        <Image
          src={iconSrc}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 object-contain [filter:brightness(0)_saturate(100%)_invert(36%)_sepia(84%)_saturate(1120%)_hue-rotate(181deg)_brightness(91%)_contrast(92%)]"
        />
      </span>
      <div>
        {title?.trim() ? (
          <p className="mb-2 text-[16px] font-semibold leading-[1.3] !text-[#071d33]">
            {title}
          </p>
        ) : null}
        <p className="mt-1 max-w-[650px] text-[14px] font-normal leading-[1.55] !text-[#2f3742]">
          {text}
        </p>
      </div>
    </article>
  );
}
