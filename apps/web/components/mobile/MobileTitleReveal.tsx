"use client";

import Box from "@mui/material/Box";
import { useEffect, useRef, type ReactNode } from "react";
import { LANDING_DESIGN_WIDTH, TITLE_HOLD_PAGES } from "@/lib/landing-layout";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_VIEWPORT_HEIGHT_CSS,
} from "@/lib/landing-layout-mobile";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// Same entry as ScrollRevealPin. Exit drift is scaled onto the 440 stage so
// the on-screen motion matches desktop's 70px on the 1920 frame.
const ENTER_SCALE = 1.075;
const ENTER_RISE_RATIO = 0.23;
const ENTER_MS = 1500;
const ENTER_FADE_MS = 1700;
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";
const EXIT_TRACK_FRACTION = 0.12;
const EXIT_RISE_STAGE_PX = (70 * MOBILE_DESIGN_WIDTH) / LANDING_DESIGN_WIDTH;

const PAGES = 1 + TITLE_HOLD_PAGES;

export default function MobileTitleReveal({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    const block = blockRef.current;
    if (!wrap || !pin || !block) return;

    let raf = 0;
    let entered = false;
    let exiting = false;

    const park = () => {
      block.style.transition = "none";
      block.style.opacity = "0";
      const rise = (ENTER_RISE_RATIO * block.offsetHeight).toFixed(2);
      block.style.transform = `translate3d(0, ${rise}px, 0) scale(${ENTER_SCALE})`;
    };

    const enter = () => {
      park();
      void block.offsetWidth;
      block.style.transition = `transform ${ENTER_MS}ms ${EASE_OUT_CUBIC}, opacity ${ENTER_FADE_MS}ms ${EASE_OUT_CUBIC}`;
      block.style.opacity = "1";
      block.style.transform = "translate3d(0, 0, 0) scale(1)";
    };

    const settle = () => {
      block.style.transition = "none";
      block.style.opacity = "1";
      block.style.transform = "translate3d(0, 0, 0) scale(1)";
    };

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      pin.style.visibility =
        rect.bottom > 0 && rect.top < vh ? "visible" : "hidden";

      if (reducedMotion) {
        block.style.transition = "none";
        block.style.opacity = "1";
        block.style.transform = "none";
        return;
      }

      if (rect.top > vh * 0.55) {
        if (entered) {
          entered = false;
          exiting = false;
          park();
        }
        return;
      }
      if (!entered) {
        entered = true;
        exiting = false;
        enter();
      }

      const track = Math.max(rect.height - vh, 1);
      const used = Math.min(Math.max(-rect.top, 0), track);
      const exitStart = track * (1 - EXIT_TRACK_FRACTION);
      const progress =
        used <= exitStart ? 0 : (used - exitStart) / (track - exitStart);

      if (progress <= 0) {
        if (exiting) {
          exiting = false;
          settle();
        }
        return;
      }

      exiting = true;
      block.style.transition = "none";
      block.style.opacity = (1 - progress).toFixed(3);
      const drift = (-EXIT_RISE_STAGE_PX * progress).toFixed(2);
      block.style.transform = `translate3d(0, ${drift}px, 0) scale(1)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  return (
    <Box
      ref={wrapRef}
      sx={{
        position: "relative",
        width: "100%",
        height: `calc(${PAGES} * ${MOBILE_VIEWPORT_HEIGHT_CSS})`,
      }}
    >
      <Box
        ref={pinRef}
        sx={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: MOBILE_VIEWPORT_HEIGHT_CSS,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          visibility: "hidden",
        }}
      >
        <div
          ref={blockRef}
          style={{
            width: "100%",
            opacity: 0,
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
        >
          {children}
        </div>
      </Box>
    </Box>
  );
}
