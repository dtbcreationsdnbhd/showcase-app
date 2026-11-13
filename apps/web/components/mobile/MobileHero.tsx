import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import PillButton from "@/components/landing/PillButton";
import { goldTextSx } from "@/lib/gold-theme";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_HERO_HEIGHT,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const jakarta = {
  fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
} as const;

/** Type sizes are estimated off the Figma export; tune against a real device. */
const TEXT_BLOCK_TOP = 482;

export default function MobileHero({ heroSrc }: { heroSrc: string | null }) {
  return (
    <Box
      component="section"
      id={mobileAnchorId("top")}
      sx={{
        position: "relative",
        width: "100%",
        height: MOBILE_HERO_HEIGHT,
        overflow: "hidden",
      }}
    >
      {heroSrc ? (
        <Image
          src={heroSrc}
          alt=""
          width={MOBILE_DESIGN_WIDTH}
          height={MOBILE_HERO_HEIGHT}
          sizes="100vw"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            maskImage:
              "linear-gradient(180deg, #000 38%, rgba(0, 0, 0, 0.28) 62%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 38%, rgba(0, 0, 0, 0.28) 62%, transparent 100%)",
          }}
        />
      ) : null}

      <Box
        sx={{
          position: "absolute",
          top: TEXT_BLOCK_TOP,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "38px",
          zIndex: 10,
        }}
      >
        <Box
          component="h1"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            m: 0,
          }}
        >
          {[
            ["Crafting ", "Vision", ","],
            ["Empowering ", "Creation", ""],
          ].map(([before, accent, after]) => (
            <Typography
              key={accent}
              component="span"
              sx={{
                ...jakarta,
                fontWeight: 800,
                fontSize: 38,
                lineHeight: "48px",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {before}
              <Box
                component="span"
                sx={{
                  ...goldTextSx,
                }}
              >
                {accent}
              </Box>
              {after}
            </Typography>
          ))}
        </Box>

        <Typography
          sx={{
            ...barlow,
            width: 345,
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: 15,
            lineHeight: "160%",
            letterSpacing: "0.02em",
            textAlign: "center",
            color: "#C4AAB2",
          }}
        >
          Empower your business with next-gen AI-powered tools, video creation,
          and design assets. From creative content to automated workflows, we
          craft your vision for commercial success.
        </Typography>

        <PillButton width={253} href={`#${mobileAnchorId("contact")}`}>
          Get a Free Consultation
        </PillButton>
      </Box>
    </Box>
  );
}
