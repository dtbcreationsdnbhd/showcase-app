"use client";

import Box from "@mui/material/Box";
import { useEffect, type RefObject } from "react";
import { MOBILE_GUTTER } from "@/lib/landing-layout-mobile";

const SEAM = "rgba(255, 255, 255, 0.72)";
/** How far a card may trail the scroll, in viewport px. */
const MAX_LAG = 180;
/** Share of each scroll step held back. */
const RESIST = 0.82;
/** How fast the held-back distance settles once the scroll eases. */
const RELEASE = 0.035;

export function MobileSeamLine({ edge }: { edge: "top" | "bottom" }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: edge === "top" ? 0 : "auto",
        bottom: edge === "bottom" ? 0 : "auto",
        left: `${MOBILE_GUTTER}px`,
        right: `${MOBILE_GUTTER}px`,
        height: "1px",
        bgcolor: SEAM,
      }}
    />
  );
}

/** Cards after the first trail the scroll, then settle. Looks for `[data-sheet]`. */
export function useMobileStackLag(
  wrapRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const sheets = [...wrap.querySelectorAll<HTMLElement>("[data-sheet]")];
    const lag = sheets.map(() => 0);
    let last = window.scrollY;
    let frame = 0;

    const paint = () => {
      const dy = window.scrollY - last;
      last = window.scrollY;
      const vh = window.innerHeight;
      let moving = Math.abs(dy) > 0.4;

      sheets.forEach((sheet, index) => {
        if (index === 0) return;
        const section = sheet.parentElement;
        if (!section) return;
        const top = section.getBoundingClientRect().top;
        const sliding = top > 1 && top < vh;
        if (sliding) {
          lag[index] = Math.max(
            -MAX_LAG,
            Math.min(MAX_LAG, lag[index] + dy * RESIST),
          );
        }
        const next = lag[index] * (1 - RELEASE);
        if (Math.abs(next) > 0.4) moving = true;
        lag[index] = Math.abs(next) < 0.4 ? 0 : next;
        sheet.style.transform = lag[index]
          ? `translate3d(0, ${lag[index].toFixed(2)}px, 0)`
          : "";
      });

      frame = moving ? requestAnimationFrame(paint) : 0;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      sheets.forEach((sheet) => {
        sheet.style.transform = "";
      });
    };
  }, [wrapRef]);
}
