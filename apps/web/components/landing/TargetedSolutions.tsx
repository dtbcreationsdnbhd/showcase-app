import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getLandingServiceIconSrc, getLandingServiceMorphSrc } from "@/lib/landing-assets";
import SolutionsStickyRows from "@/components/landing/SolutionsStickyRows";
import ScrollRevealPin from "@/components/landing/ScrollRevealPin";
import SolutionsBackdrop from "@/components/landing/SolutionsBackdrop";
import { goldTextSx } from "@/lib/gold-theme";
import {
  SOLUTIONS_INTRO_TEXT,
  SOLUTIONS_SUBTITLE,
  SOLUTIONS_TITLE_WORDS,
} from "@/lib/landing-content";
import {
  SOLUTIONS_RELEASE_HEIGHT,
  TITLE_HOLD_PAGES,
  figmaPx,
} from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const watermarkWord = {
  ...barlow,
  m: 0,
  fontStyle: "normal",
  fontWeight: 700,
  fontSize: figmaPx(92),
  lineHeight: `${figmaPx(120)}px`,
  textAlign: "center",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
} as const;

export default function TargetedSolutions() {
  const iconSrcs = {
    ai: getLandingServiceIconSrc("ai"),
    web: getLandingServiceIconSrc("web"),
    star: getLandingServiceIconSrc("star"),
    refresh: getLandingServiceIconSrc("refresh"),
  };
  const morphSrc = getLandingServiceMorphSrc();
  const watermarkW = figmaPx(1120);

  return (
    <Box
      component="section"
      id="solutions"
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        bgcolor: "transparent",
        position: "relative",
        overflow: "visible",
      }}
    >
      <SolutionsBackdrop targetId="solutions" />
      <ScrollRevealPin holdPages={TITLE_HOLD_PAGES} anchorId="services">
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: figmaPx(180),
            flexShrink: 0,
          }}
        >
          <Box
            component="h2"
            sx={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: `${figmaPx(26)}px`,
              width: watermarkW,
              height: figmaPx(120),
              left: `calc(50% - ${watermarkW}px / 2)`,
              top: figmaPx(35),
              m: 0,
            }}
          >
            {SOLUTIONS_TITLE_WORDS.map((word) => (
              <Typography
                key={word}
                component="span"
                className="solutions-title-flow solutions-title-3d"
                sx={{ ...watermarkWord }}
              >
                {word}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            gap: `${figmaPx(36)}px`,
            width: "100%",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              ...barlow,
              width: "100%",
              height: figmaPx(68),
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: figmaPx(44),
              lineHeight: `${figmaPx(68)}px`,
              textAlign: "center",
              letterSpacing: "-0.02em",
              ...goldTextSx,
              filter:
                "drop-shadow(0 1.5px 0 #A9620F) drop-shadow(0 1.5px 0 #6B3804) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.6))",
              whiteSpace: "nowrap",
            }}
          >
            {SOLUTIONS_SUBTITLE}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
              gap: `${figmaPx(10)}px`,
              width: figmaPx(820),
            }}
          >
            <Typography
              sx={{
                ...barlow,
                width: figmaPx(900),
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: figmaPx(20),
                lineHeight: "140%",
                textAlign: "center",
                textWrap: "balance",
                color: "#FFFFFF",
              }}
            >
              {SOLUTIONS_INTRO_TEXT}
            </Typography>
          </Box>
        </Box>
      </ScrollRevealPin>

      <Box
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          flexShrink: 0,
          pb: `${SOLUTIONS_RELEASE_HEIGHT}px`,
        }}
      >
        <SolutionsStickyRows iconSrcs={iconSrcs} morphSrc={morphSrc} />
      </Box>
    </Box>
  );
}
