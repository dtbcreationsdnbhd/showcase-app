import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { MOBILE_ACCENT_GRADIENT } from "@/lib/landing-layout-mobile";

const PILL_H = 55;
const DISC = 42;
const ARROW = 14;

export default function MobilePillButton({
  children,
  href = "#",
  width,
  arrowUpRight = false,
}: {
  children: ReactNode;
  href?: string;
  width?: number;
  arrowUpRight?: boolean;
}) {
  return (
    <Box
      component="a"
      href={href}
      className="hover-grow"
      sx={{
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: width ?? "auto",
        height: PILL_H,
        pl: "22px",
        pr: "6px",
        background: MOBILE_ACCENT_GRADIENT,
        boxShadow: "0px 4px 20px rgba(236, 115, 255, 0.5)",
        borderRadius: "9999px",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily:
            'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
          fontWeight: 600,
          fontSize: 18,
          lineHeight: "22px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Box>

      <Box
        aria-hidden
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: DISC,
          height: DISC,
          flexShrink: 0,
          background: "rgba(255, 255, 255, 0.4)",
          borderRadius: "50%",
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 12 12"
          sx={{
            width: ARROW,
            height: ARROW,
            display: "block",
            transform: arrowUpRight ? "none" : "rotate(45deg)",
          }}
        >
          <path
            d="M1.8 10.2 10.2 1.8M5.4 1.8h4.8v4.8"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Box>
      </Box>
    </Box>
  );
}
