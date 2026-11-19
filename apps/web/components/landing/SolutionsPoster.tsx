"use client";

import Box from "@mui/material/Box";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  LANDING_DESIGN_WIDTH,
  SOLUTIONS_DESKTOP_HEIGHT,
} from "@/lib/landing-layout";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const SRC = "/landing/solutions-bg.png";
/** Thin bottom edge so the next poster can peek through without eating the slogan. */
const EXIT_MASK =
  "linear-gradient(180deg, #000 0%, #000 97%, transparent 100%)";

/**
 * Same pin as Why Choose: the poster locks to the viewport once the section
 * arrives, holds for TITLE_HOLD_PAGES, then lifts off with the section end.
 * z-index -1 sits above the Why Choose poster (-2) so this one covers it
 * until the hold ends and the bottom mask reveals the next poster.
 */
export default function SolutionsPoster({ sectionId }: { sectionId: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const layerRef = useRef<HTMLImageElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydrated,
    getServerSnapshot,
  );

  useEffect(() => {
    const img = imgRef.current;
    const layer = layerRef.current;
    const section = document.getElementById(sectionId);
    if (!img || !layer || !section) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const posterScreenH =
        (SOLUTIONS_DESKTOP_HEIGHT / LANDING_DESIGN_WIDTH) * window.innerWidth;
      const cardsBottom =
        document.getElementById("hero-cards")?.getBoundingClientRect().bottom ?? 0;
      const approaching = rect.top < vh && rect.bottom > 0;
      // Fade the poster in across the handoff. It stays invisible while the
      // project cards still fill the screen, then dissolves in as they leave.
      const handoff = vh * 0.85;
      const enter =
        cardsBottom <= 0
          ? 1
          : Math.min(1, Math.max(0, (handoff - cardsBottom) / handoff));
      const pinned = approaching && cardsBottom <= handoff;
      const leaveY =
        pinned && cardsBottom <= 0 && rect.top <= 0 && rect.bottom < vh
          ? rect.bottom - vh
          : 0;
      const fade = leaveY !== 0 ? Math.max(rect.bottom / vh, 0) : 1;
      const opacity = fade * enter;

      layer.style.height = `${posterScreenH}px`;
      layer.style.transform = leaveY !== 0 ? `translateY(${leaveY}px)` : "none";
      layer.style.opacity = opacity.toFixed(3);
      layer.style.visibility = pinned && opacity > 0.01 ? "visible" : "hidden";
      img.style.visibility = pinned || (approaching && cardsBottom > 0) ? "hidden" : "visible";
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
  }, [sectionId, hydrated]);

  return (
    <>
      <Box
        component="img"
        ref={imgRef}
        src={SRC}
        alt="Smart solutions for smarter business growth"
        sx={{
          display: "block",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: SOLUTIONS_DESKTOP_HEIGHT,
          objectFit: "cover",
          objectPosition: "center",
          maskImage: EXIT_MASK,
          WebkitMaskImage: EXIT_MASK,
        }}
      />
      {hydrated
        ? createPortal(
            <img
              ref={layerRef}
              src={SRC}
              alt=""
              aria-hidden
              className="landing-desktop-pin"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                zIndex: -1,
                pointerEvents: "none",
                visibility: "hidden",
                objectFit: "cover",
                objectPosition: "center",
                maskImage: EXIT_MASK,
                WebkitMaskImage: EXIT_MASK,
              }}
            />,
            document.body,
          )
        : null}
    </>
  );
}
