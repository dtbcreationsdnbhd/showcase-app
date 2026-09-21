import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getLandingServiceIconSrc } from "@/lib/landing-assets";
import SolutionsStickyRows from "@/components/landing/SolutionsStickyRows";
import {
  SOLUTIONS_INTRO_HEIGHT,
  SOLUTIONS_ROWS_HEIGHT,
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
  fontSize: figmaPx(72),
  lineHeight: `${figmaPx(96)}px`,
  textAlign: "center",
  textTransform: "uppercase",
  color: "#0A121C",
  mixBlendMode: "screen",
  whiteSpace: "nowrap",
} as const;

export default function TargetedSolutions() {
  const iconSrcs = {
    ai: getLandingServiceIconSrc("ai"),
    web: getLandingServiceIconSrc("web"),
    star: getLandingServiceIconSrc("star"),
    refresh: getLandingServiceIconSrc("refresh"),
  };
  const watermarkW = figmaPx(869);

  return (
    <Box
      component="section"
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        height: SOLUTIONS_INTRO_HEIGHT + SOLUTIONS_ROWS_HEIGHT,
        bgcolor: "#050B13",
        position: "relative",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          py: `${figmaPx(64)}px`,
          px: 0,
          width: "100%",
          height: SOLUTIONS_INTRO_HEIGHT,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            width: figmaPx(316),
            height: figmaPx(316),
            left: figmaPx(-101),
            top: figmaPx(-106),
            bgcolor: "#563DFE",
            opacity: 0.1,
            filter: `blur(${figmaPx(212)}px)`,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: figmaPx(150),
            flexShrink: 0,
            scrollMarginTop: `${figmaPx(50)}px`,
          }}
          id="services"
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
              height: figmaPx(96),
              left: `calc(50% - ${watermarkW}px / 2)`,
              top: figmaPx(35),
              m: 0,
            }}
          >
            <Typography component="span" sx={{ ...watermarkWord }}>
              Targeted
            </Typography>
            <Typography component="span" sx={{ ...watermarkWord }}>
              Solutions
            </Typography>
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
            height: figmaPx(144),
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              ...barlow,
              width: "100%",
              height: figmaPx(58),
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: figmaPx(36),
              lineHeight: `${figmaPx(58)}px`,
              textAlign: "center",
              letterSpacing: "-0.02em",
              backgroundImage:
                "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            for your business growth.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
              gap: `${figmaPx(10)}px`,
              width: figmaPx(640),
              height: figmaPx(62),
            }}
          >
            <Typography
              sx={{
                ...barlow,
                width: figmaPx(797),
                height: figmaPx(62),
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: figmaPx(16.5),
                lineHeight: "140%",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              We provide precise, scalable digital services designed to solve
              your operational bottlenecks. Choose the tools you need to
              streamline your workflow and drive conversions.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          flexShrink: 0,
          pb: `${figmaPx(220)}px`,
        }}
      >
        <SolutionsStickyRows iconSrcs={iconSrcs} />
      </Box>
    </Box>
  );
}
