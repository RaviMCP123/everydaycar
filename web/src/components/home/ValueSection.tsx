type ValueSectionProps = {
  kicker?: string;
  title?: string;
  description?: string;
};

export function ValueSection({
  kicker,
  title,
  description,
}: ValueSectionProps = {}) {
  const copy = {
    kicker: kicker?.trim() || "",
    title: title?.trim() || "",
    description: description?.trim() || "",
  };

  if (!copy.kicker && !copy.title && !copy.description) {
    return null;
  }

  return (
    <section className="section-padding !bg-[var(--color-light-bg)] text-center">
      <div className="container flex max-w-[960px] flex-col items-center justify-center gap-4">
        {copy.kicker ? (
          <p className="section-kicker mb-4">{copy.kicker}</p>
        ) : null}
        {copy.title ? <h2 className="section-title">{copy.title}</h2> : null}
        {copy.description ? (
          <p className="section-copy mx-auto mt-5 max-w-[620px]">
            {copy.description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
