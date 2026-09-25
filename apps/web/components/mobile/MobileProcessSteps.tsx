"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRef } from "react";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  MOBILE_VIEWPORT_HEIGHT_CSS,
} from "@/lib/landing-layout-mobile";
import { MobileSeamLine, useMobileStackLag } from "./mobile-stack";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

/** Card artwork is 1024x576 and carries its own transparent margin, so it runs
 *  full bleed while the copy stays inside the gutter. */
const CARD_W = MOBILE_DESIGN_WIDTH;
const CARD_H = Math.round((CARD_W * 576) / 1024);

const body = {
  ...barlow,
  m: 0,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "140%",
  color: "#FFFFFF",
} as const;

export type ProcessStepCard = {
  n: string;
  title: string;
  description: string;
  src: string | null;
};

export default function MobileProcessSteps({
  steps,
}: {
  steps: ProcessStepCard[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useMobileStackLag(wrapRef);

  return (
    <Box ref={wrapRef} sx={{ position: "relative", width: "100%" }}>
      {steps.map((step, index) => (
        <Box
          key={step.n}
          component="section"
          aria-label={step.title}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: index + 1,
            width: "100%",
            minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
          }}
        >
          <Box
            data-sheet=""
            sx={{
              position: "relative",
              width: "100%",
              minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
              boxSizing: "border-box",
              py: "40px",
              bgcolor: MOBILE_SECTION_BG,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <MobileSeamLine edge="top" />
            {step.src ? (
              <Image
                src={step.src}
                alt={`${step.n} — ${step.title}`}
                width={1024}
                height={576}
                sizes="100vw"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  display: "block",
                }}
              />
            ) : null}
            <Typography
              sx={{
                ...body,
                // The artwork carries ~26px of transparent margin below the
                // card, so the gap reads larger than this value.
                mt: "58px",
                px: `${MOBILE_GUTTER}px`,
              }}
            >
              {step.description}
            </Typography>
            {index === steps.length - 1 ? (
              <MobileSeamLine edge="bottom" />
            ) : null}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
