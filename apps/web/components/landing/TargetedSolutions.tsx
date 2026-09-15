import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import {
  getLandingServiceIconSrc,
  type LandingServiceIcon,
} from "@/lib/landing-assets";
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

type ServiceCopy = {
  title: string;
  description: string;
};

const SERVICE_ROWS: {
  icon: LandingServiceIcon;
  services: [ServiceCopy, ServiceCopy];
}[] = [
  {
    icon: "ai",
    services: [
      {
        title: "Telegram Bot Integration",
        description:
          "Automate replies and capture leads instantly. Never miss a business opportunity.",
      },
      {
        title: "AI Chatbot & Automation",
        description:
          "Deploy 24/7 AI chatbots to answer queries and guide traffic straight to sales.",
      },
    ],
  },
  {
    icon: "web",
    services: [
      {
        title: "Custom Landing Pages & Web",
        description:
          "Fast-loading landing pages designed with one goal: turning visitors into paying clients.",
      },
      {
        title: "Cloud Hosting & Domain Setup",
        description:
          "Reliable hosting to ensure your business stays fast, secure, and online during traffic spikes.",
      },
    ],
  },
  {
    icon: "star",
    services: [
      {
        title: "Custom Dashboard & System",
        description:
          "Secure, intuitive dashboards. Gain full control and visibility over your core operations.",
      },
      {
        title: "Custom Mobile Apps",
        description:
          "Seamless custom mobile apps. We handle everything from UI design to Play Store launch.",
      },
    ],
  },
  {
    icon: "refresh",
    services: [
      {
        title: "Data Tracking & Pixel Integration",
        description:
          "Stop guessing. We track every conversion perfectly so you can optimize your ad spend.",
      },
      {
        title: "Task Automation Scripting",
        description:
          "Replace manual and repetitive tasks with smart scripts. Streamline your operations, reduce human error, and save valuable time.",
      },
    ],
  },
];

function ServiceCopyBlock({ title, description }: ServiceCopy) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        p: 0,
        gap: `${figmaPx(6)}px`,
        width: "100%",
      }}
    >
      <Typography
        component="h3"
        sx={{
          ...barlow,
          m: 0,
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: figmaPx(25.5),
          lineHeight: `${figmaPx(41)}px`,
          letterSpacing: "-0.02em",
          color: "#C3A4FF",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          ...barlow,
          m: 0,
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: figmaPx(12),
          lineHeight: "160%",
          letterSpacing: "0.02em",
          color: "#FFFFFF",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

function ServiceRow({
  iconSrc,
  services,
}: {
  iconSrc: string | null;
  services: [ServiceCopy, ServiceCopy];
}) {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        py: 0,
        px: `${figmaPx(37)}px`,
        gap: `${figmaPx(130)}px`,
        width: "100%",
        height: figmaPx(370),
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: figmaPx(317.25),
          height: figmaPx(277.5),
          flexShrink: 0,
          bgcolor: "#050B13",
          overflow: "hidden",
        }}
      >
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt=""
            width={423}
            height={370}
            sizes={`${figmaPx(423)}px`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : null}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 0,
          gap: `${figmaPx(60)}px`,
          width: figmaPx(503),
          flexShrink: 0,
        }}
      >
        <ServiceCopyBlock {...services[0]} />
        <ServiceCopyBlock {...services[1]} />
      </Box>
    </Box>
  );
}

export default function TargetedSolutions() {
  const watermarkW = figmaPx(869);

  return (
    <Box
      component="section"
      id="services"
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
            height: figmaPx(176),
            my: `${figmaPx(-30)}px`,
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
            gap: `${figmaPx(24)}px`,
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
            alignItems: "flex-start",
            p: 0,
            gap: `${figmaPx(100)}px`,
            width: figmaPx(1152),
          }}
        >
          {SERVICE_ROWS.map((row) => (
            <ServiceRow
              key={row.icon}
              iconSrc={getLandingServiceIconSrc(row.icon)}
              services={row.services}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
