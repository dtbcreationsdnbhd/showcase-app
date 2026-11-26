"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { listenWhileNear } from "@/lib/listen-while-near";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

/** Even shade over the whole picture. Same color the hero lays over its photo. */
const SHADE = "rgba(30, 4, 16, 0.55)";
/** Short crossfade where two pictures meet. The rest of each picture stays solid. */
const BLEND = 20;

type Band = {
  startId: string;
  endId: string;
  src: string;
  objectPosition: string;
  zIndex: number;
  shade?: string;
};

/**
 * Section pictures, stacked in page order. Each one fills the screen while its
 * section is on screen. Where two pictures meet, they crossfade over a short
 * band instead of cutting on a hard line.
 *
 * The hero picture stays in the hero section and is reused, blank of the old
 * solutions poster, while the solutions section is on screen.
 */
const PROJECTS_PAGE_BG = "/landing/contact-form-bg.png";
/** Same darkening as the projects page frame. */
const PROJECTS_PAGE_SHADE = "rgba(0, 0, 0, 0.58)";

function sectionBands(heroSrc: string | null): Band[] {
  return [
    {
      startId: "hero-cards",
      endId: "hero-cards",
      src: PROJECTS_PAGE_BG,
      objectPosition: "center center",
      zIndex: -5,
      shade: PROJECTS_PAGE_SHADE,
    },
    {
      startId: "solutions",
      endId: "solutions",
      src: heroSrc ?? "",
      objectPosition: "center center",
      zIndex: -4,
      shade: SHADE,
    },
    {
      startId: "why-us",
      endId: "why-us",
      src: "/landing/bg-1.webp",
      objectPosition: "center bottom",
      zIndex: -3,
    },
    {
      startId: "faq",
      endId: "faq",
      src: "/landing/faq-bg.png",
      objectPosition: "center center",
      zIndex: -2,
    },
    {
      startId: "contact",
      endId: "contact",
      src: "/landing/contact-form-bg.png",
      objectPosition: "center center",
      zIndex: -1,
    },
  ];
}

export default function LandingBackgrounds({
  heroSrc = null,
}: {
  heroSrc?: string | null;
}) {
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hydrated = useSyncExternalStore(subscribeNoop, getHydrated, getServerSnapshot);
  const bands = sectionBands(heroSrc);

  useEffect(() => {
    const nodes = sectionBands(heroSrc).map((band, index) => ({
      band,
      start: document.getElementById(band.startId),
      end: document.getElementById(band.endId),
      layer: layerRefs.current[index],
    }));

    let raf = 0;
    const lastVis = nodes.map(() => "");

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        if (!node.layer || !node.start || !node.end) continue;
        const img = node.layer.querySelector("img");
        const shade = node.layer.querySelector("div");
        const start = node.start.getBoundingClientRect().top;
        const end = node.end.getBoundingClientRect().bottom;
        const onScreen = end > -BLEND && start < vh + BLEND;
        const entering = start > 0 && start < vh;
        const leaving = end < vh && end > 0;
        const blendIn = entering ? Math.min(BLEND, start) : 0;
        const blendOut = leaving ? Math.min(BLEND, end) : 0;
        const y = entering ? start - blendIn : leaving ? end - vh : start > 0 ? start : 0;
        const mask =
          blendIn > 0
            ? `linear-gradient(to bottom, transparent 0px, #000 ${blendIn}px)`
            : blendOut > 0
              ? `linear-gradient(to bottom, #000 calc(100% - ${blendOut}px), transparent 100%)`
              : "none";
        node.layer.style.opacity = "1";
        node.layer.style.height = `${vh + blendIn}px`;
        node.layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        node.layer.style.maskImage = mask;
        node.layer.style.webkitMaskImage = mask;
        if (img) {
          img.style.top = "0px";
          img.style.height = `${vh}px`;
          img.style.bottom = "auto";
        }
        if (shade) {
          shade.style.top = "0px";
          shade.style.height = `${vh}px`;
          shade.style.bottom = "auto";
        }
        const vis = onScreen ? "visible" : "hidden";
        if (vis !== lastVis[index]) {
          lastVis[index] = vis;
          node.layer.style.visibility = vis;
        }
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    const stopNear = listenWhileNear(
      nodes.flatMap((node) => [node.start, node.end]),
      onScroll,
      "100% 0px 100% 0px",
    );
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      stopNear();
      window.removeEventListener("resize", onScroll);
    };
  }, [hydrated, heroSrc]);

  if (!hydrated) return null;

  return createPortal(
    <>
      {bands.map((band, index) => (
        <div
          key={band.startId}
          ref={(el) => {
            layerRefs.current[index] = el;
          }}
          aria-hidden
          className="landing-desktop-pin"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: band.zIndex,
            pointerEvents: "none",
            visibility: "hidden",
            overflow: "hidden",
          }}
        >
          {band.src ? (
            <img
              src={band.src}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: band.objectPosition,
              }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "#1e0410" }} />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: band.shade ?? SHADE,
            }}
          />
        </div>
      ))}
    </>,
    document.body,
  );
}
