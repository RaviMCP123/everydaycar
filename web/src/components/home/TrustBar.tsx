import Image from "next/image";
import { isUploadedCmsMedia } from "@/lib/cms/cms-uploaded-media";
import { resolveMediaUrl } from "@/lib/images";

type TrustFeature = {
  title?: string;
  label?: string;
  image?: string;
};

type Feature = {
  title: string;
  image: string;
};

type TrustBarProps = {
  title?: string;
  features?: TrustFeature[];
};

function FeatureIcon({ feature }: { feature: Feature }) {
  return (
    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full !bg-[#286cf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-white/15">
      <Image
        src={feature.image}
        alt=""
        width={18}
        height={18}
        className="h-[18px] w-[18px] object-contain"
      />
    </span>
  );
}

function FeatureItem({ feature }: { feature: Feature }) {
  return (
    <li className="flex shrink-0 items-center gap-[11px] text-[12px] font-bold leading-tight text-white">
      <FeatureIcon feature={feature} />
      <span className="max-w-[100px] text-[12px] font-semibold leading-[1.2]">
        {feature.title}
      </span>
    </li>
  );
}

export function TrustBar({ title, features: customFeatures }: TrustBarProps = {}) {
  const resolvedFeatures: Feature[] = (customFeatures ?? [])
    .map((feature) => {
      const label = (feature.title || feature.label || "").trim();
      const rawImage = feature.image?.trim() || "";
      if (!label || !isUploadedCmsMedia(rawImage)) return null;
      const image = resolveMediaUrl(rawImage);
      if (!image) return null;
      return { title: label, image };
    })
    .filter((feature): feature is Feature => feature !== null);

  if (resolvedFeatures.length === 0 && !title?.trim()) {
    return null;
  }

  return (
    <section className="!bg-[var(--color-bright-blue)] py-9 text-white">
      <div className="container rounded-[20px] bg-white/20 px-7 py-[30px] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] md:px-9">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:items-center lg:gap-x-10 xl:gap-x-14">
          {title?.trim() ? (
            <p className="min-w-0 text-[16px] font-bold leading-[1.35]">
              {title}
            </p>
          ) : null}
          {resolvedFeatures.length > 0 ? (
            <ul className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-3 lg:justify-end xl:flex-nowrap">
              {resolvedFeatures.map((feature) => (
                <FeatureItem key={feature.title} feature={feature} />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
