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
import ScrollRevealPin from "@/components/landing/ScrollRevealPin";
import {
  GLASS_BG,
  GLASS_SHADOW,
  GOLD_RIM,
  GOLD_TEXT,
  GOLD_TEXT_GLOW,
} from "@/lib/gold-theme";
import {
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
  TITLE_HOLD_PAGES,
  figmaPx,
} from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const GRADIENT = GOLD_TEXT;
const CONTENT_W = figmaPx(1100);
const SIDE_W = figmaPx(280);
const COL_GAP = figmaPx(80);
// Fits the tallest group fully open, so toggling never moves the layout.
const PANEL_H = figmaPx(500);
const PAD_TOP = figmaPx(80);
const PAD_BOTTOM = figmaPx(40);

/** Running 01–10 numbering across every group. */
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
        width: figmaPx(18),
        height: figmaPx(18),
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
    fontSize: figmaPx(14.5),
    lineHeight: "160%",
    letterSpacing: "0.01em",
    color: "rgba(255, 255, 255, 0.82)",
  } as const;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: `${figmaPx(8)}px`,
        // Indent past the number column so the answer lines up with the question.
        pl: `${figmaPx(22 + 38)}px`,
        pr: `${figmaPx(22)}px`,
        pb: `${figmaPx(18)}px`,
      }}
    >
      {item.answer ? <Typography sx={textSx}>{item.answer}</Typography> : null}
      {item.points ? (
        <Box
          component="ul"
          sx={{
            m: 0,
            p: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: `${figmaPx(6)}px`,
          }}
        >
          {item.points.map((point) => (
            <Box
              key={point.label}
              component="li"
              sx={{
                ...textSx,
                position: "relative",
                pl: `${figmaPx(16)}px`,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "0.6em",
                  width: figmaPx(6),
                  height: figmaPx(6),
                  borderRadius: "50%",
                  background: GRADIENT,
                },
              }}
            >
              <Box
                component="strong"
                sx={{ color: "#FFFFFF", fontWeight: 600 }}
              >
                {point.label}:
              </Box>{" "}
              {point.text}
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export default function Faq() {
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
      sx={{
        boxSizing: "border-box",
        width: "100%",
        bgcolor: "transparent",
        position: "relative",
      }}
    >
      <ScrollRevealPin holdPages={TITLE_HOLD_PAGES} anchorId="faq">
        <Box
          sx={{
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
            pt: `${PAD_TOP}px`,
            pb: `${PAD_BOTTOM}px`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: `${COL_GAP}px`,
              width: CONTENT_W,
              height: PANEL_H,
              maxHeight: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: SIDE_W,
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
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  backgroundImage: GRADIENT,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  filter: GOLD_TEXT_GLOW,
                  alignSelf: "flex-start",
                }}
              >
                {FAQ_TITLE}
              </Typography>
              <Typography
                sx={{
                  ...barlow,
                  mt: `${figmaPx(14)}px`,
                  mb: `${figmaPx(32)}px`,
                  fontWeight: 500,
                  fontSize: figmaPx(15),
                  lineHeight: "150%",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                {FAQ_SUBTITLE}
              </Typography>

              <Box
                role="tablist"
                aria-orientation="vertical"
                aria-label="FAQ topics"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${figmaPx(6)}px`,
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
                        position: "relative",
                        textAlign: "left",
                        py: `${figmaPx(12)}px`,
                        px: `${figmaPx(18)}px`,
                        border: 0,
                        borderRadius: `${figmaPx(10)}px`,
                        bgcolor: active
                          ? "rgba(255, 214, 128, 0.12)"
                          : "transparent",
                        color: active ? "#FFE08A" : "rgba(255, 255, 255, 0.6)",
                        fontWeight: 600,
                        fontSize: figmaPx(16),
                        lineHeight: "130%",
                        cursor: "pointer",
                        appearance: "none",
                        transition:
                          "color 0.2s ease, background-color 0.2s ease",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "22%",
                          bottom: "22%",
                          width: figmaPx(3),
                          borderRadius: figmaPx(3),
                          background: GRADIENT,
                          opacity: active ? 1 : 0,
                          transition: "opacity 0.2s ease",
                        },
                        "&:hover": { color: "#FFFFFF" },
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
            </Box>

            <Box
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${group}`}
              sx={{
                flex: 1,
                minWidth: 0,
                height: "100%",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: `${figmaPx(10)}px`,
                pr: `${figmaPx(8)}px`,
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
              }}
            >
              {items.map((item, index) => {
                const isOpen = open === index;
                const answerId = `${baseId}-answer-${group}-${index}`;
                const number = String(
                  GROUP_OFFSETS[group] + index + 1,
                ).padStart(2, "0");
                return (
                  <Box
                    key={item.question}
                    sx={{
                      flexShrink: 0,
                      border: "1px solid",
                      borderColor: isOpen
                        ? GOLD_RIM
                        : "rgba(255, 214, 128, 0.22)",
                      borderRadius: `${figmaPx(14)}px`,
                      background: isOpen
                        ? GLASS_BG
                        : "rgba(255, 255, 255, 0.06)",
                      boxShadow: isOpen ? GLASS_SHADOW : "none",
                      transition:
                        "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
                      "&:has(> button:focus-visible)": {
                        borderColor: "#FFD866",
                      },
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
                        gap: `${figmaPx(12)}px`,
                        width: "100%",
                        py: `${figmaPx(16)}px`,
                        px: `${figmaPx(22)}px`,
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
                          width: figmaPx(26),
                          flexShrink: 0,
                          fontWeight: 600,
                          fontSize: figmaPx(14),
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
                          fontSize: figmaPx(17),
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
        </Box>
      </ScrollRevealPin>
    </Box>
  );
}
