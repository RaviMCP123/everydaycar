"use client";

import { useEffect, useId, useRef } from "react";

interface SuccessModalProps {
  open: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
}

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function SuccessModal({
  open,
  title = "Thank you!",
  message = "Your request has been submitted successfully. Our team will contact you shortly.",
  buttonText = "Done",
  onClose,
}: SuccessModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(7,29,51,0.62)] px-4 py-6 backdrop-blur-[2px]"
      onMouseDown={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[450px] overflow-hidden rounded-[16px] border !border-[#e3eaf2] bg-white text-center shadow-[0_28px_70px_rgba(7,29,51,0.32)] motion-safe:animate-[successModalIn_180ms_ease-out] flex flex-col gap-3 items-center"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="h-2 w-full !bg-[#071d33]" />
        <button
          type="button"
          aria-label="Close confirmation"
          onClick={onClose}
          className="absolute right-[14px] top-[18px] grid h-8 w-8 place-items-center rounded-full !bg-[#f5f8fc] !text-[#64748b] transition hover:!bg-[#e9eef5] hover:!text-[#071d33] focus:outline-none focus:ring-2 focus:ring-[#247dca]/30"
        >
          <span aria-hidden="true" className="text-[22px] leading-none">
            &times;
          </span>
        </button>

        <div className="px-6 pb-7 pt-8 md:px-8 md:pb-8 md:pt-9 flex flex-col gap-4 items-center">
          <div className="mx-auto grid h-[76px] w-[76px] place-items-center rounded-full !bg-[#e9fff3] shadow-[0_0_0_10px_rgba(34,181,115,0.10)]">
            <div className="grid h-14 w-14 place-items-center rounded-full !bg-[#22b573] text-white shadow-[0_12px_24px_rgba(34,181,115,0.28)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>

          <h2
            id={titleId}
            className="mt-6 text-[23px] font-bold leading-[1.18] !text-[#071d33] md:text-[24px]"
          >
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-[1.65] !text-[#64748b]">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-7 flex h-[44px] w-full items-center justify-center rounded-[7px] !bg-[#247dca] text-[13px] font-extrabold text-white shadow-[0_10px_22px_rgba(36,125,202,0.26)] transition hover:!bg-[#1b6eb5] focus:outline-none focus:ring-2 focus:ring-[#247dca]/30"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
