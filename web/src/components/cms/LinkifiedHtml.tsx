"use client";

import { useEffect, useMemo, useRef } from "react";
import { linkifyContactInfoInHtml, normalizeCmsHtml } from "@/lib/cms/content";

type LinkifiedHtmlProps = {
  html: string;
  className?: string;
  /** When true, only runs linkify (legal pages already normalize elsewhere). */
  linkifyOnly?: boolean;
};

function toTelHref(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }
  if (digits.startsWith("61")) {
    return `tel:+${digits}`;
  }
  return `tel:${digits}`;
}

function isPhoneLike(value: string): boolean {
  const trimmed = value.trim();
  const digitCount = trimmed.replace(/[^\d]/g, "").length;
  return digitCount >= 8 && /^[\d+\s()/-]+$/.test(trimmed);
}

function enhanceContactLinks(container: HTMLElement) {
  container.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    const rawHref = anchor.getAttribute("href")?.trim() || "";
    if (!rawHref) return;

    let href = rawHref;
    if (/^https?:\/\/([^/]+@[^/]+)$/i.test(href)) {
      href = `mailto:${href.replace(/^https?:\/\//i, "")}`;
    } else if (!/^(?:mailto:|tel:|https?:|#|\/)/i.test(href)) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href)) {
        href = `mailto:${href}`;
      } else if (isPhoneLike(href)) {
        href = toTelHref(href);
      }
    }

    if (href !== rawHref) {
      anchor.setAttribute("href", href);
    }

    if (/^(?:mailto:|tel:)/i.test(href)) {
      anchor.classList.add("cms-contact-link");
      anchor.removeAttribute("style");
    }
  });
}

export function LinkifiedHtml({
  html,
  className = "",
  linkifyOnly = false,
}: LinkifiedHtmlProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const processedHtml = useMemo(() => {
    const trimmed = html.trim();
    if (!trimmed) return "";
    if (linkifyOnly) {
      return linkifyContactInfoInHtml(trimmed);
    }
    return normalizeCmsHtml(trimmed);
  }, [html, linkifyOnly]);

  useEffect(() => {
    if (containerRef.current) {
      enhanceContactLinks(containerRef.current);
    }
  }, [processedHtml]);

  if (!processedHtml) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
