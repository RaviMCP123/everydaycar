"use client";

import type { PageDetail } from "@/lib/api/types";
import { useCmsPage } from "@/lib/cms/use-cms-page";
import { isFaqPageTemplate } from "@/lib/cms/parse-faq-content";
import { isLegalPageTemplate } from "@/lib/cms/parse-legal-content";
import { isHomePageTemplate } from "@/lib/cms/parse-home-content";
import { FaqPageContent } from "@/src/components/faq/FaqPageContent";
import { LegalPageContent } from "@/src/components/legal/LegalPageContent";
import { HomePageContent } from "@/src/components/home/HomePageContent";
import { AboutPageContent } from "@/src/components/about/AboutPageContent";
import { ServicesPageContent } from "@/src/components/services/ServicesPageContent";
import { NetworkPageContent } from "@/src/components/network/NetworkPageContent";
import { ContactPageContent } from "@/src/components/contact/ContactPageContent";
import { RepairBookingPageContent } from "@/src/components/repair-booking/RepairBookingPageContent";
import { FindARepairerPageContent } from "@/src/components/find-a-repairer/FindARepairerPageContent";
import { CmsPageView } from "./CmsPageView";

type CmsPageLoaderProps = {
  slug: string;
  eyebrow?: string;
  /** Optional static-build snapshot; replaced by live API data on load. */
  initialPage?: PageDetail | null;
};

export function CmsPageLoader({
  slug,
  eyebrow,
  initialPage = null,
}: CmsPageLoaderProps) {
  const page = useCmsPage(slug, initialPage);

  if (!page) {
    return null;
  }

  const templateKey = (page.templateKey || "").trim().toLowerCase();

  if (isHomePageTemplate(page.templateKey)) {
    return <HomePageContent page={page} />;
  }

  if (templateKey === "about_template") {
    return <AboutPageContent page={page} />;
  }

  if (templateKey === "services_template") {
    return <ServicesPageContent page={page} />;
  }

  if (templateKey === "network_template" || templateKey === "our_network_template") {
    return <NetworkPageContent page={page} />;
  }

  if (templateKey === "contact_template") {
    return <ContactPageContent page={page} />;
  }

  if (templateKey === "book_repair_template") {
    return <RepairBookingPageContent page={page} />;
  }

  if (templateKey === "find_a_repairer_template") {
    return <FindARepairerPageContent page={page} />;
  }

  if (isLegalPageTemplate(page.templateKey)) {
    return <LegalPageContent page={page} />;
  }

  if (isFaqPageTemplate(page.templateKey)) {
    return <FaqPageContent page={page} />;
  }

  return <CmsPageView page={page} slug={slug} eyebrow={eyebrow} />;
}
