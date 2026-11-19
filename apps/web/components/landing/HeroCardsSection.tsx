"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import HeroCarousel, { type HeroSlide } from "@/components/landing/HeroCarousel";
import {
  HERO_CARDS_VIEWPORT_PAGES,
  LANDING_DESIGN_WIDTH,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";

/** Same window the hero used: previous card, active card, next card. */
const CARDS_VIEW_W = 12 + 380 * 3 + 28 * 2;
/** Stage px. Kept while the frame is pinned, so the hold does not drop it. */
const CARD_NUDGE = 60;

export default function HeroCardsSection({ slides }: { slides: HeroSlide[] }) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const section = document.getElementById("hero-cards");
    if (!frame || !section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = CSS.supports("animation-timeline: scroll()");
    if (timeline && !reduce) {
      const place = () => {
        const rect = section.getBoundingClientRect();
        if (rect.width < 1) return;
        const scale = rect.width / LANDING_DESIGN_WIDTH;
        const holdView = Math.max(0, rect.height - window.innerHeight);
        const start = rect.top + window.scrollY;
        frame.style.setProperty("animation-range", `${start}px ${start + holdView}px`);
        frame.style.setProperty("--hold-shift", `${holdView / scale}px`);
        frame.style.setProperty("--card-nudge", `${CARD_NUDGE}px`);
      };
      place();
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scale = rect.width / LANDING_DESIGN_WIDTH || 1;
      const hold = Math.max(0, rect.height - vh);
      const shift = rect.top < 0 ? Math.min(-rect.top, hold) : 0;
      frame.style.transform = `translateY(${CARD_NUDGE + shift / scale}px)`;
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
  }, []);

  return (
    <Box
      component="section"
      id="hero-cards"
      data-pin-top=""
      sx={{
        position: "relative",
        width: "100%",
        height: `calc(${HERO_CARDS_VIEWPORT_PAGES} * ${STAGE_VIEWPORT_PAGE_HEIGHT_CSS})`,
        overflow: "hidden",
      }}
    >
      <Box
        ref={frameRef}
        className="hero-cards-hold"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${CARD_NUDGE}px)`,
          willChange: "transform",
        }}
      >
        <Box sx={{ width: CARDS_VIEW_W, maxWidth: "100%", overflow: "hidden" }}>
          <HeroCarousel slides={slides} />
        </Box>
      </Box>
    </Box>
  );
}
