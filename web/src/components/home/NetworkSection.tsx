import Link from "next/link";
import {
  NetworkTabs,
  type NetworkTabRepairer,
} from "@/src/components/network/NetworkTabs";

type NetworkSectionProps = {
  title?: string;
  repairers?: NetworkTabRepairer[];
};

const HOME_LIMIT = 6;

export function NetworkSection({ title, repairers = [] }: NetworkSectionProps = {}) {
  return (
    <section id="network" className="section-padding bg-white">
      <div className="container">
        <h2 className="section-title text-center">
          {title?.trim() || "Find an EverydayCar Repair Centre"}
        </h2>
        <NetworkTabs
          repairers={repairers}
          limit={HOME_LIMIT}
          gridClassName="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        />
        <div className="!mt-10 flex justify-center">
          <Link
            href="/our-network"
            className="btn btn-primary"
            aria-label="See all locations in our repairer network"
          >
            See all Location
          </Link>
        </div>
      </div>
    </section>
  );
}
