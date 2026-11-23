import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import PillButton from "@/components/landing/PillButton";
import { getLocale } from "@/lib/get-locale";
import { goldTextSx } from "@/lib/gold-theme";
import { CJK_FONT, heroCopy } from "@/lib/locale";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const jakarta = {
  fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
} as const;

const HERO_FADE_MASK =
  "linear-gradient(180deg, #000 0%, #000 50%, rgba(0, 0, 0, 0.55) 76%, transparent 100%)";

export default async function Hero({
  heroSrc,
}: {
  heroSrc: string | null;
}) {
  const locale = await getLocale();
  const copy = heroCopy(locale);
  const titleFont = locale === "zh" ? { fontFamily: CJK_FONT } : jakarta;
  const bodyFont = locale === "zh" ? { fontFamily: CJK_FONT } : barlow;
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
        data-hero-bg
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
            quality={90}
            style={{ objectFit: "cover", userSelect: "none" }}
          />
        ) : null}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(30, 4, 16, 0.55)",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
          "& a": { pointerEvents: "auto" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            p: 0,
            gap: "48px",
            width: 980,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 0,
              gap: "36px",
              width: "100%",
              height: "auto",
            }}
          >
            <Box
              component="h1"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 0,
                gap: "6px",
                m: 0,
                overflow: "visible",
              }}
            >
              {copy.lines.map(({ before, accent, after }) => (
                <Typography
                  key={accent}
                  component="span"
                  sx={{
                    ...titleFont,
                    display: "block",
                    fontWeight: 800,
                    fontSize: 88,
                    lineHeight: "102px",
                    letterSpacing: locale === "zh" ? "0.02em" : "-0.02em",
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                  }}
                >
                  {before}
                  <Box
                    component="span"
                    className="solutions-title-3d"
                    sx={{
                      backgroundImage: goldTextSx.backgroundImage,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
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
                ...bodyFont,
                maxWidth: 920,
                height: "auto",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: locale === "zh" ? 17 : 21,
                lineHeight: "160%",
                letterSpacing: "0.02em",
                color: "#E6D3D9",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.8)",
              }}
            >
              {copy.body}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 0,
              height: 64,
            }}
          >
            <PillButton
              width={320}
              height={64}
              fontSize={22}
              href="#contact"
              fontFamily={locale === "zh" ? CJK_FONT : undefined}
            >
              {copy.cta}
            </PillButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
