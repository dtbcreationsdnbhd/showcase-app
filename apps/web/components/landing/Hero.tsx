import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import PillButton from "@/components/landing/PillButton";
import { HERO_BOTTOM_FADE } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

export default function Hero({ heroSrc }: { heroSrc: string | null }) {
  return (
    <Box
      component="section"
      id="top"
      sx={{
        position: "relative",
        width: "100%",
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
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
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
          top: 290,
          left: 0,
          right: 150,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
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
            gap: "24px",
            width: 1152,
            height: 470,
          }}
        >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: 0,
            gap: "48px",
            width: 527,
            height: 470,
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
              width: 527,
              height: 370,
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
                width: 527,
                height: 288,
                m: 0,
                overflow: "visible",
              }}
            >
              <Typography
                component="span"
                sx={{
                  ...barlow,
                  display: "block",
                  width: 527,
                  height: 72,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 60,
                  lineHeight: "72px",
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                Automate. Scale.
              </Typography>
              <Typography
                component="span"
                sx={{
                  ...barlow,
                  display: "block",
                  width: 451,
                  height: 120,
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: 120,
                  lineHeight: "120px",
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
                  display: "block",
                  width: 780,
                  height: 84,
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: 84,
                  lineHeight: "84px",
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
                width: 527,
                height: 52,
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: "160%",
                letterSpacing: "0.02em",
                color: "#667080",
              }}
            >
              Equip your business with cutting-edge AI-tools, customized apps,
              and intelligent data dashboards for full digital transformation.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              p: 0,
              gap: "24px",
              width: 461,
              height: 52,
            }}
          >
            <PillButton width={244} href="#contact">
              Get a Free Consultation
            </PillButton>
            <Box
              component="a"
              href="#projects"
              className="hover-grow"
              sx={{
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                py: "6px",
                px: "20px",
                gap: "10px",
                width: 193,
                height: 52,
                border: "1px solid #FFFFFF",
                borderRadius: "9999px",
                textDecoration: "none",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Typography
                component="span"
                sx={{
                  ...barlow,
                  width: 153,
                  height: 22,
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: 18,
                  lineHeight: "22px",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                }}
              >
                Explore Our Solutions
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: 601, height: 470, flexGrow: 1, alignSelf: "stretch" }} />
        </Box>
      </Box>
    </Box>
  );
}
