import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getLandingProcessStepSrc } from "@/lib/landing-assets";
import {
  PROCESS_INTRO_TEXT,
  PROCESS_STEPS,
  PROCESS_TITLE_SHORT,
} from "@/lib/landing-content";
import {
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import MobileProcessSteps from "./MobileProcessSteps";
import MobileTitleReveal from "./MobileTitleReveal";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const body = {
  ...barlow,
  m: 0,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "140%",
  color: "#FFFFFF",
} as const;

export default function MobileHowWeWork() {
  return (
    <Box
      component="section"
      id={mobileAnchorId("how-we-work")}
      sx={{ width: "100%", bgcolor: MOBILE_SECTION_BG }}
    >
      <MobileTitleReveal>
      <Box
        sx={{
          px: `${MOBILE_GUTTER}px`,
          py: "60px",
          boxSizing: "border-box",
        }}
      >
        <Typography
          component="h2"
          sx={{
            ...barlow,
            m: 0,
            fontWeight: 600,
            fontSize: 36,
            lineHeight: "44px",
            letterSpacing: "-0.02em",
            backgroundImage:
              "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {PROCESS_TITLE_SHORT}
        </Typography>

        <Typography sx={{ ...body, mt: "15px" }}>
          {PROCESS_INTRO_TEXT}
        </Typography>
      </Box>
      </MobileTitleReveal>

      <MobileProcessSteps
        steps={PROCESS_STEPS.map((step) => ({
          n: step.n,
          title: step.title,
          description: step.description,
          src: getLandingProcessStepSrc(step.image),
        }))}
      />
    </Box>
  );
}
