import { ServiceCard } from "@/src/components/services/ServiceCard";

type Service = {
  title: string;
  description: string;
  image: string;
  number: string;
  reversed: boolean;
  bullets: readonly string[];
};

type ServicesListSectionProps = {
  title?: string;
  items?: Service[];
};

export function ServicesListSection({ title, items }: ServicesListSectionProps = {}) {
  if (!items?.length) {
    return null;
  }

  const sectionTitle = title?.trim();

  return (
    <section className="bg-white py-14 md:py-16">
      <div className="container flex flex-col items-center gap-6">
        {sectionTitle ? (
          <h2 className="relative mx-auto mb-3 w-fit text-center text-[28px] font-bold leading-tight !text-[var(--color-primary-navy)] after:absolute after:bottom-[-8px] after:left-1/2 after:h-px after:w-[42px]">
            {sectionTitle}
          </h2>
        ) : null}
        <div className="mx-auto mt-8 flex w-full max-w-[980px] flex-col gap-6">
          {items.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
