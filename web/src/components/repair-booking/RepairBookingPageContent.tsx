"use client";

import Image from "next/image";
import type { PageDetail } from "@/lib/api/types";
import { useCmsPage } from "@/lib/cms/use-cms-page";
import { parseBookRepairStructuredContent } from "@/lib/cms/parse-book-repair-content";
import { PAGE_SLUGS } from "@/lib/cms/routes";
import { resolveMediaUrl } from "@/lib/images";
import { BookingSection } from "@/src/components/booking/BookingSection";
import { Icon } from "@/src/components/ui/Icon";

type RepairBookingPageContentProps = {
  page?: PageDetail | null;
};

export function RepairBookingPageContent({
  page: initialPage = null,
}: RepairBookingPageContentProps) {
  const page = useCmsPage(PAGE_SLUGS.bookARepair, initialPage);

  const structured =
    page?.content && typeof page.content === "object"
      ? parseBookRepairStructuredContent(page.content as Record<string, unknown>)
      : null;

  const heroImage = resolveMediaUrl(structured?.heroImage);
  const benefits = structured?.heroBenefits ?? [];
  const hasHeroCopy =
    Boolean(structured?.heroEyebrow?.trim()) ||
    Boolean(structured?.heroTitleLine1?.trim()) ||
    Boolean(structured?.heroTitleLine2?.trim()) ||
    Boolean(structured?.heroSubtitle?.trim());
  const hasSidebar =
    Boolean(structured?.whyUseTitle?.trim()) ||
    (structured?.whyUseBenefits && structured.whyUseBenefits.length > 0) ||
    Boolean(structured?.preferCallText?.trim()) ||
    Boolean(structured?.phoneNumber?.trim()) ||
    Boolean(structured?.callButtonText?.trim());

  return (
    <>
      {heroImage || hasHeroCopy || benefits.length > 0 ? (
        <section className="relative isolate min-h-[340px] overflow-hidden !bg-[var(--color-primary-navy)] text-white">
          {heroImage ? (
            <div className="absolute bottom-0 right-0 top-0 hidden w-1/2 overflow-hidden md:block">
              <Image
                src={heroImage}
                alt=""
                fill
                priority
                sizes="50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
            </div>
          ) : null}
          <div className="absolute bottom-0 left-0 top-0 w-full md:w-1/2">
            <div className="absolute inset-0 !bg-[radial-gradient(circle_at_18px_18px,rgba(30,115,190,0.24)_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>

          <div className="container relative z-10 grid min-h-[300px] md:grid-cols-2">
            <div className="flex items-center">
              <div className="flex w-full max-w-[560px] flex-col gap-3 py-12 pr-8">
                {structured?.heroEyebrow?.trim() ? (
                  <div className="mb-[12px] flex items-center gap-3">
                    <span className="h-px w-[30px] bg-white/70" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                      {structured.heroEyebrow}
                    </p>
                  </div>
                ) : null}
                {structured?.heroTitleLine1?.trim() ||
                structured?.heroTitleLine2?.trim() ? (
                  <h1 className="max-w-[620px] text-[clamp(32px,4vw,48px)] font-bold leading-[1.06] tracking-normal">
                    {structured?.heroTitleLine1}
                    {structured?.heroTitleLine2?.trim() ? (
                      <span className="block">{structured.heroTitleLine2}</span>
                    ) : null}
                  </h1>
                ) : null}
                <span className="mt-[12px] block h-px w-[34px] bg-white/70" />
                {structured?.heroSubtitle?.trim() ? (
                  <p className="mt-[13px] max-w-[560px] text-[14px] font-medium leading-[24px] text-white/75">
                    {structured.heroSubtitle}
                  </p>
                ) : null}
              </div>
            </div>
            {heroImage ? (
              <div className="relative min-h-[260px] overflow-hidden md:hidden">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 !bg-[linear-gradient(90deg,#0D1B2A_0%,rgba(13,27,42,0)_100%)]" />
              </div>
            ) : null}
          </div>
          {benefits.length > 0 ? (
            <div className="container relative z-10 flex flex-wrap justify-center gap-3 pb-6">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex min-h-9 items-center gap-2 rounded-[4px] border border-white/18 bg-white/12 px-5 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
                >
                  <Icon name="check" className="h-3 w-3 !text-[#12b76a]" />
                  {benefit}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <BookingSection
        sidebarContent={
          hasSidebar
            ? {
                title: structured?.whyUseTitle,
                benefits: structured?.whyUseBenefits,
                preferCallText: structured?.preferCallText,
                phoneNumber: structured?.phoneNumber,
                callButtonText: structured?.callButtonText,
              }
            : undefined
        }
      />
    </>
  );
}
