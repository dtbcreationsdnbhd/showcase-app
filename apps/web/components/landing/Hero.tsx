import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import HeroCarousel, { type HeroSlide } from "@/components/landing/HeroCarousel";
import PillButton from "@/components/landing/PillButton";
import { goldTextSx } from "@/lib/gold-theme";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const jakarta = {
  fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
} as const;

const HERO_FADE_MASK =
  "linear-gradient(180deg, #000 0%, #000 50%, rgba(0, 0, 0, 0.55) 76%, transparent 100%)";

export default function Hero({
  heroSrc,
  slides,
}: {
  heroSrc: string | null;
  slides: HeroSlide[];
}) {
  return (
    <Box
      component="section"
      id="top"
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1440 / 900",
          maskImage: HERO_FADE_MASK,
          WebkitMaskImage: HERO_FADE_MASK,
        }}
      >
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            draggable={false}
            sizes="100vw"
            style={{ objectFit: "cover", userSelect: "none" }}
          />
        ) : null}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(59.86deg, rgba(48, 4, 22, 0.6) 0%, rgba(48, 4, 22, 0) 55.05%)",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 190,
          left: 120,
          right: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          zIndex: 10,
          pointerEvents: "none",
          "& a": { pointerEvents: "auto" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: 0,
            gap: "48px",
            width: "100%",
            height: 760,
          }}
        >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: 0,
            gap: "56px",
            width: 640,
            flexShrink: 0,
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              gap: "36px",
              width: 640,
              height: "auto",
            }}
          >
            <Box
              component="h1"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: "6px",
                width: 700,
                height: "auto",
                m: 0,
                overflow: "visible",
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
                    display: "block",
                    fontWeight: 800,
                    fontSize: 66,
                    lineHeight: "78px",
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
                width: 700,
                height: "auto",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: 24,
                lineHeight: "160%",
                letterSpacing: "0.02em",
                color: "#C4AAB2",
              }}
            >
              Empower your business with next-gen AI-powered tools, video
              creation, and design assets. From creative content to automated
              workflows, we craft your vision for commercial success.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              p: 0,
              gap: "24px",
              height: 52,
            }}
          >
            <PillButton width={244} href="#contact">
              Get a Free Consultation
            </PillButton>
          </Box>
        </Box>

        <HeroCarousel slides={slides} />
        </Box>
      </Box>
    </Box>
  );
}
