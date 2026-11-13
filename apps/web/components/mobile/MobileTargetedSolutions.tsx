import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  SOLUTIONS_INTRO_SENTENCES,
  SOLUTIONS_SUBTITLE,
  SOLUTIONS_TITLE_WORDS,
} from "@/lib/landing-content";
import {
  MOBILE_SECTION_BG,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import { goldTextSx } from "@/lib/gold-theme";
import MobileTitleReveal from "./MobileTitleReveal";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
  fontStyle: "normal",
} as const;

export default function MobileTargetedSolutions() {
  return (
    <Box
      component="section"
      id={mobileAnchorId("services")}
      sx={{
        position: "relative",
        width: "100%",
        bgcolor: MOBILE_SECTION_BG,
      }}
    >
      <MobileTitleReveal>
      {/* Desktop sets the two words side by side; the mobile frame stacks them. */}
      <Box
        component="h2"
        sx={{
          m: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {SOLUTIONS_TITLE_WORDS.map((word) => (
          <Typography
            key={word}
            component="span"
            className="solutions-title-flow"
            sx={{
              ...barlow,
              fontWeight: 700,
              fontSize: 80,
              lineHeight: "86px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {word}
          </Typography>
        ))}
      </Box>

      <Typography
        sx={{
          ...barlow,
          mt: "14px",
          fontWeight: 600,
          fontSize: 40,
          lineHeight: "48px",
          letterSpacing: "-0.02em",
          textAlign: "center",
          ...goldTextSx,
          whiteSpace: "nowrap",
        }}
      >
        {SOLUTIONS_SUBTITLE}
      </Typography>

      <Box
        sx={{
          mt: "26px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 315,
        }}
      >
        {SOLUTIONS_INTRO_SENTENCES.map((sentence) => (
          <Typography
            key={sentence}
            sx={{
              ...barlow,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "140%",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {sentence}
          </Typography>
        ))}
      </Box>
      </MobileTitleReveal>
    </Box>
  );
}
