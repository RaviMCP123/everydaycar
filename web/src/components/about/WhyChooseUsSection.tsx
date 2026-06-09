import { WhyChooseCard } from "@/src/components/about/WhyChooseCard";

type WhyCard = {
  image: string;
  imageAlt?: string;
  title: string;
  text: string;
};

type WhyChooseUsSectionProps = {
  title?: string;
  cards: WhyCard[];
};

export function WhyChooseUsSection({
  title,
  cards,
}: WhyChooseUsSectionProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="!bg-[#eef5fc] py-16 md:py-20">
      <div className="container flex flex-col gap-5">
        {title?.trim() ? (
          <h2 className="text-center text-[clamp(32px,4vw,38px)] font-bold leading-tight !text-[var(--color-primary-navy)]">
            {title}
          </h2>
        ) : null}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => (
            <WhyChooseCard
              key={item.title}
              image={item.image}
              imageAlt={item.imageAlt || item.title}
              title={item.title}
              text={item.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
