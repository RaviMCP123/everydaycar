import Image from "next/image";
import { images } from "@/src/image";

type IconName =
  | "arrowRight"
  | "calendar"
  | "car"
  | "check"
  | "clock"
  | "headset"
  | "lightning"
  | "location"
  | "mail"
  | "phone"
  | "search"
  | "shield"
  | "spark"
  | "tools"
  | "tow";

const paths: Record<Exclude<IconName, "location">, string[]> = {
  arrowRight: ["M5 12h14", "M13 6l6 6-6 6"],
  calendar: ["M7 3v3M17 3v3M4 8h16M5 5h14v16H5z"],
  car: ["M5 14l1.8-5h10.4L19 14", "M6 17h.1M18 17h.1", "M4 14h16v5H4z"],
  check: ["M20 6L9 17l-5-5"],
  clock: ["M12 4a8 8 0 100 16 8 8 0 000-16z", "M12 8v4l3 2"],
  headset: [
    "M5 13v-1a7 7 0 0114 0v1",
    "M5 13h3v5H5zM16 13h3v5h-3z",
    "M16 18c0 1.4-1.4 2.5-4 2.5",
  ],
  lightning: ["M13 2L4 14h7l-1 8 9-12h-7l1-8z"],
  mail: ["M4 6h16v12H4z", "M4 7l8 6 8-6"],
  phone: [
    "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.4 19.4 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.4 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0122 16.9z",
  ],
  search: ["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.4-4.4"],
  shield: ["M12 3l7 3v5c0 4.3-2.8 8.2-7 10-4.2-1.8-7-5.7-7-10V6l7-3z"],
  spark: ["M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"],
  tools: ["M14.7 6.3l3-3 3 3-3 3", "M17.7 9.3L9 18l-3 1 1-3 8.7-8.7"],
  tow: ["M4 17h9v-6H7l-3 3v3z", "M13 17h7v-4l-2-3h-5", "M7 19h.1M17 19h.1"],
};

export function Icon({
  name,
  className = "h-[15px] w-[15px]",
}: {
  name: IconName;
  className?: string;
}) {
  if (name === "location") {
    return (
      <Image
        src={images.location}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`fill-none stroke-current stroke-[2.3] ${className}`}
    >
      {paths[name].map((path) => (
        <path key={path} d={path} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
