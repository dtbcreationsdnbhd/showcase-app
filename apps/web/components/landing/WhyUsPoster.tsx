"use client";

import Box from "@mui/material/Box";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import PillButton from "@/components/landing/PillButton";
import {
  LANDING_DESIGN_WIDTH,
  WHY_US_DESKTOP_HEIGHT,
} from "@/lib/landing-layout";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const SRC = "/landing/why-us-desktop.png";
/** Soft bottom so FAQ peeks through while leaving — no extra section height. */
const EXIT_MASK =
  "linear-gradient(180deg, #000 0%, #000 88%, rgba(0, 0, 0, 0.55) 95%, transparent 100%)";

function PosterButton() {
  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        bottom: 85,
        transform: "translateX(-50%)",
        pointerEvents: "auto",
      }}
    >
      <PillButton href="#contact">Let's Build Your Next Project</PillButton>
    </Box>
  );
}

/**
 * Solutions scrolls off over a fixed reveal copy. Once the section top hits 0
 * the poster stays pinned for TITLE_HOLD_PAGES of scroll (section track is
 * taller than one viewport). Soft bottom mask stays on so FAQ shows through
 * as the hold ends — without an empty gap.
 */
export default function WhyUsPoster({ sectionId }: { sectionId: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const inflowBtnRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLImageElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydrated,
    getServerSnapshot,
  );

  useEffect(() => {
    const img = imgRef.current;
    const inflowBtn = inflowBtnRef.current;
    const layer = layerRef.current;
    const pin = pinRef.current;
    const section = document.getElementById(sectionId);
    if (!img || !inflowBtn || !layer || !pin || !section) return;

    let raf = 0;
    const pinScale = `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const posterScreenH =
        (WHY_US_DESKTOP_HEIGHT / LANDING_DESIGN_WIDTH) * window.innerWidth;
      // Pin while the track is on screen: reveal → hold → soft leave.
      const pinned = rect.top < vh && rect.bottom > 0;
      // After hold, track the section bottom so the poster lifts off (no extra hold page).
      const leaveY =
        pinned && rect.top <= 0 && rect.bottom < vh ? rect.bottom - vh : 0;

      layer.style.height = `${posterScreenH}px`;
      layer.style.transform =
        leaveY !== 0 ? `translateY(${leaveY}px)` : "none";
      pin.style.transform =
        leaveY !== 0 ? `translateY(${leaveY}px) ${pinScale}` : pinScale;
      layer.style.visibility = pinned ? "visible" : "hidden";
      pin.style.visibility = pinned ? "visible" : "hidden";
      img.style.visibility = pinned ? "hidden" : "visible";
      inflowBtn.style.visibility = pinned ? "hidden" : "visible";
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
        alt="Why choose VisionCraft"
        sx={{
          display: "block",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: WHY_US_DESKTOP_HEIGHT,
          objectFit: "cover",
          objectPosition: "center bottom",
          maskImage: EXIT_MASK,
          WebkitMaskImage: EXIT_MASK,
        }}
      />
      <Box
        ref={inflowBtnRef}
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: WHY_US_DESKTOP_HEIGHT,
        }}
      >
        <PosterButton />
      </Box>
      {hydrated
        ? createPortal(
            <>
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
                  zIndex: -2,
                  pointerEvents: "none",
                  visibility: "hidden",
                  objectFit: "cover",
                  objectPosition: "center bottom",
                  maskImage: EXIT_MASK,
                  WebkitMaskImage: EXIT_MASK,
                }}
              />
              <Box
                ref={pinRef}
                className="landing-desktop-pin"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: LANDING_DESIGN_WIDTH,
                  height: WHY_US_DESKTOP_HEIGHT,
                  transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
                  transformOrigin: "top left",
                  zIndex: 5,
                  pointerEvents: "none",
                  visibility: "hidden",
                }}
              >
                <PosterButton />
              </Box>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
