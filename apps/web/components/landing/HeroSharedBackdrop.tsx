"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

/** hero-bg-desktop.png is 2880×1800, the same frame the hero section shows. */
const IMAGE_RATIO = 1800 / 2880;
const HERO_FADE_MASK =
  "linear-gradient(180deg, #000 0%, #000 50%, rgba(0, 0, 0, 0.55) 76%, transparent 100%)";

/**
 * One hero picture, pinned behind the hero and the project cards together.
 * It stays put while those two sections scroll, then leaves with the cards.
 */
export default function HeroSharedBackdrop({ src }: { src: string | null }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydrated,
    getServerSnapshot,
  );

  useEffect(() => {
    const layer = layerRef.current;
    const hero = document.getElementById("top");
    const cards = document.getElementById("hero-cards");
    const heroBg = hero?.querySelector<HTMLElement>("[data-hero-bg]");
    if (!layer || !hero || !cards || !src) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const top = hero.getBoundingClientRect().top;
      const bottom = cards.getBoundingClientRect().bottom;
      const vh = window.innerHeight;
      const imageH = window.innerWidth * IMAGE_RATIO;
      const onScreen = bottom > 0 && top < vh;
      // Keep the hero's crop while the cards still cover the window, then
      // move 1:1 with that section so the picture and the cards leave together.
      const y = top > 0 || vh <= 0 ? top : Math.min(0, bottom - vh);

      layer.style.height = `${imageH}px`;
      layer.style.transform = `translateY(${y}px)`;
      layer.style.visibility = onScreen ? "visible" : "hidden";
      if (heroBg) heroBg.style.visibility = onScreen ? "hidden" : "visible";
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
      if (heroBg) heroBg.style.visibility = "";
    };
  }, [hydrated, src]);

  if (!hydrated || !src) return null;

  return createPortal(
    <div
      ref={layerRef}
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
        overflow: "hidden",
        maskImage: HERO_FADE_MASK,
        WebkitMaskImage: HERO_FADE_MASK,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          userSelect: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(30, 4, 16, 0.85) 0%, rgba(30, 4, 16, 0.55) 35%, rgba(30, 4, 16, 0) 60%)",
        }}
      />
    </div>,
    document.body,
  );
}
