import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import HeroCarousel, { type HeroSlide } from "@/components/landing/HeroCarousel";
import PillButton from "@/components/landing/PillButton";
import { HERO_BOTTOM_FADE } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const jakarta = {
  fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
} as const;

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
        bgcolor: "#050B13",
      }}
    >
      {heroSrc ? (
        <Image
          src={heroSrc}
          alt=""
          width={1440}
          height={900}
          priority
          draggable={false}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "1440 / 900",
            objectFit: "cover",
            display: "block",
            userSelect: "none",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1440 / 900",
            bgcolor: "#07071A",
          }}
        />
      )}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(59.86deg, #000000 0%, rgba(0, 0, 0, 0) 55.05%)",
          pointerEvents: "none",
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: HERO_BOTTOM_FADE,
          background: "linear-gradient(180deg, rgba(5, 11, 19, 0) 0%, #050B13 100%)",
          pointerEvents: "none",
        }}
      />

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
                      backgroundImage:
                        "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
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
                color: "#A3AAB8",
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
