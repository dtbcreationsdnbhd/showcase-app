import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HowWeWorkStackedCards from "@/components/landing/HowWeWorkStackedCards";
import { getLandingWhyUsSrc } from "@/lib/landing-assets";
import {
  WHY_US_INTRO_SENTENCES,
  WHY_US_ITEMS,
  WHY_US_TITLE,
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
  const steps = WHY_US_ITEMS.map((item) => ({
    n: item.n,
    title: item.title,
    description: item.description,
    src: getLandingWhyUsSrc(item.image),
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
        anchorId="why-us"
        // Above the Solutions pin, below the process cards pin.
        zIndex={46}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: `${figmaPx(28)}px`,
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
              fontSize: figmaPx(64),
              lineHeight: `${figmaPx(80)}px`,
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
            {WHY_US_TITLE}
          </Typography>

          <Typography
            sx={{
              ...barlow,
              width: figmaPx(900),
              m: 0,
              fontWeight: 500,
              fontSize: figmaPx(24),
              lineHeight: "140%",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {WHY_US_INTRO_SENTENCES[0]} <br />
            {WHY_US_INTRO_SENTENCES[1]}
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
