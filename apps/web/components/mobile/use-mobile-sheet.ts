"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export const MOBILE_SHEET_MS = 480;
export const MOBILE_SHEET_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** `present` keeps the sheet mounted through the close slide. `shown` is the resting open position. */
export function useMobileSheet(open: boolean) {
  const reduced = usePrefersReducedMotion();
  const [present, setPresent] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    setShown(false);
    if (reduced) setPresent(false);
  }, [open, reduced]);

  useEffect(() => {
    if (!present || !open) return;
    if (reduced) {
      setShown(true);
      return;
    }
    // The closed frame has to paint first, or the browser skips the slide.
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [present, open, reduced]);

  useEffect(() => {
    if (open || !present || reduced) return;
    // `transitionend` does not fire reliably on the zoomed stage, which leaves
    // the sheet mounted and the page scroll-locked after it has slid away.
    const id = window.setTimeout(() => setPresent(false), MOBILE_SHEET_MS + 80);
    return () => window.clearTimeout(id);
  }, [open, present, reduced]);

  const onTransitionEnd = (event: React.TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    if (!open) setPresent(false);
  };

  return { present, shown, reduced, onTransitionEnd };
}

export function mobileSheetMotion(shown: boolean, reduced: boolean) {
  return {
    transform: shown ? "translate3d(0, 0, 0)" : "translate3d(0, 100%, 0)",
    transition: reduced
      ? "none"
      : `transform ${MOBILE_SHEET_MS}ms ${MOBILE_SHEET_EASE}`,
    willChange: "transform",
  } as const;
}
