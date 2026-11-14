"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const BACKDROP =
  'linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), url("/landing/solutions-bg.png") center / cover no-repeat';

/**
 * Viewport-fixed backdrop, faded in and out by scroll while `targetId` crosses
 * the viewport. z-index -1 sits under the stage but above the html background,
 * which only works while body stays transparent (see globals.css).
 */
export default function SolutionsBackdrop({ targetId }: { targetId: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydrated,
    getServerSnapshot,
  );

  useEffect(() => {
    const layer = layerRef.current;
    const target = document.getElementById(targetId);
    if (!layer || !target) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight;
      const fadeIn = 1 - rect.top / vh;
      const fadeOut = rect.bottom / vh;
      const opacity = Math.min(Math.max(Math.min(fadeIn, fadeOut), 0), 1);
      layer.style.opacity = opacity.toFixed(3);
      layer.style.visibility = opacity > 0 ? "visible" : "hidden";
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

  if (!hydrated) return null;

  return createPortal(
    <div
      ref={layerRef}
      aria-hidden
      className="landing-desktop-pin"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: BACKDROP,
        opacity: 0,
        visibility: "hidden",
      }}
    />,
    document.body,
  );
}
