import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { goldTextSx } from "@/lib/gold-theme";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_GUTTER,
  MOBILE_VIEWPORT_HEIGHT_CSS,
} from "@/lib/landing-layout-mobile";
import { MobileSeamLine } from "./mobile-stack";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

/** Same proportions as desktop Why Us cards (500 × 257, notch 137 × 139). */
const CARD_W = MOBILE_DESIGN_WIDTH - MOBILE_GUTTER * 2;
const CARD_H = Math.round((CARD_W * 257) / 500);
const NOTCH_W = Math.round((CARD_W * 137) / 500);
const NOTCH_H = Math.round((CARD_H * 139) / 257);
const CARD_R = Math.round((CARD_W * 30) / 500);

const CARD_PATH = (() => {
  const w = CARD_W;
  const h = CARD_H;
  const nx = NOTCH_W;
  const ny = NOTCH_H;
  const r = CARD_R;
  return `M ${nx} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${ny + r} A ${r} ${r} 0 0 1 ${r} ${ny} H ${nx - r} A ${r} ${r} 0 0 0 ${nx} ${ny - r} V 0 Z`;
})();

const CARD_BG = "#5A0F32";
const CARD_BG_CLEAR = "rgba(90, 15, 50, 0)";
const CARD_BG_SHADE = "rgba(70, 10, 38, 0.92)";

const body = {
  ...barlow,
  m: 0,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "140%",
  color: "#FFFFFF",
} as const;

export type ProcessStepCard = {
  n: string;
  title: string;
  description: string;
  src: string | null;
};

export default function MobileProcessSteps({
  steps,
}: {
  steps: ProcessStepCard[];
}) {
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {steps.map((step, index) => (
        <Box
          key={step.n}
          component="section"
          aria-label={step.title}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: index + 1,
            width: "100%",
            minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
          }}
        >
          <Box
            className="site-bg-surface"
            sx={{
              position: "relative",
              width: "100%",
              minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
              boxSizing: "border-box",
              py: "40px",
              px: `${MOBILE_GUTTER}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "18px",
              maskImage:
                index === 0
                  ? "none"
                  : "linear-gradient(180deg, transparent 0, #000 64px, #000 100%)",
              WebkitMaskImage:
                index === 0
                  ? "none"
                  : "linear-gradient(180deg, transparent 0, #000 64px, #000 100%)",
            }}
          >
            {index > 0 ? <MobileSeamLine edge="top" /> : null}

            {/* Match desktop ProcessCard: notched plate + number tab + title. */}
            <Box
              sx={{
                position: "relative",
                width: CARD_W,
                height: CARD_H,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  filter: "drop-shadow(0 0 14px rgba(255, 184, 72, 0.4))",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: CARD_BG,
                    clipPath: `path("${CARD_PATH}")`,
                  }}
                >
                  {step.src ? (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "18%",
                        right: 0,
                      }}
                    >
                      <Image
                        src={step.src}
                        alt={`${step.n} — ${step.title}`}
                        width={1000}
                        height={514}
                        sizes="100vw"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "50% 30%",
                          display: "block",
                        }}
                      />
                    </Box>
                  ) : null}
                  <Box
                    aria-hidden
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(90deg, ${CARD_BG} 14%, ${CARD_BG_CLEAR} 34%), linear-gradient(180deg, ${CARD_BG_CLEAR} 50%, ${CARD_BG_SHADE} 82%), linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 30%)`,
                    }}
                  />
                </Box>
                <Box
                  component="svg"
                  aria-hidden
                  viewBox={`0 0 ${CARD_W} ${CARD_H}`}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                  }}
                >
                  <defs>
                    <linearGradient
                      id={`mobile-why-stroke-${step.n}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#FFF3C4" />
                      <stop offset="0.45" stopColor="#FFD866" />
                      <stop offset="1" stopColor="#D27F1C" />
                    </linearGradient>
                  </defs>
                  <path
                    d={CARD_PATH}
                    fill="none"
                    stroke={`url(#mobile-why-stroke-${step.n})`}
                    strokeWidth={2}
                  />
                </Box>
              </Box>

              <Box
                aria-hidden
                sx={{
                  ...barlow,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: NOTCH_W,
                  height: NOTCH_H,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 40,
                  lineHeight: 1,
                  ...goldTextSx,
                }}
              >
                {step.n}
              </Box>
              <Typography
                sx={{
                  ...barlow,
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 14,
                  m: 0,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: 1.2,
                  color: "#FFFFFF",
                }}
              >
                {step.title}
              </Typography>
            </Box>

            <Typography sx={body}>{step.description}</Typography>
            {index === steps.length - 1 ? (
              <MobileSeamLine edge="bottom" />
            ) : null}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
