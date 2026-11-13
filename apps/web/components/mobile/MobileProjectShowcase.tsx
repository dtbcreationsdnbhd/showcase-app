"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { SHOWCASE_TITLE } from "@/lib/landing-content";
import { projectTagLine, type ShowcaseProject } from "@/lib/projects";
import {
  GOLD_BUTTON_SHADOW_SM,
  GOLD_FILL,
  GOLD_INK,
  goldTextSx,
} from "@/lib/gold-theme";
import {
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import MobileProjectCard, {
  MOBILE_CARD_H,
  MOBILE_CARD_W,
} from "./MobileProjectCard";
import MobileProjectDetailPopup from "./MobileProjectDetailPopup";
import MobileTitleReveal from "./MobileTitleReveal";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

/** Cards sit closer to the edge than the copy, so the next one peeks in. */
const RAIL_INSET = 16;
const RAIL_GAP = 20;
const STEP = MOBILE_CARD_W + RAIL_GAP;
const AUTOPLAY_MS = 4000;
const RESUME_AFTER_MS = 6000;
const ARROW_HIT = 72;
const ARROW_DOT = 48;

function ArrowRightIcon({ upRight }: { upRight: boolean }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 20 20"
      aria-hidden
      sx={{
        width: 22,
        height: 22,
        display: "block",
        transform: upRight ? "rotate(-45deg)" : "none",
      }}
    >
      <path
        d="M3 10h12.5M11.2 4.8 17 10l-5.8 5.2"
        fill="none"
        stroke={GOLD_INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

export default function MobileProjectShowcase({
  projects,
  /** Omit for the landing rail, which has no arrow. */
  arrowHref,
  arrowLabel,
  arrowUpRight = false,
}: {
  projects: readonly ShowcaseProject[];
  arrowHref?: string;
  arrowLabel?: string;
  arrowUpRight?: boolean;
}) {
  const [openProject, setOpenProject] = useState<ShowcaseProject | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lastInteraction = useRef(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || projects.length < 2 || openProject) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (Date.now() - lastInteraction.current < RESUME_AFTER_MS) return;
      const el = railRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + STEP;
      el.scrollTo({
        left: next >= max - 8 ? 0 : next,
        behavior: "smooth",
      });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [projects.length, reduced, openProject]);

  const noteInteraction = () => {
    lastInteraction.current = Date.now();
  };

  if (projects.length === 0) return null;

  return (
    <Box
      component="section"
      id={mobileAnchorId("projects")}
      sx={{ width: "100%", bgcolor: MOBILE_SECTION_BG }}
    >
      {/* Same scroll-hold / enter as Why Us title — rail stays a horizontal strip. */}
      <MobileTitleReveal>
        <Box
          sx={{
            width: "100%",
            py: "40px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              px: `${MOBILE_GUTTER}px`,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Typography
              component="h2"
              sx={{
                ...barlow,
                m: 0,
                fontWeight: 600,
                fontSize: 48,
                lineHeight: "58px",
                letterSpacing: "-0.02em",
                ...goldTextSx,
              }}
            >
              {SHOWCASE_TITLE.split(" ").map((word) => (
                <Box key={word} component="span" sx={{ display: "block" }}>
                  {word}
                </Box>
              ))}
            </Typography>

            {arrowHref ? (
              <Box
                component="a"
                href={arrowHref}
                aria-label={arrowLabel}
                sx={{
                  flexShrink: 0,
                  width: ARROW_HIT,
                  height: ARROW_HIT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                <Box
                  sx={{
                    width: ARROW_DOT,
                    height: ARROW_DOT,
                    borderRadius: "50%",
                    background: GOLD_FILL,
                    boxShadow: GOLD_BUTTON_SHADOW_SM,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowRightIcon upRight={arrowUpRight} />
                </Box>
              </Box>
            ) : null}
          </Box>

          <Box
            ref={railRef}
            onPointerDown={noteInteraction}
            onTouchStart={noteInteraction}
            onWheel={noteInteraction}
            sx={{
              mt: "34px",
              display: "flex",
              gap: `${RAIL_GAP}px`,
              px: `${RAIL_INSET}px`,
              height: MOBILE_CARD_H,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {projects.map((project) => (
              <MobileProjectCard
                key={project.id}
                title={project.name}
                description={projectTagLine(project.tags)}
                imageSrc={project.mainImageUrl}
                onOpen={() => setOpenProject(project)}
              />
            ))}
            <Box aria-hidden sx={{ flexShrink: 0, width: `${RAIL_INSET}px` }} />
          </Box>
        </Box>
      </MobileTitleReveal>

      <MobileProjectDetailPopup
        project={openProject}
        onClose={() => setOpenProject(null)}
      />
    </Box>
  );
}
