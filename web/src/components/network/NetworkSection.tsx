import {
  NetworkTabs,
  type NetworkTabRepairer,
} from "@/src/components/network/NetworkTabs";

type NetworkSectionProps = {
  repairers?: NetworkTabRepairer[];
};

export function NetworkSection({ repairers = [] }: NetworkSectionProps = {}) {
  return (
    <section className="!bg-[#f5f8fc] pb-14 pt-8 md:pb-16">
      <div className="container">
        <NetworkTabs
          repairers={repairers}
          gridClassName="mt-7 grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </section>
  );
}
