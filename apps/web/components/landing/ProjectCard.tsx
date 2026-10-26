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
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(198, 206, 214, 0.36) 42%, rgba(132, 140, 150, 0.42) 100%)",
          backdropFilter: "blur(22px) saturate(1.35)",
          WebkitBackdropFilter: "blur(22px) saturate(1.35)",
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.72), inset 0 -16px 28px rgba(8, 12, 18, 0.18)",
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
            style={{
              objectFit: "contain",
              objectPosition: "center",
              zIndex: 1,
              filter:
                "drop-shadow(0 0 1px rgba(255, 255, 255, 0.85)) drop-shadow(0 18px 28px rgba(0, 0, 0, 0.55))",
            }}
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
              "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 28%)",
            pointerEvents: "none",
            zIndex: 0,
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
            aria-hidden
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: figmaPx(-280),
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(8, 12, 18, 0) 0%, rgba(8, 12, 18, 0.22) 58%, rgba(8, 12, 18, 0.4) 100%)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              maskImage:
                "linear-gradient(180deg, transparent 0%, transparent 12%, rgba(0, 0, 0, 0.12) 38%, rgba(0, 0, 0, 0.4) 62%, #000 90%)",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, transparent 12%, rgba(0, 0, 0, 0.12) 38%, rgba(0, 0, 0, 0.4) 62%, #000 90%)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
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
