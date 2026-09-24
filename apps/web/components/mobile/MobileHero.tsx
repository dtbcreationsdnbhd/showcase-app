import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import PillButton from "@/components/landing/PillButton";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_HERO_BOTTOM_FADE,
  MOBILE_HERO_HEIGHT,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
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
        bgcolor: "#050B13",
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
          }}
        />
      ) : (
        <Box sx={{ width: "100%", height: "100%", bgcolor: "#07071A" }} />
      )}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5, 11, 19, 0) 38%, rgba(5, 11, 19, 0.72) 62%, rgba(5, 11, 19, 0.92) 100%)",
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
          height: MOBILE_HERO_BOTTOM_FADE,
          background:
            "linear-gradient(180deg, rgba(5, 11, 19, 0) 0%, #050B13 100%)",
          pointerEvents: "none",
        }}
      />

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
          <Typography
            component="span"
            sx={{
              ...barlow,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 38,
              lineHeight: "46px",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            Automate. Scale.
          </Typography>
          <Typography
            component="span"
            sx={{
              ...barlow,
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: 96,
              lineHeight: "96px",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              backgroundImage:
                "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            Outpace
          </Typography>
          <Typography
            component="span"
            sx={{
              ...barlow,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 38,
              lineHeight: "44px",
              textTransform: "uppercase",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            Your Competition.
          </Typography>
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
            color: "#667080",
          }}
        >
          Equip your business with cutting-edge AI-tools, customized apps, and
          intelligent data dashboards for full digital transformation.
        </Typography>

        <PillButton width={253} href={`#${mobileAnchorId("contact")}`}>
          Get a Free Consultation
        </PillButton>
      </Box>
    </Box>
  );
}
