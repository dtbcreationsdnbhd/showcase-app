"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import MobileMenu from "@/components/mobile/MobileMenu";
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

const strokeProps = {
  fill: "none",
  stroke: "#FFFFFF",
  strokeWidth: "1.6",
  strokeLinecap: "round",
} as const;

/** The bars want a wide box, the cross a square one — sharing one skews the cross. */
function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <Box
        component="svg"
        viewBox="0 0 18 18"
        aria-hidden
        sx={{ width: 18, height: 18, display: "block" }}
      >
        <path d="M2 2 16 16M16 2 2 16" {...strokeProps} />
      </Box>
    );
  }

  return (
    <Box
      component="svg"
      viewBox="0 0 18 12"
      aria-hidden
      sx={{ width: 18, height: 12, display: "block" }}
    >
      <path d="M0 1h18M0 6h18M0 11h18" {...strokeProps} />
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
          component="a"
          href={`${hrefPrefix}#${mobileAnchorId("top")}`}
          onClick={close}
          sx={{ textDecoration: "none", cursor: "pointer" }}
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
          }}
        >
          <MenuIcon open={open} />
        </Box>
      </Box>

      <MobileMenu open={open} onClose={close} hrefPrefix={hrefPrefix} />
    </>
  );
}
