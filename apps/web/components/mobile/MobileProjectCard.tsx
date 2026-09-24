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
        bgcolor: "#0C1622",
        scrollSnapAlign: "center",
      }}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="85vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      ) : null}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 74%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          px: `${CARD_PAD}px`,
          pb: `${CARD_PAD}px`,
          boxSizing: "border-box",
        }}
      >
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
