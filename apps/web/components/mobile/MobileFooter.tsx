import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { COPYRIGHT_LINES } from "@/lib/landing-content";
import { MOBILE_ACCENT_GRADIENT } from "@/lib/landing-layout-mobile";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const FOOTER_H = 221;
const COPY_TOP = 25.3;
const WORDMARK = "APEX";
const WORDMARK_SIZE = 184.3;
/**
 * `line-height: 100%` puts the baseline 0.9em below the box, which lands the
 * cap top at y 117 and lets the rest of the glyphs run past the footer edge —
 * the mock crops them the same way.
 */
const WORDMARK_TOP = 80.5;

export default function MobileFooter() {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        height: FOOTER_H,
        bgcolor: "#120D27",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          ...barlow,
          position: "absolute",
          left: 0,
          top: `${COPY_TOP}px`,
          width: "100%",
          zIndex: 1,
          m: 0,
          fontWeight: 500,
          fontSize: 16.5,
          lineHeight: "160%",
          letterSpacing: "0.02em",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        {COPYRIGHT_LINES.map((line) => (
          <Box key={line} component="span" sx={{ display: "block" }}>
            {line}
          </Box>
        ))}
      </Typography>

      <Box
        aria-hidden
        sx={{
          ...barlow,
          position: "absolute",
          left: 0,
          top: `${WORDMARK_TOP}px`,
          width: "100%",
          m: 0,
          fontWeight: 700,
          fontSize: WORDMARK_SIZE,
          lineHeight: "100%",
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {/* Inline, so the gradient spans the word rather than the full frame. */}
        <Box
          component="span"
          sx={{
            backgroundImage: MOBILE_ACCENT_GRADIENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {WORDMARK}
        </Box>
      </Box>
    </Box>
  );
}
