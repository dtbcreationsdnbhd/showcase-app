"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Lottie, type LottieHandle } from "lottie-react";
import { STAGE_VIEWPORT_PAGE_HEIGHT_CSS, figmaPx } from "@/lib/landing-layout";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type LandingServiceIcon = "ai" | "web" | "star" | "refresh";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

type ServiceCopy = {
  title: string;
  description: string;
};

const ROW_H_CSS = STAGE_VIEWPORT_PAGE_HEIGHT_CSS;
const ICON_W = figmaPx(317.25);
const ICON_H = figmaPx(277.5);
const ICON_REST_TOP = `calc((${ROW_H_CSS} - ${ICON_H}px) / 2)`;
const COPY_GAP = figmaPx(60);
const COPY_W = figmaPx(380);
const COL_GAP = figmaPx(210);
const NAV_STAGE_H = 102;
const ICON_FADE_MS = 720;
const ICON_FADE = `${ICON_FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
const COPY_FADE = "500ms cubic-bezier(0.22, 1, 0.36, 1)";
const ACTIVE_SWITCH_PX = 64;

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

const HOLD_FRAMES = 24;
const MORPH_FRAMES = 60;
const STATE_SPAN = HOLD_FRAMES + MORPH_FRAMES;
const LAST_ICON = SERVICE_ROWS.length - 1;

const IDLE_RANGES = SERVICE_ROWS.map((_, i) => [
  i * STATE_SPAN,
  i * STATE_SPAN + HOLD_FRAMES,
] as const);

function playheadFrame(x: number) {
  const clamped = Math.min(Math.max(x, 0), LAST_ICON);
  if (clamped >= LAST_ICON) return IDLE_RANGES[LAST_ICON][0];
  const i = Math.min(Math.floor(clamped), LAST_ICON - 1);
  const f = clamped - i;
  return (
    IDLE_RANGES[i][1] + f * (IDLE_RANGES[i + 1][0] - IDLE_RANGES[i][1])
  );
}

const LIT_HOVER = [230, 214, 255] as const;
const SPOT_RADIUS = 88;
const SPOT_SCALE = 1.35;

function MorphLottie({
  src,
  frameRef,
  seekRef,
}: {
  src: string;
  frameRef: { current: number };
  seekRef: { current: ((frame: number) => void) | null };
}) {
  const ref = useRef<LottieHandle>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef(Number.NaN);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let paths: SVGElement[] = [];
    let hover = false;
    let mx = 0;
    let my = 0;
    let sx = 0;
    let sy = 0;
    let spotRaf = 0;

    const armWave = () => {
      paths = Array.from(
        host.querySelectorAll<SVGElement>("svg path, svg ellipse"),
      );
      const n = paths.length;
      if (n === 0) return;
      paths.forEach((path, i) => {
        if (path.dataset.wave === "1") return;
        path.dataset.wave = "1";
        path.style.fill = "";
        const stagger = (i / n) * 2.2;
        const jitter = ((i * 47) % 80) / 100;
        path.style.animationDelay = `${-(stagger + jitter)}s`;
        path.style.animationDuration = `${1.9 + (i % 5) * 0.18}s`;
      });
    };

    const clearSpot = () => {
      for (const path of paths) {
        path.style.removeProperty("fill");
        path.style.transform = "";
      }
    };

    const paintSpot = () => {
      spotRaf = 0;
      if (paths.length === 0) armWave();
      if (!hover) {
        clearSpot();
        return;
      }
      sx += (mx - sx) * 0.28;
      sy += (my - sy) * 0.28;
      const r2 = SPOT_RADIUS * SPOT_RADIUS;
      for (const path of paths) {
        const box = path.getBoundingClientRect();
        const dx = box.left + box.width / 2 - sx;
        const dy = box.top + box.height / 2 - sy;
        const d2 = dx * dx + dy * dy;
        if (d2 >= r2) {
          path.style.removeProperty("fill");
          path.style.transform = "";
          continue;
        }
        const t = 1 - Math.sqrt(d2) / SPOT_RADIUS;
        const k = t * t;
        path.style.setProperty(
          "fill",
          `rgb(${Math.round(195 + (LIT_HOVER[0] - 195) * k)},${Math.round(163 + (LIT_HOVER[1] - 163) * k)},255)`,
          "important",
        );
        path.style.transform = `scale(${1 + k * SPOT_SCALE})`;
      }
      if (hover && Math.hypot(mx - sx, my - sy) > 0.4) {
        spotRaf = requestAnimationFrame(paintSpot);
      }
    };

    const onMove = (event: PointerEvent) => {
      mx = event.clientX;
      my = event.clientY;
      if (!hover) {
        sx = mx;
        sy = my;
        hover = true;
      }
      if (!spotRaf) spotRaf = requestAnimationFrame(paintSpot);
    };

    const onLeave = () => {
      hover = false;
      clearSpot();
      if (spotRaf) {
        cancelAnimationFrame(spotRaf);
        spotRaf = 0;
      }
    };

    const seek = (frame: number) => {
      const api = ref.current;
      if (!api) return;
      if (frame !== lastFrameRef.current) {
        lastFrameRef.current = frame;
        const item = api.animationItem as
          | { goToAndStop?: (value: number, isFrame?: boolean) => void }
          | null
          | undefined;
        if (item?.goToAndStop) item.goToAndStop(frame, true);
        else {
          api.pause();
          api.seek(frame);
        }
      }
      armWave();
    };
    seekRef.current = seek;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const raf = requestAnimationFrame(armWave);
    return () => {
      cancelAnimationFrame(raf);
      if (spotRaf) cancelAnimationFrame(spotRaf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (seekRef.current === seek) seekRef.current = null;
    };
  }, [frameRef, seekRef]);

  return (
    <div
      ref={hostRef}
      className="solutions-morph"
      style={{ width: "100%", height: "100%" }}
    >
      <Lottie
        lottieRef={ref}
        src={src}
        autoplay={false}
        loop={false}
        subscriptions={{
          ready: () => {
            lastFrameRef.current = Number.NaN;
            seekRef.current?.(frameRef.current);
          },
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

function IconStack({
  active,
  iconSrcs,
  morphSrc,
  reducedMotion,
  frameRef,
  seekRef,
}: {
  active: number;
  iconSrcs: Record<LandingServiceIcon, string | null>;
  morphSrc: string | null;
  reducedMotion: boolean;
  frameRef: { current: number };
  seekRef: { current: ((frame: number) => void) | null };
}) {
  if (morphSrc && !reducedMotion) {
    return (
      <MorphLottie src={morphSrc} frameRef={frameRef} seekRef={seekRef} />
    );
  }

  return (
    <>
      {SERVICE_ROWS.map((row, i) => {
        const png = iconSrcs[row.icon];
        if (!png) return null;
        return (
          <Box
            key={row.icon}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: i === active ? 1 : 0,
              transition: `opacity ${ICON_FADE}`,
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
              },
            }}
          >
            <Image
              src={png}
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
  morphSrc,
}: {
  iconSrcs: Record<LandingServiceIcon, string | null>;
  morphSrc: string | null;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const morphFrameRef = useRef(IDLE_RANGES[0][1]);
  const pinSeekRef = useRef<((frame: number) => void) | null>(null);
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const slot = slotRef.current;
    const pin = pinEl;
    if (!track || !slot || !pin) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const trackRect = track.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      if (slotRect.width < 1) return;

      // Natural screen tops for the icon at track start / end, and the sticky park.
      // One continuous clamp — no flow↔fixed handoff, so start/end don't hitch.
      const restView = slotRect.top - trackRect.top;
      const navView = NAV_STAGE_H * (slotRect.width / ICON_W);
      const startTop = trackRect.top + restView;
      const endTop = trackRect.bottom - restView - slotRect.height;
      const parkTop =
        navView + (window.innerHeight - navView - slotRect.height) / 2;
      const pinTop = Math.max(startTop, Math.min(parkTop, endTop));

      pin.style.top = `${pinTop}px`;
      pin.style.left = `${slotRect.left}px`;
      pin.style.width = `${slotRect.width}px`;
      pin.style.height = `${slotRect.height}px`;
      pin.style.visibility =
        endTop < -slotRect.height || startTop > window.innerHeight
          ? "hidden"
          : "visible";

      const iconCenterY = pinTop + slotRect.height / 2;
      const target = iconCenterY;
      let best = 0;
      let bestDist = Infinity;
      const dists: number[] = [];
      const mids: number[] = [];
      groupRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        mids[i] = mid;
        const dist = Math.abs(mid - target);
        dists[i] = dist;
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (
        mids.length === SERVICE_ROWS.length &&
        Number.isFinite(mids[0]) &&
        Number.isFinite(mids[LAST_ICON]) &&
        mids[LAST_ICON] !== mids[0]
      ) {
        const x =
          LAST_ICON *
          Math.min(
            Math.max((target - mids[0]) / (mids[LAST_ICON] - mids[0]), 0),
            1,
          );
        morphFrameRef.current = playheadFrame(x);
        pinSeekRef.current?.(morphFrameRef.current);
      }
      const current = activeRef.current;
      const currentDist = dists[current];
      const shouldSwitch =
        best !== current &&
        (currentDist == null || currentDist - bestDist > ACTIVE_SWITCH_PX);
      if (shouldSwitch) {
        activeRef.current = best;
        groupRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.opacity = i === best ? "1" : "0.38";
        });
        setActive(best);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinEl]);

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
            top: ICON_REST_TOP,
            left: 0,
            width: ICON_W,
            height: ICON_H,
            visibility: "hidden",
            pointerEvents: "none",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 0,
          gap: 0,
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
              height: ROW_H_CSS,
              flexShrink: 0,
              opacity: i === active ? 1 : 0.38,
              transition: `opacity ${COPY_FADE}`,
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
    {mounted
      ? createPortal(
          <div
            ref={(el) => {
              pinRef.current = el;
              setPinEl((prev) => (prev === el ? prev : el));
            }}
            data-solutions-pin="true"
            style={{
              position: "fixed",
              zIndex: 40,
              overflow: "visible",
              pointerEvents: "auto",
              visibility: "hidden",
              background: "#050B13",
            }}
          >
            <IconStack
              active={active}
              iconSrcs={iconSrcs}
              morphSrc={morphSrc}
              reducedMotion={reducedMotion}
              frameRef={morphFrameRef}
              seekRef={pinSeekRef}
            />
          </div>,
          document.body,
        )
      : null}
    </>
  );
}
