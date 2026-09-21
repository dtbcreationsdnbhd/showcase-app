import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import {
  getLandingProcessStepSrc,
  type LandingProcessStep,
} from "@/lib/landing-assets";
import {
  PROCESS_INTRO_HEIGHT,
  PROCESS_STEPS_HEIGHT,
  figmaPx,
} from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = figmaPx(490);
const CARD_H = figmaPx(247);
const NOTCH_W = figmaPx(137);
const NOTCH_H = figmaPx(139);
const CARD_R = figmaPx(30);

function cardClipPath(): string {
  const w = CARD_W;
  const h = CARD_H;
  const nx = NOTCH_W;
  const ny = NOTCH_H;
  const r = CARD_R;
  return `path("M ${nx} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${ny + r} A ${r} ${r} 0 0 1 ${r} ${ny} H ${nx - r} A ${r} ${r} 0 0 0 ${nx} ${ny - r} V 0 Z")`;
}

type ProcessStep = {
  n: string;
  image: LandingProcessStep;
  title: string;
  description: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    n: "01",
    image: "step01",
    title: "Discovery & Architecture",
    description:
      "We start by understanding your core objectives. We assess your digital needs and design a tailored technical blueprint that aligns perfectly with your business goals.",
  },
  {
    n: "02",
    image: "step02",
    title: "Agile Engineering",
    description:
      "We build your custom systems, bots, or apps using modern tech stacks. You get regular milestone updates so you are always in control—no surprises.",
  },
  {
    n: "03",
    image: "step03",
    title: "Stress-Testing & Launch",
    description:
      "Before going live, we rigorously test your system for security and performance. We handle cloud deployment to ensure a smooth, crash-free launch even under high traffic.",
  },
  {
    n: "04",
    image: "step04",
    title: "Tracking & Scaling",
    description:
      "Launching is just the beginning. We integrate your data tracking (GTM/Pixel) and hand over a fully-equipped system ready to capture leads and scale.",
  },
];

function ProcessStepRow({
  image,
  title,
  description,
}: ProcessStep) {
  const src = getLandingProcessStepSrc(image);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        p: 0,
        gap: `${figmaPx(120)}px`,
        width: "100%",
        height: figmaPx(257),
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: CARD_W,
          height: CARD_H,
          flexShrink: 0,
        }}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            width={500}
            height={257}
            sizes={`${CARD_W}px`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "#0C1622",
              clipPath: cardClipPath(),
            }}
          />
        )}
        <Typography
          component="h3"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            p: 0,
            m: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        sx={{
          ...barlow,
          width: figmaPx(320),
          height: figmaPx(78),
          flexShrink: 0,
          m: 0,
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: figmaPx(12),
          lineHeight: "180%",
          letterSpacing: "0.02em",
          color: "#FFFFFF",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export default function HowWeWork() {
  return (
    <Box
      component="section"
      id="how-we-work"
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        p: 0,
        width: "100%",
        height: PROCESS_INTRO_HEIGHT + PROCESS_STEPS_HEIGHT,
        bgcolor: "#050B13",
        position: "relative",
        scrollMarginTop: `${figmaPx(90)}px`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 0,
          gap: `${figmaPx(20)}px`,
          width: "100%",
          height: figmaPx(144),
          flexShrink: 0,
        }}
      >
        <Typography
          component="h2"
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
            backgroundImage: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            whiteSpace: "nowrap",
          }}
        >
          Our Proven Delivery Process.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            gap: `${figmaPx(10)}px`,
            width: figmaPx(470),
            height: figmaPx(62),
          }}
        >
          <Typography
            sx={{
              ...barlow,
              width: figmaPx(1152),
              height: figmaPx(62),
              fontStyle: "normal",
              fontSize: figmaPx(16.5),
              lineHeight: "140%",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            Transparency and efficiency at every stage. <br />
            Here is how we turn your business bottlenecks into automated
            solutions.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            width: figmaPx(1152),
            height: PROCESS_STEPS_HEIGHT,
          }}
        >
          {PROCESS_STEPS.map((step) => (
            <ProcessStepRow key={step.n} {...step} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
