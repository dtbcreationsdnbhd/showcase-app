import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { getLandingProcessStepSrc } from "@/lib/landing-assets";
import {
  PROCESS_INTRO_TEXT,
  PROCESS_STEPS,
  PROCESS_TITLE_SHORT,
} from "@/lib/landing-content";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_DIVIDER_COLOR,
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  MOBILE_VIEWPORT_HEIGHT_CSS,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

/** Card artwork is 1024x576 and carries its own transparent margin, so it runs
 *  full bleed while the copy stays inside the gutter. */
const CARD_W = MOBILE_DESIGN_WIDTH;
const CARD_H = Math.round((CARD_W * 576) / 1024);

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
      <Box
        sx={{
          // The title owns a whole screen, then the steps scroll past it.
          // `minHeight`, so a short device grows the page instead of clipping.
          minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
          px: `${MOBILE_GUTTER}px`,
          py: "60px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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

      {PROCESS_STEPS.map((step) => {
        const src = getLandingProcessStepSrc(step.image);
        return (
          <Box
            key={step.n}
            sx={{
              // One step per screen, same rhythm as the service pages.
              minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
              py: "40px",
              boxSizing: "border-box",
              borderBottom: `1px solid ${MOBILE_DIVIDER_COLOR}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {src ? (
              <Image
                src={src}
                alt={`${step.n} — ${step.title}`}
                width={1024}
                height={576}
                sizes="100vw"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  display: "block",
                }}
              />
            ) : null}
            <Typography
              sx={{
                ...body,
                // The artwork carries ~26px of transparent margin below the
                // card, so the gap reads larger than this value.
                mt: "58px",
                px: `${MOBILE_GUTTER}px`,
              }}
            >
              {step.description}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
