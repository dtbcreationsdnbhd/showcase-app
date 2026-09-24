"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { figmaPx } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = figmaPx(276);
const CARD_H = figmaPx(414.75);
const CARD_R = figmaPx(18);
const TITLE_PAD = figmaPx(18);
const TITLE_INNER_W = CARD_W - TITLE_PAD * 2;

export default function ProjectCard({
  title,
  description,
  imageSrc,
  cursorLabel,
  href,
  onOpen,
}: {
  title: string;
  description: string;
  imageSrc: string | null;
  cursorLabel?: string;
  href?: string;
  onOpen?: () => void;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        flexShrink: 0,
        overflow: "visible",
      }}
    >
      <Box
        component={href ? "a" : "div"}
        href={href}
        data-cursor-label={cursorLabel}
        onClick={onOpen}
        className={href || onOpen ? "hover-grow hover-grow-soft" : undefined}
        sx={{
          position: "relative",
          isolation: "isolate",
          display: "block",
          width: "100%",
          height: "100%",
          borderRadius: `${CARD_R}px`,
          overflow: "hidden",
          textDecoration: "none",
          color: "inherit",
          cursor: href || onOpen ? "pointer" : "auto",
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes={`${CARD_W}px`}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "#0C1622",
            }}
          />
        )}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 74%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: `${TITLE_PAD}px`,
            gap: `${figmaPx(8)}px`,
            width: CARD_W,
            height: figmaPx(88),
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              gap: `${figmaPx(9)}px`,
              width: TITLE_INNER_W,
            }}
          >
            <Typography
              component="h3"
              sx={{
                ...barlow,
                width: TITLE_INNER_W,
                m: 0,
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: figmaPx(19.5),
                lineHeight: `${figmaPx(23)}px`,
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                ...barlow,
                width: TITLE_INNER_W,
                m: 0,
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: figmaPx(12),
                lineHeight: "160%",
                letterSpacing: "0.02em",
                color: "rgba(255, 255, 255, 0.5)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
