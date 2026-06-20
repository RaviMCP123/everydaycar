"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/cms/parse-faq-content";

function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`fill-none stroke-current stroke-2 ${className}`}
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`fill-none stroke-current stroke-2 ${className}`}
    >
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

type FaqAccordionProps = {
  title?: string;
  items: FaqItem[];
};

export function FaqAccordion({ title, items }: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="flex justify-center">
      <section className="mx-auto max-w-3xl px-4 py-12">
        {title?.trim() ? (
          <h1 className="!mb-6 text-4xl font-bold">{title}</h1>
        ) : null}

        <div className="flex flex-col gap-4">
          {items.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={`${faq.question}-${index}`}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen ? "border-gray-400" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 bg-gray-50 px-5 py-4 text-left transition hover:bg-gray-100"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <MinusIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <PlusIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                <div
                  className={`overflow-hidden px-5 text-gray-700 transition-all duration-300 ${
                    isOpen ? "max-h-40 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
                  }`}
                >
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
