import Box from "@mui/material/Box";
import type { ReactNode } from "react";

export default function PillButton({
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
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: width ?? "auto",
        height: 52,
        pl: "20px",
        pr: "6px",
        background: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
        boxShadow: "0px 4px 20px rgba(236, 115, 255, 0.5)",
        borderRadius: "9999px",
        textDecoration: "none",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "12px",
          height: 40,
        }}
      >
        <Box
          component="span"
          sx={{
            fontFamily:
              'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
            fontStyle: "normal",
            fontWeight: 500,
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
            p: "12px",
            width: 40,
            height: 40,
            boxSizing: "border-box",
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "99px",
            flexShrink: 0,
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 16 16"
            sx={{
              width: 16,
              height: 16,
              display: "block",
              transform: arrowUpRight ? "rotate(-45deg)" : "none",
            }}
          >
            <path
              d="M2 8h10.5M9.2 3.8 13.8 8 9.2 12.2"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
