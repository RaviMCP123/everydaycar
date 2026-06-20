import { getGoogleMapsEmbedUrl } from "@/lib/maps";

type ContactMapProps = {
  address?: string;
};

export function ContactMap({ address }: ContactMapProps) {
  const fullAddress = address?.trim();
  if (!fullAddress) {
    return null;
  }

  return (
    <div className="relative h-[min(420px,62vw)] w-full overflow-hidden border-y !border-[#e3eaf2] bg-white">
      <iframe
        title={`Map showing ${fullAddress}`}
        src={getGoogleMapsEmbedUrl(fullAddress)}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
