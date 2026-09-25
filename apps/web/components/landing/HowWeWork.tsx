import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HowWeWorkStackedCards from "@/components/landing/HowWeWorkStackedCards";
import { getLandingProcessStepSrc } from "@/lib/landing-assets";
import {
  PROCESS_INTRO_SENTENCES,
  PROCESS_STEPS,
  PROCESS_TITLE,
} from "@/lib/landing-content";
import ScrollRevealPin from "@/components/landing/ScrollRevealPin";
import {
  PROCESS_CARDS_SCROLL_HEIGHT_CSS,
  TITLE_HOLD_PAGES,
  figmaPx,
} from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

export default function HowWeWork() {
  const steps = PROCESS_STEPS.map((step) => ({
    n: step.n,
    title: step.title,
    description: step.description,
    src: getLandingProcessStepSrc(step.image),
  }));

  return (
    <Box
      component="section"
      sx={{
        boxSizing: "border-box",
        width: "100%",
        bgcolor: "#050B13",
        // Sit above the Solutions sticky pin so the title is never covered.
        position: "relative",
        zIndex: 45,
      }}
    >
      <ScrollRevealPin
        holdPages={TITLE_HOLD_PAGES}
        anchorId="how-we-work"
        // Above the Solutions pin, below the process cards pin.
        zIndex={46}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: `${figmaPx(20)}px`,
            width: "100%",
          }}
        >
          <Typography
            component="h2"
            sx={{
              ...barlow,
              width: "100%",
              m: 0,
              fontWeight: 600,
              fontSize: figmaPx(36),
              lineHeight: `${figmaPx(58)}px`,
              textAlign: "center",
              letterSpacing: "-0.02em",
              backgroundImage: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            {PROCESS_TITLE}
          </Typography>

          <Typography
            sx={{
              ...barlow,
              width: figmaPx(640),
              m: 0,
              fontWeight: 500,
              fontSize: figmaPx(16.5),
              lineHeight: "140%",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {PROCESS_INTRO_SENTENCES[0]} <br />
            {PROCESS_INTRO_SENTENCES[1]}
          </Typography>
        </Box>
      </ScrollRevealPin>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: PROCESS_CARDS_SCROLL_HEIGHT_CSS,
          flexShrink: 0,
        }}
      >
        <HowWeWorkStackedCards steps={steps} />
      </Box>
    </Box>
  );
}
