"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function InquiryDetailsButton({
  name,
  submitted,
  lookingToBuild,
  details,
}: {
  name: string;
  submitted: string;
  lookingToBuild: string;
  details: string | null;
}) {
  const [shown, setShown] = useState(false);
  const [entered, setEntered] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!shown) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeDrawer();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shown]);

  function openDrawer() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setShown(true);
    setEntered(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setEntered(true));
    });
  }

  function closeDrawer() {
    setEntered(false);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setShown(false);
      closeTimer.current = null;
    }, 320);
  }

  return (
    <>
      <button
        type="button"
        aria-label={`View details for ${name}`}
        onClick={openDrawer}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#2A2A2A] hover:bg-[#F4F1FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B61FF]"
      >
        <EyeIcon />
      </button>
      {shown
        ? createPortal(
            <div
              className={`fixed inset-0 z-40 ${entered ? "" : "pointer-events-none"}`}
            >
              <button
                type="button"
                aria-label="Close details"
                className={`absolute inset-0 cursor-pointer bg-[#171717]/20 transition-opacity duration-300 ${
                  entered ? "opacity-100" : "opacity-0"
                }`}
                onClick={closeDrawer}
              />
              <aside
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white text-[#171717] shadow-[-12px_0_32px_rgba(80,60,140,0.12)] transition-transform duration-300 ease-out ${
                  entered ? "translate-x-0" : "translate-x-full"
                }`}
                onTransitionEnd={(event) => {
                  if (event.target !== event.currentTarget || entered) return;
                  if (
                    event.propertyName !== "transform" &&
                    event.propertyName !== "translate"
                  ) {
                    return;
                  }
                  if (closeTimer.current !== null) {
                    window.clearTimeout(closeTimer.current);
                    closeTimer.current = null;
                  }
                  setShown(false);
                }}
              >
                <div className="flex items-center justify-between gap-4 px-6 pt-5">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={closeDrawer}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#171717] hover:bg-[#F4F1FB]"
                  >
                    <ArrowRightIcon />
                  </button>
                  <p className="text-xs text-[#171717]">submitted: {submitted}</p>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-6 text-[#171717]">
                  <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#E6E1F2] p-4">
                    <h2 className="shrink-0 text-sm font-semibold text-[#171717]">
                      What are you looking to build?
                    </h2>
                    <p className="mt-3 min-h-0 flex-1 overflow-auto text-sm leading-6 whitespace-pre-wrap text-[#171717]">
                      {lookingToBuild || "—"}
                    </p>
                  </section>
                  <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#E6E1F2] p-4">
                    <h2 className="shrink-0 text-sm font-semibold text-[#171717]">
                      Tell us more about your project
                    </h2>
                    <p className="mt-3 min-h-0 flex-1 overflow-auto text-sm leading-6 whitespace-pre-wrap text-[#171717]">
                      {details || "—"}
                    </p>
                  </section>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
