"use client";

import Box from "@mui/material/Box";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  SOLUTIONS_TAIL_FADE_PAGES,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const BACKDROP =
  'linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), url("/landing/solutions-bg.png") center / cover no-repeat';
const TAIL_FADE_PCT = (SOLUTIONS_TAIL_FADE_PAGES / (1 + SOLUTIONS_TAIL_FADE_PAGES)) * 100;
const TAIL_FADE_START = 100 - TAIL_FADE_PCT;
// Same curve as the Hero's bottom fade, so both section exits read alike.
const TAIL_MASK = `linear-gradient(180deg, #000 0%, #000 ${TAIL_FADE_START}%, rgba(0, 0, 0, 0.55) ${TAIL_FADE_START + TAIL_FADE_PCT * 0.52}%, transparent 100%)`;

/**
 * Viewport-fixed backdrop, faded in while `targetId` enters. Near the end it
 * hands off to an identical in-flow copy at the bottom of the section, so the
 * backdrop scrolls off with the content like the hero does. Both layers are
 * one viewport plus the fade band tall, so they line up at the handoff.
 * z-index -1 sits under the stage but above the html background, which only
 * works while body stays transparent (see globals.css).
 */
export default function SolutionsBackdrop({ targetId }: { targetId: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydrated,
    getServerSnapshot,
  );

  useEffect(() => {
    const layer = layerRef.current;
    const tail = tailRef.current;
    const target = document.getElementById(targetId);
    if (!layer || !tail || !target) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight;
      const handedOff = rect.bottom <= vh * (1 + SOLUTIONS_TAIL_FADE_PAGES);
      const fadeIn = Math.min(Math.max(1 - rect.top / vh, 0), 1);
      const opacity = handedOff ? 0 : fadeIn;
      layer.style.opacity = opacity.toFixed(3);
      layer.style.visibility = opacity > 0 ? "visible" : "hidden";
      tail.style.visibility = handedOff ? "visible" : "hidden";
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
  }, [targetId, hydrated]);

  return (
    <>
      <Box
        ref={tailRef}
        aria-hidden
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: `calc(${1 + SOLUTIONS_TAIL_FADE_PAGES} * ${STAGE_VIEWPORT_PAGE_HEIGHT_CSS})`,
          zIndex: -1,
          pointerEvents: "none",
          background: BACKDROP,
          maskImage: TAIL_MASK,
          WebkitMaskImage: TAIL_MASK,
          visibility: "hidden",
        }}
      />
      {hydrated
        ? createPortal(
            <div
              ref={layerRef}
              aria-hidden
              className="landing-desktop-pin"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: `${(1 + SOLUTIONS_TAIL_FADE_PAGES) * 100}vh`,
                zIndex: -1,
                pointerEvents: "none",
                background: BACKDROP,
                maskImage: TAIL_MASK,
                WebkitMaskImage: TAIL_MASK,
                opacity: 0,
                visibility: "hidden",
              }}
            />,
            document.body,
          )
        : null}
    </>
  );
}
