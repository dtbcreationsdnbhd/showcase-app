import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  CTA_BODY_LINES,
  CTA_BUTTON_LABEL,
  CTA_TITLE_LINES,
} from "@/lib/landing-content";
import {
  MOBILE_ACCENT_GRADIENT,
  MOBILE_CONTENT_WIDTH,
  MOBILE_SECTION_BG,
  MOBILE_VIEWPORT_HEIGHT_CSS,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import MobilePillButton from "./MobilePillButton";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

export default function MobileContactCta() {
  return (
    <Box
      component="section"
      id={mobileAnchorId("contact")}
      sx={{
        width: "100%",
        bgcolor: MOBILE_SECTION_BG,
        minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        component="h2"
        sx={{
          ...barlow,
          m: 0,
          // Full bleed and unpadded: the gradient runs edge to edge of the
          // frame, so any horizontal padding would shorten it.
          width: "100%",
          fontWeight: 600,
          fontSize: 32.5,
          lineHeight: "39px",
          letterSpacing: "-0.02em",
          textAlign: "center",
          backgroundImage: MOBILE_ACCENT_GRADIENT,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        {CTA_TITLE_LINES.map((line) => (
          <Box key={line} component="span" sx={{ display: "block" }}>
            {line}
          </Box>
        ))}
      </Typography>

      <Typography
        sx={{
          ...barlow,
          m: 0,
          mt: "25px",
          width: MOBILE_CONTENT_WIDTH,
          fontWeight: 500,
          fontSize: 15.5,
          lineHeight: "22.5px",
          letterSpacing: "0.02em",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        {CTA_BODY_LINES.map((line) => (
          <Box key={line} component="span" sx={{ display: "block" }}>
            {line}
          </Box>
        ))}
      </Typography>

      <Box sx={{ mt: "36px" }}>
        <MobilePillButton
          href={`#${mobileAnchorId("contact-form")}`}
          width={226}
          arrowUpRight
        >
          {CTA_BUTTON_LABEL}
        </MobilePillButton>
      </Box>
    </Box>
  );
}
