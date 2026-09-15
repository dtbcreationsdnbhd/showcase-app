import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import Image from "next/image";
import { getLandingProjectShowcaseSrc } from "@/lib/landing-assets";
import { SHOWCASE_HEIGHT, SHOWCASE_PAD_BOTTOM, SHOWCASE_PAD_TOP, figmaPx } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = figmaPx(276);
const CARD_H = figmaPx(414.75);
const CARD_R = figmaPx(18);
const CARD_GAP = figmaPx(24);
const ROW_W = CARD_W * 3 + CARD_GAP * 2;
const TITLE_PAD = figmaPx(18);
const TITLE_INNER_W = CARD_W - TITLE_PAD * 2;

const PROJECTS = [
  {
    title: "Teleflies",
    description: "SaaS Platform • Telegram Bot • Automation",
  },
  {
    title: "TrackSpend",
    description: "Custom Dashboard • AdTech & Marketing • Data...",
  },
  {
    title: "Ad Spend Markup Generator",
    description: "Desktop Utility • White-Label Reporting • Agen...",
  },
] as const;

function ArrowRightIcon({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 20 20"
      aria-hidden
      sx={[
        { width: figmaPx(18), height: figmaPx(18), display: "block" },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <path
        d="M3 10h12.5M11.2 4.8 17 10l-5.8 5.2"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

function ProjectCard({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string | null;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        isolation: "isolate",
        width: CARD_W,
        height: CARD_H,
        flexShrink: 0,
        borderRadius: `${CARD_R}px`,
        overflow: "hidden",
      }}
    >
        {imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes={`${CARD_W}px`}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "#0C1622",
          }}
        />
      )}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 74%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: `${TITLE_PAD}px`,
          gap: `${figmaPx(8)}px`,
          width: CARD_W,
          height: figmaPx(88),
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: 0,
            gap: `${figmaPx(9)}px`,
            width: TITLE_INNER_W,
          }}
        >
          <Typography
            component="h3"
            sx={{
              ...barlow,
              width: TITLE_INNER_W,
              m: 0,
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: figmaPx(19.5),
              lineHeight: `${figmaPx(23)}px`,
              color: "#FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              ...barlow,
              width: TITLE_INNER_W,
              m: 0,
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: figmaPx(12),
              lineHeight: "160%",
              letterSpacing: "0.02em",
              color: "rgba(255, 255, 255, 0.5)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function ProjectShowcase() {
  const imageSrc = getLandingProjectShowcaseSrc();

  return (
    <Box
      component="section"
      id="projects"
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pt: `${SHOWCASE_PAD_TOP}px`,
        pb: `${SHOWCASE_PAD_BOTTOM}px`,
        px: 0,
        gap: `${figmaPx(50)}px`,
        width: "100%",
        height: SHOWCASE_HEIGHT,
        bgcolor: "#050B13",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          p: 0,
          width: ROW_W,
          height: figmaPx(70),
          flexShrink: 0,
        }}
      >
        <Typography
          component="h2"
          sx={{
            ...barlow,
            width: figmaPx(564),
            height: figmaPx(70),
            m: 0,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: figmaPx(36),
            lineHeight: `${figmaPx(58)}px`,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            backgroundImage: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            whiteSpace: "nowrap",
          }}
        >
          Project Showcase
        </Typography>

        <Box
          component="a"
          href="#"
          aria-label="Next projects"
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: figmaPx(52.5),
            height: figmaPx(52.5),
            flexShrink: 0,
            textDecoration: "none",
            cursor: "pointer",
            "&:focus-visible": {
              outline: "2px solid #CC35CC",
              outlineOffset: 4,
              borderRadius: "50%",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: figmaPx(33.75),
              height: figmaPx(33.75),
              background: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
              borderRadius: "50%",
            }}
          >
            <ArrowRightIcon />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          p: 0,
          gap: `${CARD_GAP}px`,
          width: ROW_W,
          height: CARD_H,
          flexShrink: 0,
        }}
      >
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            imageSrc={imageSrc}
          />
        ))}
      </Box>
    </Box>
  );
}
