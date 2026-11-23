"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { GOLD_FILL, GOLD_INK, goldTextSx } from "@/lib/gold-theme";
import {
  LANDING_DESIGN_WIDTH,
  WHY_US_HOLD_PAGES,
  WHY_US_TAIL_PAGES,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";
import { listenWhileNear } from "@/lib/listen-while-near";
import { CJK_FONT, whyCopy, type Locale } from "@/lib/locale";

const subscribeNoop = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

const barlow = {
  fontFamily: 'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const ROW_ICONS = ["layers", "spark", "target"] as const;

type WhyRow = ReturnType<typeof whyCopy>["rows"][number] & {
  icon: (typeof ROW_ICONS)[number];
};

function rowsFor(locale: Locale): WhyRow[] {
  return whyCopy(locale).rows.map((row, index) => ({
    ...row,
    icon: ROW_ICONS[index],
  }));
}

function RowIcon({ name }: { name: WhyRow["icon"] }) {
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

function WhyChooseCopy({ locale }: { locale: Locale }) {
  const copy = whyCopy(locale);
  const face = locale === "zh" ? { fontFamily: CJK_FONT } : barlow;
  return (
    <Box sx={{ width: 620, color: "#fff", ...face }}>
      <Typography
        component="h2"
        sx={{
          m: 0,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: locale === "zh" ? "0.08em" : "0.16em",
          lineHeight: 1.1,
          color: "rgba(255, 220, 160, 0.86)",
          ...face,
        }}
      >
        {copy.eyebrow}
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
          ...face,
        }}
        className="solutions-title-3d"
      >
        {copy.title}
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
          ...face,
        }}
      >
        {copy.partner}
      </Typography>
      <Typography
        sx={{
          m: 0,
          mt: "10px",
          fontSize: 18,
          lineHeight: 1.4,
          letterSpacing: "0.04em",
          color: "rgba(255, 220, 160, 0.78)",
          ...face,
        }}
      >
        {copy.promise}
      </Typography>
      <Box sx={{ display: "flex", gap: "28px", mt: "28px" }}>
        {copy.stats.map(([value, label]) => (
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
                ...face,
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
                ...face,
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

function WhyChooseRow({ row, locale }: { row: WhyRow; locale: Locale }) {
  const face = locale === "zh" ? { fontFamily: CJK_FONT } : barlow;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "22px", color: "#fff", ...face }}>
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
        <Typography sx={{ m: 0, fontSize: 42, fontWeight: 700, lineHeight: 1.12, ...face }}>
          {row.title}
        </Typography>
        <Typography sx={{ m: 0, mt: "8px", fontSize: 26, fontWeight: 600, lineHeight: 1.25, color: "#F6C15A", ...face }}>
          {row.kicker}
        </Typography>
        <Typography sx={{ m: 0, mt: "14px", fontSize: 24, lineHeight: 1.4, color: "rgba(255,255,255,0.9)", ...face }}>
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
 * The first screen enters with the background: title and first row sit in
 * that viewport, then hold. Later rows still pass over the pinned picture.
 */
export default function WhyUsPoster({ sectionId }: { sectionId: string }) {
  const pathname = usePathname();
  const locale: Locale = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
  const rows = rowsFor(locale);
  const slotRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstBandRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(subscribeNoop, getHydrated, getServerSnapshot);

  useEffect(() => {
    const slot = slotRef.current;
    const title = titleRef.current;
    const section = document.getElementById(sectionId);
    if (!slot || !title || !section) return;

    let raf = 0;
    let slotRest = 0;
    let slotH = 0;
    let lastBest = -1;
    let lastTitleTransform = "";
    let lastTitleVis = "";
    let lastSlotVis = "";
    const measureSlot = () => {
      const track = section.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      slotRest = slotRect.top - track.top;
      slotH = slotRect.height;
    };
    const update = () => {
      raf = 0;
      const track = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const onScreen = track.top < vh && track.bottom > 0;
      const startTop = track.top + slotRest;
      const holdView = vh * WHY_US_HOLD_PAGES;
      // Title now sits in the first viewport instead of the middle of the
      // two-screen group. The tail is only there so the picture stays up, so
      // the title still lets go with the last row.
      const entryLift = (vh * (1 + WHY_US_HOLD_PAGES) - vh) / 2;
      const endTop =
        track.bottom + holdView - slotRest - slotH - entryLift - vh * WHY_US_TAIL_PAGES;
      const nav = 102 * (window.innerWidth / LANDING_DESIGN_WIDTH);
      const parkTop = nav + (vh - nav - slotH) / 2;
      const top = Math.max(startTop, Math.min(parkTop, endTop));
      const titleTransform = `translate3d(0, ${top.toFixed(2)}px, 0)`;
      const titleVis = onScreen ? "visible" : "hidden";
      const slotVis = onScreen ? "hidden" : "visible";

      if (titleTransform !== lastTitleTransform) {
        lastTitleTransform = titleTransform;
        title.style.transform = titleTransform;
      }
      if (titleVis !== lastTitleVis) {
        lastTitleVis = titleVis;
        title.style.visibility = titleVis;
      }
      if (slotVis !== lastSlotVis) {
        lastSlotVis = slotVis;
        slot.style.visibility = slotVis;
      }

      const anchor = top + slotH / 2;
      const rowSpan = track.height / rows.length;
      let best = 0;
      let bestDist = Infinity;
      for (let index = 0; index < rows.length; index += 1) {
        const center = track.top + (index + 0.5) * rowSpan;
        const dist = Math.abs(center - anchor);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      }
      if (best !== lastBest) {
        lastBest = best;
        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          row.style.opacity = index === best ? "1" : "0.38";
        });
      }
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
        // The first row is centered in the opening viewport, so its hold
        // starts when that band reaches the middle, together with the title.
        const band = index === 0 ? firstBandRef.current : null;
        const rect = (band ?? row).getBoundingClientRect();
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
      measureSlot();
      placeHolds();
      onScroll();
    };

    measureSlot();
    placeHolds();
    update();
    const stopNear = listenWhileNear([section], onScroll, "40% 0px 50% 0px");
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      stopNear();
      window.removeEventListener("resize", onResize);
    };
  }, [sectionId, hydrated, rows.length]);

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
              top: `calc((${STAGE_VIEWPORT_PAGE_HEIGHT_CSS} - ${LEFT_H}px) / 2)`,
              display: "flex",
              alignItems: "center",
              width: 620,
              height: LEFT_H,
            }}
          >
            <WhyChooseCopy locale={locale} />
          </Box>
        </Box>
        <Box sx={{ width: 900, flexShrink: 0 }}>
          {rows.map((row, index) => (
            <Box
              key={row.title}
              ref={(el) => {
                rowRefs.current[index] = el instanceof HTMLDivElement ? el : null;
              }}
              sx={{
                display: "flex",
                alignItems: index === 0 ? "flex-start" : "center",
                height: GROUP_H,
                opacity: index === 0 ? 1 : 0.38,
              }}
            >
              <Box
                ref={index === 0 ? firstBandRef : undefined}
                sx={
                  index === 0
                    ? {
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
                      }
                    : { display: "contents" }
                }
              >
                <Box
                  ref={(el) => {
                    copyRefs.current[index] = el instanceof HTMLDivElement ? el : null;
                  }}
                  className="why-choose-hold"
                  sx={{ width: "100%", willChange: "transform" }}
                >
                  <WhyChooseRow row={row} locale={locale} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {hydrated
        ? createPortal(
            <Box
                ref={titleRef}
                className="landing-desktop-pin"
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  zIndex: 5,
                  pointerEvents: "none",
                  visibility: "hidden",
                  willChange: "transform",
                }}
              >
                <Box
                  style={{
                    width: LANDING_DESIGN_WIDTH,
                    height: LEFT_H,
                    paddingLeft: 170,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    transform: PIN_SCALE,
                    transformOrigin: "top left",
                  }}
                >
                  <WhyChooseCopy locale={locale} />
                </Box>
              </Box>,
            document.body,
          )
        : null}
    </>
  );
}
