import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/src/components/ui/Icon";
import type { NavLink } from "@/lib/api/types";
import { DEFAULT_FOOTER_NAV } from "@/lib/cms/routes";
import { images } from "@/src/image";

type FooterProps = {
  footerLinks?: NavLink[];
  tagline?: string;
  address?: string;
  phone?: string;
  getInTouchTitle?: string;
  copyrightText?: string;
  privacyHref?: string;
  termsHref?: string;
};

export function Footer({
  footerLinks = DEFAULT_FOOTER_NAV,
  tagline = "Australia's trusted accident repair network - connecting drivers with quality approved repairers.",
  address,
  phone = "1300721840",
  getInTouchTitle = "Get In Touch",
  copyrightText = "(c) 2026 Everyday Car Repair Network Pty Ltd | everydaycar.com.au | ABN 68 634 541 058",
  privacyHref = "/contact",
  termsHref = "/terms-and-conditions",
}: FooterProps) {
  return (
    <footer id="contact" className="!bg-[#071d33] text-white">
      <div className="container grid gap-10 py-9 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.1fr_0.55fr] lg:gap-16">
        <div className="max-w-[360px] flex flex-col gap-3">
          <Link
            href="/"
            className="relative block h-[36px] w-[138px]"
            aria-label="everydaycar home"
          >
            <Image
              src={images.logo}
              alt="Everydaycar Repair Services"
              fill
              sizes="138px"
              className="object-contain object-left"
            />
          </Link>
          <p className="mt-5 text-[12px] leading-6 text-white/58">{tagline}</p>
        </div>

        <div className="lg:justify-self-center flex flex-col gap-4">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] !text-[var(--color-bright-blue)]">
            Navigation
          </h2>
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

        <div className="sm:col-span-2 lg:col-span-1 lg:justify-self-end flex flex-col gap-4">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] !text-[var(--color-bright-blue)]">
            {getInTouchTitle}
          </h2>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-[15px] font-bold !text-[var(--color-yellow)] transition hover:!text-[#ffd54d]"
          >
            <Icon name="phone" />
            {phone.length === 10
              ? phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")
              : phone}
          </a>
          {address ? (
            <p className="text-[12px] leading-5 text-white/58">{address}</p>
          ) : null}
        </div>
      </div>

      <div className="container flex flex-col gap-4 border-t border-white/10 py-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>{copyrightText}</p>
        <div className="flex items-center gap-4">
          <Link href={privacyHref} className="transition hover:text-white/75">
            Privacy Policy
          </Link>
          {/* <Link href={termsHref} className="transition hover:text-white/75">
            Terms and Conditions
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
