"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { figmaPx } from "@/lib/landing-layout";

type LandingServiceIcon = "ai" | "web" | "star" | "refresh";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

type ServiceCopy = {
  title: string;
  description: string;
};

const ROW_H = figmaPx(370);
const ICON_W = figmaPx(317.25);
const ICON_H = figmaPx(277.5);
const ICON_REST_Y = (ROW_H - ICON_H) / 2;
const GROUP_GAP = figmaPx(50);
const COPY_GAP = figmaPx(60);
const COPY_W = figmaPx(380);
const COL_GAP = figmaPx(210);
const NAV_STAGE_H = 102;

const SERVICE_ROWS: {
  icon: LandingServiceIcon;
  alt: string;
  services: [ServiceCopy, ServiceCopy];
}[] = [
  {
    icon: "ai",
    alt: "AI",
    services: [
      {
        title: "Telegram Bot Integration",
        description:
          "Automate replies and capture leads instantly. Never miss a business opportunity.",
      },
      {
        title: "AI Chatbot & Automation",
        description:
          "Deploy 24/7 AI chatbots to answer queries and guide traffic straight to sales.",
      },
    ],
  },
  {
    icon: "web",
    alt: "Web",
    services: [
      {
        title: "Custom Landing Pages & Web",
        description:
          "Fast-loading landing pages designed with one goal: turning visitors into paying clients.",
      },
      {
        title: "Cloud Hosting & Domain Setup",
        description:
          "Reliable hosting to ensure your business stays fast, secure, and online during traffic spikes.",
      },
    ],
  },
  {
    icon: "star",
    alt: "Custom systems",
    services: [
      {
        title: "Custom Dashboard & System",
        description:
          "Secure, intuitive dashboards. Gain full control and visibility over your core operations.",
      },
      {
        title: "Custom Mobile Apps",
        description:
          "Seamless custom mobile apps. We handle everything from UI design to Play Store launch.",
      },
    ],
  },
  {
    icon: "refresh",
    alt: "Automation",
    services: [
      {
        title: "Data Tracking & Pixel Integration",
        description:
          "Stop guessing. We track every conversion perfectly so you can optimize your ad spend.",
      },
      {
        title: "Task Automation Scripting",
        description:
          "Replace manual and repetitive tasks with smart scripts. Streamline your operations, reduce human error, and save valuable time.",
      },
    ],
  },
];

function IconStack({
  active,
  iconSrcs,
}: {
  active: number;
  iconSrcs: Record<LandingServiceIcon, string | null>;
}) {
  return (
    <>
      {SERVICE_ROWS.map((row, i) => {
        const src = iconSrcs[row.icon];
        if (!src) return null;
        return (
          <Box
            key={row.icon}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: i === active ? 1 : 0,
              transition: "opacity 320ms ease",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
              },
            }}
          >
            <Image
              src={src}
              alt={i === active ? row.alt : ""}
              width={423}
              height={370}
              sizes={`${figmaPx(423)}px`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>
        );
      })}
    </>
  );
}

function ServiceCopyBlock({ title, description }: ServiceCopy) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        p: 0,
        gap: `${figmaPx(6)}px`,
        width: "100%",
      }}
    >
      <Typography
        component="h3"
        sx={{
          ...barlow,
          m: 0,
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: figmaPx(25.5),
          lineHeight: `${figmaPx(41)}px`,
          letterSpacing: "-0.02em",
          color: "#C3A4FF",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          ...barlow,
          m: 0,
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: figmaPx(12),
          lineHeight: "160%",
          letterSpacing: "0.02em",
          color: "#FFFFFF",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export default function SolutionsStickyRows({
  iconSrcs,
}: {
  iconSrcs: Record<LandingServiceIcon, string | null>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [portalReady, setPortalReady] = useState(false);

  useLayoutEffect(() => {
    setPortalReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!portalReady) return;
    const track = trackRef.current;
    const slot = slotRef.current;
    const visual = visualRef.current;
    const pin = pinRef.current;
    if (!track || !slot || !visual || !pin) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const trackRect = track.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      if (slotRect.width < 1) return;

      const restView = slotRect.top - trackRect.top;
      const navView = NAV_STAGE_H * (slotRect.width / ICON_W);
      const startTop = trackRect.top + restView;
      const endTop = trackRect.bottom - restView - slotRect.height;
      const parkTop =
        navView + (window.innerHeight - navView - slotRect.height) / 2;

      // Follow in document flow (no JS lag). Only the pinned phase uses
      // position:fixed, and its top stays constant — that's the "stuck" feel.
      if (startTop > parkTop) {
        visual.style.transform = "none";
        visual.style.visibility = "visible";
        pin.style.visibility = "hidden";
      } else if (endTop < parkTop) {
        const maxLocal = Math.max(
          0,
          track.offsetHeight - ICON_REST_Y * 2 - ICON_H,
        );
        visual.style.transform = `translate3d(0, ${maxLocal}px, 0)`;
        visual.style.visibility = "visible";
        pin.style.visibility = "hidden";
      } else {
        visual.style.visibility = "hidden";
        visual.style.transform = "none";
        pin.style.top = `${parkTop}px`;
        pin.style.left = `${slotRect.left}px`;
        pin.style.width = `${slotRect.width}px`;
        pin.style.height = `${slotRect.height}px`;
        pin.style.visibility = "visible";
      }

      const target = navView + (window.innerHeight - navView) * 0.42;
      let best = 0;
      let bestDist = Infinity;
      groupRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - target);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [portalReady]);

  return (
    <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        p: 0,
        gap: `${COL_GAP}px`,
        width: figmaPx(1152),
      }}
    >
      <Box
        ref={trackRef}
        sx={{
          position: "relative",
          width: ICON_W,
          flexShrink: 0,
        }}
      >
        <Box
          ref={slotRef}
          sx={{
            position: "absolute",
            top: ICON_REST_Y,
            left: 0,
            width: ICON_W,
            height: ICON_H,
            visibility: "hidden",
            pointerEvents: "none",
          }}
        />
        <Box
          ref={visualRef}
          sx={{
            position: "absolute",
            top: ICON_REST_Y,
            left: 0,
            width: ICON_W,
            height: ICON_H,
            overflow: "hidden",
            bgcolor: "#050B13",
            pointerEvents: "none",
            willChange: "transform",
          }}
        >
          <IconStack active={active} iconSrcs={iconSrcs} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 0,
          gap: `${GROUP_GAP}px`,
          width: COPY_W,
          flexShrink: 0,
        }}
      >
        {SERVICE_ROWS.map((row, i) => (
          <Box
            key={row.icon}
            ref={(el) => {
              groupRefs.current[i] =
                el instanceof HTMLDivElement ? el : null;
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              p: 0,
              gap: `${COPY_GAP}px`,
              width: "100%",
              height: ROW_H,
              flexShrink: 0,
              opacity: i === active ? 1 : 0.38,
              transition: "opacity 280ms ease",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
                opacity: 1,
              },
            }}
          >
            <ServiceCopyBlock {...row.services[0]} />
            <ServiceCopyBlock {...row.services[1]} />
          </Box>
        ))}
      </Box>
    </Box>
    {portalReady
      ? createPortal(
          <div
            ref={pinRef}
            data-solutions-pin="true"
            style={{
              position: "fixed",
              zIndex: 40,
              overflow: "hidden",
              pointerEvents: "none",
              visibility: "hidden",
              background: "#050B13",
            }}
          >
            <IconStack active={active} iconSrcs={iconSrcs} />
          </div>,
          document.body,
        )
      : null}
    </>
  );
}
