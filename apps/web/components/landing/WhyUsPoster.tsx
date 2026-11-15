"use client";

import Box from "@mui/material/Box";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import PillButton from "@/components/landing/PillButton";
import { LANDING_DESIGN_WIDTH, WHY_US_DESKTOP_HEIGHT } from "@/lib/landing-layout";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const SRC = "/landing/why-us-desktop.png";

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
      <PillButton href="#contact">
        Let's Build Your Next Project
      </PillButton>
    </Box>
  );
}

export default function WhyUsPoster({ sectionId }: { sectionId: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const inflowBtnRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLImageElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(subscribeNoop, getHydrated, getServerSnapshot);

  useEffect(() => {
    const img = imgRef.current;
    const inflowBtn = inflowBtnRef.current;
    const layer = layerRef.current;
    const pin = pinRef.current;
    const section = document.getElementById(sectionId);
    if (!img || !inflowBtn || !layer || !pin || !section) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const revealing = rect.top > 0 && rect.top < window.innerHeight;
      layer.style.height = `${rect.height}px`;
      layer.style.visibility = revealing ? "visible" : "hidden";
      pin.style.visibility = revealing ? "visible" : "hidden";
      img.style.visibility = revealing ? "hidden" : "visible";
      inflowBtn.style.visibility = revealing ? "hidden" : "visible";
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
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center bottom",
        }}
      />
      <Box ref={inflowBtnRef}>
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