"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/api/types";
import { DEFAULT_HEADER_NAV } from "@/lib/cms/routes";
import { Icon } from "@/src/components/ui/Icon";
import { images } from "@/src/image";

const HEADER_PHONE_DISPLAY = "1300 721 840";
const HEADER_PHONE_HREF = "tel:1300721840";

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function isRouteActive(pathname: string, href: string) {
  const currentPath = normalizePathname(pathname);
  const targetPath = normalizePathname(href);

  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function isNavigationItemActive(pathname: string, item: NavLink) {
  return (item.activeHrefs ?? [item.href]).some((href) => isRouteActive(pathname, href));
}

type HeaderProps = {
  navigation?: NavLink[];
};

export function Header({ navigation = DEFAULT_HEADER_NAV }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] w-full !bg-[#15395a] text-white shadow-[0_8px_18px_rgba(2,12,23,0.18)]">
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-[clamp(16px,2.5vw,32px)]">
        <Link
          href="/"
          className="relative block h-[clamp(34px,4vw,50px)] w-[clamp(128px,13vw,188px)] shrink-0"
          aria-label="everydaycar home"
        >
          <Image
            src={images.logo}
            alt="Everydaycar Repair Services"
            fill
            priority
            sizes="(max-width: 1024px) 136px, 200px"
            className="object-contain object-left"
          />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-[clamp(22px,3.2vw,58px)] lg:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative border-b-[3px] text-[clamp(10px,1vw,15px)] font-medium transition ${
                  isActive
                    ? "!border-[var(--color-button-blue)] font-bold !text-[var(--color-button-blue)]"
                    : "border-transparent text-white hover:!border-[var(--color-bright-blue)] hover:!text-[var(--color-bright-blue)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={HEADER_PHONE_HREF}
          className="hidden shrink-0 items-center gap-2 text-[clamp(10px,1.08vw,15px)] font-bold !text-[var(--color-yellow)] transition hover:!text-[#ffd54d] lg:inline-flex"
        >
          <Icon name="phone" />
          {HEADER_PHONE_DISPLAY}
        </a>

        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/18 transition hover:bg-white/8 lg:hidden"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <span className="h-0.5 w-5 rounded-full bg-white" />
          <span className="h-0.5 w-5 rounded-full bg-white" />
          <span className="h-0.5 w-5 rounded-full bg-white" />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 !bg-[#03101f]/72 transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      >
        <aside
          className={`fixed right-0 top-0 flex h-dvh w-[min(86vw,360px)] max-w-full transform-gpu flex-col overflow-y-auto !bg-[var(--color-primary-navy)] p-6 shadow-[-24px_0_60px_rgba(0,0,0,0.34)] transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="relative block h-10 w-36"
              aria-label="everydaycar home"
            >
              <Image
                src={images.logo}
                alt="Everydaycar Repair Services"
                fill
                sizes="144px"
                className="object-contain object-left"
              />
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/18 text-[16px] font-bold leading-none transition hover:bg-white/8"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = isNavigationItemActive(pathname, item);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`border-b-2 px-3 py-3 text-[16px] font-semibold transition hover:bg-white/8 ${
                    isActive
                      ? "!border-[var(--color-button-blue)] bg-white/8 !text-[var(--color-button-blue)]"
                      : "border-transparent text-white/84 hover:!border-[var(--color-bright-blue)] hover:!text-[var(--color-bright-blue)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <a
            href={HEADER_PHONE_HREF}
            onClick={() => setIsOpen(false)}
            className="mt-8 inline-flex items-center gap-2 text-[18px] font-bold !text-[var(--color-yellow)] transition hover:!text-[#ffd54d]"
          >
            <Icon name="phone" className="h-5 w-5" />
            {HEADER_PHONE_DISPLAY}
          </a>
        </aside>
      </div>
    </header>
  );
}
