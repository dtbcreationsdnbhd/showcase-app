"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const BACKDROP =
  'linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), url("/landing/faq-bg.png") center / cover no-repeat';

/**
 * Shared FAQ + contact-form backdrop. Stays for the whole form; clipped so it
 * never paints over the APEX footer as that section rises.
 */
export default function FaqBackdrop({
  targetId,
  untilId = "contact",
  stopId = "footer",
}: {
  targetId: string;
  untilId?: string;
  stopId?: string;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydrated,
    getServerSnapshot,
  );

  useEffect(() => {
    const layer = layerRef.current;
    const start = document.getElementById(targetId);
    if (!layer || !start) return;
    const end = document.getElementById(untilId) ?? start;
    const stop = document.getElementById(stopId);

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const startRect = start.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();
      const footerTop = stop ? stop.getBoundingClientRect().top : vh;
      const fadeIn = Math.min(Math.max(2 - startRect.top / vh, 0), 1);
      const gone = endRect.bottom <= 0 && footerTop <= 0;
      const opacity = gone ? 0 : fadeIn;
      const clipBottom = Math.max(0, vh - footerTop);
      layer.style.clipPath =
        clipBottom > 0 ? `inset(0 0 ${clipBottom}px 0)` : "none";
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
  }, [targetId, untilId, stopId, hydrated]);

  if (!hydrated) return null;

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
        height: "100vh",
        zIndex: -3,
        pointerEvents: "none",
        background: BACKDROP,
        opacity: 0,
        visibility: "hidden",
      }}
    />,
    document.body,
  );
}
