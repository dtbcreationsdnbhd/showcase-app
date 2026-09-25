"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import MobileMenu from "@/components/mobile/MobileMenu";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  MOBILE_NAV_HEIGHT,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";

const headerFont = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
  fontStyle: "normal",
  fontWeight: 500,
} as const;

/** Three bars fold into a cross. One box, so the swap is a move instead of a cut. */
function MenuIcon({ open }: { open: boolean }) {
  const reduced = usePrefersReducedMotion();
  const line = {
    fill: "none",
    stroke: "#FFFFFF",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    transformBox: "fill-box" as const,
    transformOrigin: "center",
    transition: reduced
      ? "none"
      : "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease",
  };
  return (
    <Box
      component="svg"
      viewBox="0 0 18 18"
      aria-hidden
      sx={{ width: 18, height: 18, display: "block", overflow: "visible" }}
    >
      <path
        d="M2 5h14"
        style={{
          ...line,
          transform: open ? "translateY(4px) rotate(45deg)" : "none",
        }}
      />
      <path
        d="M2 9h14"
        style={{
          ...line,
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "none",
        }}
      />
      <path
        d="M2 13h14"
        style={{
          ...line,
          transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
        }}
      />
    </Box>
  );
}

export default function MobileNavbar({
  hrefPrefix = "",
}: {
  hrefPrefix?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: MOBILE_NAV_HEIGHT,
          pl: "47px",
          pr: "34px",
          boxSizing: "border-box",
          ...headerFont,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 180,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            maskImage:
              "linear-gradient(180deg, #000 0%, #000 35%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 0%, #000 35%, transparent 100%)",
          }}
        />
        <Box
          component="a"
          href={`${hrefPrefix}#${mobileAnchorId("top")}`}
          onClick={close}
          sx={{ position: "relative", zIndex: 1, textDecoration: "none", cursor: "pointer" }}
        >
          <Typography
            component="span"
            sx={{
              ...headerFont,
              fontWeight: 700,
              fontSize: 22,
              lineHeight: "26px",
              letterSpacing: "0.02em",
              color: "#FFFFFF",
            }}
          >
            LOGO
          </Typography>
        </Box>

        <Box
          component="button"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 44,
            height: 44,
            p: 0,
            border: "none",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            cursor: "pointer",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <MenuIcon open={open} />
        </Box>
      </Box>

      <MobileMenu open={open} onClose={close} hrefPrefix={hrefPrefix} />
    </>
  );
}
