"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useId, useState } from "react";
import {
  FAQ_GROUPS,
  FAQ_SUBTITLE,
  FAQ_TITLE,
  type FaqItem,
} from "@/lib/landing-content";
import {
  GLASS_BG,
  GLASS_SHADOW,
  GOLD_RIM,
  goldTextSx,
} from "@/lib/gold-theme";
import {
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  MOBILE_VIEWPORT_HEIGHT_CSS,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import MobileTitleReveal from "./MobileTitleReveal";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const GROUP_OFFSETS = FAQ_GROUPS.map((_, g) =>
  FAQ_GROUPS.slice(0, g).reduce((sum, group) => sum + group.items.length, 0),
);

function PlusIcon({ open }: { open: boolean }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={{
        width: 18,
        height: 18,
        flexShrink: 0,
        display: "block",
        transform: open ? "rotate(45deg)" : "none",
        transition: "transform 0.3s ease",
      }}
    >
      <path
        d="M12 4v16M4 12h16"
        fill="none"
        stroke={open ? "#FFD866" : "rgba(255, 255, 255, 0.7)"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Box>
  );
}

function Answer({ item }: { item: FaqItem }) {
  const textSx = {
    ...barlow,
    m: 0,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "160%",
    letterSpacing: "0.01em",
    color: "rgba(255, 255, 255, 0.82)",
  } as const;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pl: "16px",
        pr: "16px",
        pb: "16px",
      }}
    >
      {item.answer ? <Typography sx={textSx}>{item.answer}</Typography> : null}
      {item.points ? (
        <Box
          component="ul"
          sx={{
            m: 0,
            p: 0,
            pl: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {item.points.map((point) => (
            <Box component="li" key={point.label} sx={textSx}>
              <Box component="span" sx={{ fontWeight: 700, color: "#FFE08A" }}>
                {point.label}
              </Box>
              {` — ${point.text}`}
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export default function MobileFaq() {
  const baseId = useId();
  const [group, setGroup] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const items = FAQ_GROUPS[group].items;

  const selectGroup = (index: number) => {
    setGroup(index);
    setOpen(0);
  };

  return (
    <Box
      component="section"
      id={mobileAnchorId("faq")}
      sx={{ width: "100%", bgcolor: MOBILE_SECTION_BG }}
    >
      {/* Same scroll-hold as desktop FAQ / mobile Showcase title. */}
      <MobileTitleReveal>
        <Box
          sx={{
            width: "100%",
            maxHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
            overflowY: "auto",
            px: `${MOBILE_GUTTER}px`,
            py: "40px",
            boxSizing: "border-box",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
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
            {FAQ_TITLE}
          </Typography>
          <Typography
            sx={{
              ...barlow,
              mt: "12px",
              mb: "28px",
              fontWeight: 500,
              fontSize: 15,
              lineHeight: "150%",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            {FAQ_SUBTITLE}
          </Typography>

          <Box
            role="tablist"
            aria-label="FAQ topics"
            sx={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              pb: "4px",
              mb: "20px",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {FAQ_GROUPS.map((g, index) => {
              const active = index === group;
              return (
                <Box
                  key={g.title}
                  component="button"
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${index}`}
                  aria-selected={active}
                  aria-controls={`${baseId}-panel`}
                  onClick={() => selectGroup(index)}
                  sx={{
                    ...barlow,
                    flexShrink: 0,
                    py: "10px",
                    px: "16px",
                    border: "1px solid",
                    borderColor: active ? GOLD_RIM : "rgba(255, 214, 128, 0.22)",
                    borderRadius: "999px",
                    bgcolor: active
                      ? "rgba(255, 214, 128, 0.12)"
                      : "transparent",
                    color: active ? "#FFE08A" : "rgba(255, 255, 255, 0.6)",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: "130%",
                    cursor: "pointer",
                    appearance: "none",
                    whiteSpace: "nowrap",
                    transition:
                      "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
                    "&:focus-visible": {
                      outline: "2px solid #FFD866",
                      outlineOffset: 2,
                    },
                  }}
                >
                  {g.title}
                </Box>
              );
            })}
          </Box>

          <Box
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${group}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {items.map((item, index) => {
              const isOpen = open === index;
              const answerId = `${baseId}-answer-${group}-${index}`;
              const number = String(GROUP_OFFSETS[group] + index + 1).padStart(
                2,
                "0",
              );
              return (
                <Box
                  key={item.question}
                  sx={{
                    border: "1px solid",
                    borderColor: isOpen ? GOLD_RIM : "rgba(255, 214, 128, 0.22)",
                    borderRadius: "14px",
                    background: isOpen ? GLASS_BG : "rgba(255, 255, 255, 0.06)",
                    boxShadow: isOpen ? GLASS_SHADOW : "none",
                    transition:
                      "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    sx={{
                      ...barlow,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      py: "14px",
                      px: "16px",
                      border: 0,
                      bgcolor: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      appearance: "none",
                      color: "#FFFFFF",
                      outline: "none",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        flexShrink: 0,
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#FFD866",
                      }}
                    >
                      {number}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        flex: 1,
                        fontWeight: 600,
                        fontSize: 15,
                        lineHeight: "135%",
                      }}
                    >
                      {item.question}
                    </Box>
                    <PlusIcon open={isOpen} />
                  </Box>
                  <Box
                    id={answerId}
                    role="region"
                    aria-hidden={!isOpen}
                    sx={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.35s ease",
                      "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                      },
                    }}
                  >
                    <Box sx={{ overflow: "hidden", minHeight: 0 }}>
                      <Answer item={item} />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </MobileTitleReveal>
    </Box>
  );
}
