"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { GOLD_FILL, GOLD_INK, goldTextSx } from "@/lib/gold-theme";
import {
  LANDING_DESIGN_WIDTH,
  WHY_US_HOLD_PAGES,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const barlow = {
  fontFamily: 'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const BG_SRC = "/landing/bg-1.png";
/** Soft bottom so the next section peeks through while leaving. */
const EXIT_MASK =
  "linear-gradient(180deg, #000 0%, #000 88%, rgba(0, 0, 0, 0.55) 95%, transparent 100%)";

const STATS = [
  ["30+", "Professionals"],
  ["100+", "Projects Delivered"],
  ["6+", "Years of Industry Experience"],
] as const;

const ROWS = [
  {
    title: "All-in-One Solutions",
    kicker: "One Partner. Multiple Growth Opportunities.",
    body: "From digital advertising and content production to AI tools, automation, and SEO, we provide integrated solutions that work together to grow your business.",
    tags: ["Advertising & Content", "Tools & Automation"],
    icon: "layers" as const,
  },
  {
    title: "AI-Powered Efficiency",
    kicker: "Work Smarter. Create Faster. Grow Further.",
    body: "Leverage AI to create high-quality content, automate daily operations, and optimize your marketing performance for scalable growth.",
    tags: ["AI Content Creation", "Workflow Automation"],
    icon: "spark" as const,
  },
  {
    title: "Industry-Focused Expertise",
    kicker: "Solutions Built Around Your Industry.",
    body: "With deep understanding of entertainment and iGaming, we deliver targeted marketing, user engagement, and operational solutions that drive real results.",
    tags: ["iGaming & Entertainment", "Market Insights & Growth Strategy"],
    icon: "target" as const,
  },
];

function RowIcon({ name }: { name: (typeof ROWS)[number]["icon"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={{ width: 30, height: 30, display: "block" }}
    >
      {name === "layers" ? (
        <>
          <path {...common} d="M12 4.2 20 8.2 12 12.2 4 8.2 12 4.2Z" />
          <path {...common} d="M4 12 12 16l8-4" />
          <path {...common} d="M4 15.6 12 19.6l8-4" />
        </>
      ) : null}
      {name === "spark" ? (
        <path {...common} d="M12 3.2 13.4 8.8 19 10.2 13.4 11.6 12 17.2 10.6 11.6 5 10.2 10.6 8.8 12 3.2Z" />
      ) : null}
      {name === "target" ? (
        <>
          <circle {...common} cx="12" cy="12" r="7.2" />
          <circle {...common} cx="12" cy="12" r="3.2" />
          <path {...common} d="M12 3.2V6M12 18v2.8M3.2 12H6M18 12h2.8" />
        </>
      ) : null}
    </Box>
  );
}

const ROW_PAGES = 1 + WHY_US_HOLD_PAGES;
const GROUP_H = `calc(${ROW_PAGES} * ${STAGE_VIEWPORT_PAGE_HEIGHT_CSS})`;
const LEFT_H = 540;
const PIN_SCALE = `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`;

function WhyChooseCopy() {
  return (
    <Box sx={{ width: 620, color: "#fff", ...barlow }}>
      <Typography
        component="h2"
        sx={{
          m: 0,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: "0.16em",
          lineHeight: 1.1,
          color: "rgba(255, 220, 160, 0.86)",
          ...barlow,
        }}
      >
        WHY CHOOSE
      </Typography>
      <Typography
        component="p"
        sx={{
          m: 0,
          mt: "8px",
          fontWeight: 700,
          fontSize: 68,
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          backgroundImage: goldTextSx.backgroundImage,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          ...barlow,
        }}
        className="solutions-title-3d"
      >
        VISIONCRAFT?
      </Typography>
      <Typography
        sx={{
          m: 0,
          mt: "22px",
          maxWidth: 560,
          fontSize: 26,
          lineHeight: 1.35,
          fontWeight: 600,
          color: "#fff",
          ...barlow,
        }}
      >
        Your Partner in Digital Advertising, AI & Business Growth.
      </Typography>
      <Typography
        sx={{
          m: 0,
          mt: "10px",
          fontSize: 18,
          lineHeight: 1.4,
          letterSpacing: "0.04em",
          color: "rgba(255, 220, 160, 0.78)",
          ...barlow,
        }}
      >
        Smart Solutions. Creative Thinking. Real Opportunities.
      </Typography>
      <Box sx={{ display: "flex", gap: "28px", mt: "28px" }}>
        {STATS.map(([value, label]) => (
          <Box key={label}>
            <Typography
              className="solutions-title-3d"
              sx={{
                m: 0,
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1,
                backgroundImage: goldTextSx.backgroundImage,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                ...barlow,
              }}
            >
              {value}
            </Typography>
            <Typography
              sx={{
                m: 0,
                mt: "6px",
                fontSize: 16,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                color: "rgba(255,255,255,0.72)",
                ...barlow,
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function WhyChooseRow({ row }: { row: (typeof ROWS)[number] }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "22px", color: "#fff", ...barlow }}>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 64,
          height: 64,
          flexShrink: 0,
          borderRadius: "16px",
          color: "#F6C15A",
          border: "1px solid rgba(246, 193, 90, 0.45)",
          bgcolor: "rgba(246, 193, 90, 0.08)",
        }}
      >
        <RowIcon name={row.icon} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ m: 0, fontSize: 42, fontWeight: 700, lineHeight: 1.12, ...barlow }}>
          {row.title}
        </Typography>
        <Typography sx={{ m: 0, mt: "8px", fontSize: 26, fontWeight: 600, lineHeight: 1.25, color: "#F6C15A", ...barlow }}>
          {row.kicker}
        </Typography>
        <Typography sx={{ m: 0, mt: "14px", fontSize: 24, lineHeight: 1.4, color: "rgba(255,255,255,0.9)", ...barlow }}>
          {row.body}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px", mt: "16px" }}>
          {row.tags.map((tag) => (
            <Box
              key={tag}
              sx={{
                px: "16px",
                py: "7px",
                borderRadius: "999px",
                background: GOLD_FILL,
                boxShadow: "0 0 0 1px #FFE7A3, 0 4px 14px rgba(255, 168, 56, 0.45)",
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.3,
                color: GOLD_INK,
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Background and the left title stay pinned. The right rows sit in the
 * section track and scroll past, the same way the old Solutions copy did.
 */
export default function WhyUsPoster({ sectionId }: { sectionId: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(subscribeNoop, getHydrated, getServerSnapshot);

  useEffect(() => {
    const slot = slotRef.current;
    const bg = bgRef.current;
    const title = titleRef.current;
    const section = document.getElementById(sectionId);
    if (!slot || !bg || !title || !section) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const track = section.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const vh = window.innerHeight;
      const onScreen = track.top < vh && track.bottom > 0;
      const bgOn = track.top < vh * 1.25 && track.bottom > 0;
      const rest = slotRect.top - track.top;
      const startTop = track.top + rest;
      const holdView = vh * WHY_US_HOLD_PAGES;
      const endTop = track.bottom + holdView - rest - slotRect.height;
      const nav = 102 * (window.innerWidth / LANDING_DESIGN_WIDTH);
      const parkTop = nav + (vh - nav - slotRect.height) / 2;
      const releaseBottom = parkTop + rest + slotRect.height - holdView;
      const leaveY =
        onScreen && track.top <= 0 && track.bottom < releaseBottom
          ? track.bottom - releaseBottom
          : 0;

      bg.style.visibility = bgOn ? "visible" : "hidden";
      bg.style.transform = leaveY !== 0 ? `translateY(${leaveY}px)` : "none";

      const top = Math.max(startTop, Math.min(parkTop, endTop));
      title.style.top = `${top}px`;
      title.style.visibility = onScreen ? "visible" : "hidden";
      slot.style.visibility = onScreen ? "hidden" : "visible";

      const anchor = top + slotRect.height / 2;
      let best = 0;
      let bestDist = Infinity;
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - anchor);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        row.style.opacity = index === best ? "1" : "0.38";
      });
    };
    const placeHolds = () => {
      if (!CSS.supports("animation-timeline: scroll()")) return;
      const track = section.getBoundingClientRect();
      if (track.width < 1) return;
      const scale = track.width / LANDING_DESIGN_WIDTH;
      const vh = window.innerHeight;
      const nav = 102 * scale;
      const target = nav + (vh - nav) / 2;
      const holdView = vh * WHY_US_HOLD_PAGES;
      rowRefs.current.forEach((row, index) => {
        const copy = copyRefs.current[index];
        if (!row || !copy) return;
        const rect = row.getBoundingClientRect();
        const start = rect.top + window.scrollY + rect.height / 2 - target;
        copy.style.setProperty("animation-range", `${start}px ${start + holdView}px`);
        copy.style.setProperty("--hold-shift", `${holdView / scale}px`);
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      placeHolds();
      onScroll();
    };

    placeHolds();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [sectionId, hydrated]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          px: "170px",
          boxSizing: "border-box",
          gap: "64px",
          lineHeight: "normal",
        }}
      >
        <Box sx={{ position: "relative", width: 620, flexShrink: 0 }}>
          <Box
            ref={slotRef}
            sx={{
              position: "absolute",
              left: 0,
              top: `calc((${GROUP_H} - ${LEFT_H}px) / 2)`,
              display: "flex",
              alignItems: "center",
              width: 620,
              height: LEFT_H,
            }}
          >
            <WhyChooseCopy />
          </Box>
        </Box>
        <Box sx={{ width: 900, flexShrink: 0 }}>
          {ROWS.map((row, index) => (
            <Box
              key={row.title}
              ref={(el) => {
                rowRefs.current[index] = el instanceof HTMLDivElement ? el : null;
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                height: GROUP_H,
                opacity: index === 0 ? 1 : 0.38,
                transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <Box
                ref={(el) => {
                  copyRefs.current[index] = el instanceof HTMLDivElement ? el : null;
                }}
                className="why-choose-hold"
                sx={{ width: "100%", willChange: "transform" }}
              >
                <WhyChooseRow row={row} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {hydrated
        ? createPortal(
            <>
              <Box
                ref={bgRef}
                className="landing-desktop-pin"
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: -2,
                  visibility: "hidden",
                  pointerEvents: "none",
                }}
              >
                <Box
                  component="img"
                  src={BG_SRC}
                  alt=""
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center bottom",
                    maskImage: EXIT_MASK,
                    WebkitMaskImage: EXIT_MASK,
                  }}
                />
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(8, 2, 14, 0.78) 0%, rgba(8, 2, 14, 0.62) 36%, rgba(8, 2, 14, 0.5) 68%, rgba(8, 2, 14, 0.42) 100%)",
                    maskImage: EXIT_MASK,
                    WebkitMaskImage: EXIT_MASK,
                  }}
                />
              </Box>
              <Box
                ref={titleRef}
                className="landing-desktop-pin"
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  width: LANDING_DESIGN_WIDTH,
                  height: LEFT_H,
                  paddingLeft: 170,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  transform: PIN_SCALE,
                  transformOrigin: "top left",
                  zIndex: 5,
                  pointerEvents: "none",
                  visibility: "hidden",
                }}
              >
                <WhyChooseCopy />
              </Box>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
