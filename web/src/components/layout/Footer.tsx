import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/src/components/ui/Icon";
import type { NavLink } from "@/lib/api/types";
import { DEFAULT_FOOTER_NAV } from "@/lib/cms/routes";
import { buildMailtoHref, buildTelHref, formatPhoneDisplay } from "@/lib/phone";
import { images } from "@/src/image";

type FooterProps = {
  footerLinks?: NavLink[];
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  copyrightText?: string;
  privacyHref?: string;
  faqHref?: string;
  termsHref?: string;
};

export function Footer({
  footerLinks = DEFAULT_FOOTER_NAV,
  tagline,
  address,
  phone,
  email,
  copyrightText,
  privacyHref = "/privacy-policy",
  faqHref = "/faqs",
  termsHref = "/terms-and-conditions",
}: FooterProps) {
  const formattedPhone = phone ? formatPhoneDisplay(phone) : "";
  const phoneHref = phone ? buildTelHref(phone) : "";
  const emailHref = email ? buildMailtoHref(email) : "";

  return (
    <footer id="contact" className="!bg-[#071d33] text-white">
      <div className="container grid gap-10 py-9 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.1fr_0.55fr] lg:gap-16">
        <div className="flex max-w-[360px] flex-col gap-3">
          <Link
            href="/"
            className="relative block h-[36px] w-[138px]"
            aria-label="everydaycar home"
          >
            <Image
              src={images.logo}
              alt="everydaycar Repair Services"
              fill
              sizes="138px"
              className="object-contain object-left"
            />
          </Link>
          {tagline ? (
            <p className="mt-5 text-[12px] leading-6 text-white/58">{tagline}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:justify-self-center">
          <nav
            className="flex flex-wrap gap-x-7 gap-y-3"
            aria-label="Footer navigation"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] font-medium text-white/68 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1 lg:justify-self-end">
          {phone ? (
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 text-[15px] font-bold !text-[var(--color-yellow)] transition hover:!text-[#ffd54d]"
            >
              <Icon name="phone" />
              {formattedPhone}
            </a>
          ) : null}
          {address ? (
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold leading-5 text-white">
              <Icon name="location" className="h-[18px] w-[18px] shrink-0 text-white" />
              <span>{address}</span>
            </p>
          ) : null}
          {email ? (
            <a
              href={emailHref}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-white transition hover:text-white/90"
            >
              <Icon name="mail" className="h-[18px] w-[18px] text-white" />
              {email}
            </a>
          ) : null}
        </div>
      </div>

      <div className="container flex flex-col gap-4 border-t border-white/10 py-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
        {copyrightText ? <p>{copyrightText}</p> : null}
        <div className="flex items-center gap-4">
          <Link href={privacyHref} className="transition hover:text-white/75">
            Privacy Policy
          </Link>
          <Link href={faqHref} className="transition hover:text-white/75">
            FAQs
          </Link>
          {/* <Link href={termsHref} className="transition hover:text-white/75">
            Terms and Conditions
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
