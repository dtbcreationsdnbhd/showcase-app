import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import type { HeroSlide } from "@/components/landing/HeroCarousel";
import PillButton from "@/components/landing/PillButton";
import MobileHeroCards from "@/components/mobile/MobileHeroCards";
import { goldTextSx } from "@/lib/gold-theme";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_HERO_HEIGHT,
  MOBILE_NAV_HEIGHT,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const jakarta = {
  fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
} as const;

/** Same curve as desktop; applied to the whole bg stack (image + wash). */
const HERO_FADE_MASK =
  "linear-gradient(180deg, #000 0%, #000 50%, rgba(0, 0, 0, 0.55) 76%, transparent 100%)";
/** Extra bleed so the fade finishes past the section edge (no hard cut under CTA). */
const HERO_BG_BLEED = 64;

export default function MobileHero({
  heroSrc,
  slides = [],
}: {
  heroSrc: string | null;
  slides?: readonly HeroSlide[];
}) {
  return (
    <Box
      component="section"
      id={mobileAnchorId("top")}
      sx={{
        position: "relative",
        width: "100%",
        height: MOBILE_HERO_HEIGHT,
        // Don't clip card glows; the bg layer below owns its own overflow.
        overflow: "visible",
        boxSizing: "border-box",
        // Leave the fixed navbar band clear, then centre the rest.
        pt: `${MOBILE_NAV_HEIGHT}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Own compositor layer + bottom bleed: `zoom` + child transforms otherwise
          paint a hard full-width seam where the photo meets the site backdrop. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: -HERO_BG_BLEED,
          zIndex: 0,
          pointerEvents: "none",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          maskImage: HERO_FADE_MASK,
          WebkitMaskImage: HERO_FADE_MASK,
        }}
      >
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            width={MOBILE_DESIGN_WIDTH}
            height={MOBILE_HERO_HEIGHT + HERO_BG_BLEED}
            sizes="100vw"
            priority
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
            }}
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
          position: "relative",
          zIndex: 10,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          py: "12px",
        }}
      >
        <MobileHeroCards slides={slides} />

        <Box
          component="h1"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            m: 0,
            mt: "8px",
            px: "16px",
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
                fontSize: 34,
                lineHeight: "42px",
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
            fontSize: 14,
            lineHeight: "155%",
            letterSpacing: "0.02em",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.85)",
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
