"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

export const MOBILE_CARD_W = 374;
export const MOBILE_CARD_H = 562;
const CARD_PAD = 25;

export default function MobileProjectCard({
  title,
  description,
  imageSrc,
  onOpen,
}: {
  title: string;
  description: string;
  imageSrc: string | null;
  onOpen: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onOpen}
      sx={{
        position: "relative",
        flexShrink: 0,
        width: MOBILE_CARD_W,
        height: MOBILE_CARD_H,
        p: 0,
        m: 0,
        border: 0,
        appearance: "none",
        textAlign: "left",
        cursor: "pointer",
        borderRadius: "18px",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(198, 206, 214, 0.36) 42%, rgba(132, 140, 150, 0.42) 100%)",
        backdropFilter: "blur(22px) saturate(1.35)",
        WebkitBackdropFilter: "blur(22px) saturate(1.35)",
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.72), inset 0 -16px 28px rgba(8, 12, 18, 0.18)",
        scrollSnapAlign: "center",
      }}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="85vw"
          style={{
            objectFit: "contain",
            objectPosition: "center",
            zIndex: 1,
            filter:
              "drop-shadow(0 0 1px rgba(255, 255, 255, 0.85)) drop-shadow(0 18px 28px rgba(0, 0, 0, 0.55))",
          }}
        />
      ) : null}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 28%)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          px: `${CARD_PAD}px`,
          pt: "28px",
          pb: `${CARD_PAD}px`,
          boxSizing: "border-box",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "-220px",
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
        <Typography
          component="h3"
          sx={{
            ...barlow,
            m: 0,
            fontWeight: 600,
            fontSize: 26,
            lineHeight: "31px",
            color: "#FFFFFF",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            ...barlow,
            m: 0,
            mt: "9px",
            fontWeight: 500,
            fontSize: 16,
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
  );
}
