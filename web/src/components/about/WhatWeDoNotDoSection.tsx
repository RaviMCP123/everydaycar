type WhatWeDoNotDoSectionProps = {
  title?: string;
  text?: string;
};

export function WhatWeDoNotDoSection({ title, text }: WhatWeDoNotDoSectionProps) {
  const resolvedTitle = title?.trim();
  const resolvedText = text?.trim();

  if (!resolvedTitle && !resolvedText) {
    return null;
  }

  return (
    <section className="bg-white py-4 md:pb-14">
      <div className="container flex justify-center">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#0b3a66] to-[#1d6fa5]" />

          {resolvedTitle ? (
            <h2 className="mb-4 text-xl font-bold text-[#0b3a66] md:text-2xl">
              {resolvedTitle}
            </h2>
          ) : null}

          {resolvedText ? (
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              {resolvedText}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
