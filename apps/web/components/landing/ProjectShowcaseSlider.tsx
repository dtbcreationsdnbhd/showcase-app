"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import ProjectCard from "@/components/landing/ProjectCard";
import ProjectDetailPopup from "@/components/landing/ProjectDetailPopup";
import {
  SHOWCASE_CARD_ZOOM,
  SHOWCASE_COLUMNS,
  figmaPx,
} from "@/lib/landing-layout";
import { projectTagLine, type ShowcaseProject } from "@/lib/projects";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = figmaPx(276);
const CARD_H = figmaPx(414.75);
const CARD_GAP = figmaPx(24);
const STEP = CARD_W + CARD_GAP;
const ROW_W = CARD_W * SHOWCASE_COLUMNS + CARD_GAP * (SHOWCASE_COLUMNS - 1);
// Room for the card hover scale; half the gap so neighbours stay hidden.
const CLIP_PAD = CARD_GAP / 2;
const ARROW_GAP = figmaPx(56);
const SLIDE_MS = 600;

const arrowSlotSx = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  mx: `${ARROW_GAP}px`,
  zIndex: 1,
} as const;
const AUTOPLAY_MS = 4000;

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={direction === "prev" ? "Previous projects" : "Next projects"}
      onClick={onClick}
      className="hover-grow-lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: figmaPx(52.5),
        height: figmaPx(52.5),
        p: 0,
        m: 0,
        border: 0,
        bgcolor: "transparent",
        appearance: "none",
        cursor: "pointer",
        flexShrink: 0,
        "&:focus-visible": {
          outline: "2px solid #CC35CC",
          outlineOffset: 4,
          borderRadius: "50%",
        },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 24 24"
        aria-hidden
        sx={{
          width: figmaPx(34),
          height: figmaPx(34),
          display: "block",
          transform: direction === "prev" ? "rotate(180deg)" : "none",
          filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))",
        }}
      >
        <path
          d="M9 4.5 16.5 12 9 19.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
    </Box>
  );
}

export default function ProjectShowcaseSlider({
  projects,
  title,
}: {
  projects: readonly ShowcaseProject[];
  title: string;
}) {
  const count = projects.length;
  const slides = count > SHOWCASE_COLUMNS;
  // Clone the first row onto the end so the loop can wrap without a gap.
  const track = slides ? [...projects, ...projects.slice(0, SHOWCASE_COLUMNS)] : projects;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const busy = useRef(false);

  const selected = projects.find((p) => p.id === selectedId) ?? null;
  const close = useCallback(() => setSelectedId(null), []);

  // Timers rather than transitionend: reduced motion drops the transition.
  const lock = () => {
    busy.current = true;
    window.setTimeout(() => {
      busy.current = false;
    }, SLIDE_MS);
  };

  const next = useCallback(() => {
    if (!slides || busy.current) return;
    lock();
    setAnimate(true);
    setIndex((i) => i + 1);
  }, [slides]);

  const prev = useCallback(() => {
    if (!slides || busy.current) return;
    lock();
    if (index === 0) {
      // Jump to the cloned row (same picture), then slide back one.
      setAnimate(false);
      setIndex(count);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setIndex(count - 1);
        }),
      );
    } else {
      setAnimate(true);
      setIndex((i) => i - 1);
    }
  }, [slides, index, count]);

  useEffect(() => {
    if (index < count) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, count]);

  // Re-armed on every move, so a manual click never races an auto step.
  useEffect(() => {
    if (!slides || hovered || selected) return;
    const id = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [slides, hovered, selected, next, index]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: ROW_W * SHOWCASE_CARD_ZOOM,
          height: figmaPx(80),
          flexShrink: 0,
        }}
      >
        <Typography
          component="h2"
          sx={{
            ...barlow,
            m: 0,
            fontWeight: 600,
            fontSize: figmaPx(48),
            lineHeight: `${figmaPx(64)}px`,
            letterSpacing: "-0.02em",
            backgroundImage: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* zoom (not transform) so layout, translateX and hit-testing all scale together. */}
      <Box
        sx={{
          position: "relative",
          width: ROW_W,
          flexShrink: 0,
          zoom: SHOWCASE_CARD_ZOOM,
        }}
      >
        {slides ? (
          <>
            <Box sx={{ ...arrowSlotSx, right: "100%" }}>
              <ArrowButton direction="prev" onClick={prev} />
            </Box>
            <Box sx={{ ...arrowSlotSx, left: "100%" }}>
              <ArrowButton direction="next" onClick={next} />
            </Box>
          </>
        ) : null}
        <Box
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          sx={{
            boxSizing: "content-box",
            width: ROW_W,
            height: CARD_H,
            p: `${CLIP_PAD}px`,
            m: `${-CLIP_PAD}px`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: `${CARD_GAP}px`,
              justifyContent: slides ? "flex-start" : "center",
              width: slides ? "max-content" : ROW_W,
              transform: `translateX(${-index * STEP}px)`,
              transition: animate
                ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                : "none",
              "@media (prefers-reduced-motion: reduce)": { transition: "none" },
            }}
          >
            {track.map((project, i) => (
              <ProjectCard
                key={`${project.id}-${i}`}
                title={project.name}
                description={projectTagLine(project.tags)}
                imageSrc={project.mainImageUrl}
                cursorLabel="View Project"
                onOpen={() => setSelectedId(project.id)}
                eager
              />
            ))}
          </Box>
        </Box>
      </Box>

      {selected ? <ProjectDetailPopup project={selected} onClose={close} /> : null}
    </>
  );
}
