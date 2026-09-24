"use client";

import Box from "@mui/material/Box";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  LANDING_DESIGN_WIDTH,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// Entry values are measured frame-by-frame from the reference capture; see
// docs/superpowers/specs/2026-09-23-title-scroll-reveal-and-button-glow-design.md
const ENTER_SCALE = 1.075;
const ENTER_RISE_RATIO = 0.23;
const ENTER_MS = 1500;
const ENTER_FADE_MS = 1700;
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";
// Exit owns the tail of the pin track. Fade and drift only — never scale.
const EXIT_TRACK_FRACTION = 0.12;
const EXIT_RISE_STAGE_PX = 70;

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

export default function ScrollRevealPin({
  holdPages,
  anchorId,
  zIndex = 20,
  background = "#050B13",
  children,
}: {
  holdPages: number;
  anchorId?: string;
  zIndex?: number;
  background?: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  // `position: fixed` and `position: sticky` are both dead inside the scaled
  // stage, so the pin lives in a portal on document.body and re-applies the
  // stage scale itself. Same approach as SolutionsStickyRows / HowWeWorkStackedCards.
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydrated,
    getServerSnapshot,
  );

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
      // Commit the parked frame. Without this read the browser coalesces both
      // style writes into one paint and the transition never runs.
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

      // Screen px throughout: rect and vh share that space, and `top` on the
      // portal is read before its own scale() so it is screen px too.
      // Follow the wrapper down, clamp at the top through the hold, then ride
      // the wrapper's bottom edge back out. The pin is exactly one viewport
      // page tall, so it never spills past the wrapper it belongs to.
      const pinTop = rect.top > 0 ? rect.top : Math.min(0, rect.bottom - vh);
      pin.style.top = `${pinTop.toFixed(2)}px`;
      pin.style.visibility =
        rect.bottom > 0 && rect.top < vh ? "visible" : "hidden";

      if (reducedMotion) {
        block.style.transition = "none";
        block.style.opacity = "1";
        block.style.transform = "none";
        return;
      }

      // The block is centred in a viewport-tall pin, so its centre sits at
      // rect.top + vh / 2 until the pin engages. Trigger as that crosses in.
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
        // Hold. Only touch the element if the exit had already claimed it —
        // writing inline styles every frame would cancel the entry mid-flight.
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
  }, [reducedMotion, hydrated]);

  return (
    <Box
      ref={wrapRef}
      id={anchorId}
      data-pin-top=""
      sx={{
        position: "relative",
        width: "100%",
        height: `calc(${1 + holdPages} * ${LANDING_DESIGN_WIDTH}px * 100vh / 100vw)`,
        bgcolor: background,
      }}
    >
      {hydrated
        ? createPortal(
            <div
              ref={pinRef}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                zIndex,
                width: LANDING_DESIGN_WIDTH,
                height: STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
                transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
                transformOrigin: "top left",
                background,
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
            </div>,
            document.body,
          )
        : null}
    </Box>
  );
}
