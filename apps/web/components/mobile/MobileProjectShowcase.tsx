"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { PROJECTS, SHOWCASE_TITLE } from "@/lib/landing-content";
import {
  MOBILE_ACCENT_GRADIENT,
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  MOBILE_VIEWPORT_HEIGHT_CSS,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import MobileProjectCard, { MOBILE_CARD_H } from "./MobileProjectCard";
import MobileProjectDetailPopup from "./MobileProjectDetailPopup";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

/** Cards sit closer to the edge than the copy, so the next one peeks in. */
const RAIL_INSET = 16;
const RAIL_GAP = 20;
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
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

export default function MobileProjectShowcase({
  imageSrc,
  detailImageSrc,
  /** Omit for the landing rail, which has no arrow. */
  arrowHref,
  arrowLabel,
  arrowUpRight = false,
}: {
  imageSrc: string | null;
  detailImageSrc: string | null;
  arrowHref?: string;
  arrowLabel?: string;
  arrowUpRight?: boolean;
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <Box
      component="section"
      id={mobileAnchorId("projects")}
      sx={{
        width: "100%",
        bgcolor: MOBILE_SECTION_BG,
        minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
        py: "60px",
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
            backgroundImage: MOBILE_ACCENT_GRADIENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {/* The mock stacks the words even when the line would fit. */}
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
              // The tap target sits on the gutter; the dot is inset within it.
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
                background: MOBILE_ACCENT_GRADIENT,
                boxShadow: "0px 3px 12px rgba(236, 115, 255, 0.5)",
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
        {PROJECTS.map((project) => (
          <MobileProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            imageSrc={imageSrc}
            onOpen={() => setOpenKey(project.title)}
          />
        ))}
        {/* Lets the last card snap clear of the right edge. */}
        <Box aria-hidden sx={{ flexShrink: 0, width: `${RAIL_INSET}px` }} />
      </Box>

      <MobileProjectDetailPopup
        projectKey={openKey}
        onClose={() => setOpenKey(null)}
        imageSrc={detailImageSrc}
      />
    </Box>
  );
}
