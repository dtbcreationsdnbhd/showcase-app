import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FOOTER_HEIGHT, figmaPx } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        height: FOOTER_HEIGHT,
        bgcolor: "#120D27",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          ...barlow,
          position: "absolute",
          width: figmaPx(1086),
          height: figmaPx(500),
          left: figmaPx(177),
          top: figmaPx(35),
          m: 0,
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: figmaPx(375),
          lineHeight: "100%",
          textAlign: "center",
          textTransform: "uppercase",
          backgroundImage: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          whiteSpace: "nowrap",
        }}
      >
        APEX
      </Box>

      <Typography
        sx={{
          ...barlow,
          position: "absolute",
          width: "100%",
          height: figmaPx(26),
          left: 0,
          top: figmaPx(35),
          zIndex: 1,
          m: 0,
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: figmaPx(12),
          lineHeight: "160%",
          textAlign: "center",
          letterSpacing: "0.02em",
          color: "#FFFFFF",
        }}
      >
        © Copyright 2026, All Rights Reserved by Apex Digital Solutions
      </Typography>
    </Box>
  );
}
