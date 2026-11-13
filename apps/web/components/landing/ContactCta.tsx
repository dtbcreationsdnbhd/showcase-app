import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  CTA_BODY_LINES,
  CTA_BUTTON_LABEL,
  CTA_TITLE,
} from "@/lib/landing-content";
import { TITLE_HOLD_PAGES, figmaPx } from "@/lib/landing-layout";
import ScrollRevealPin from "@/components/landing/ScrollRevealPin";
import { GOLD_INK, goldButtonSx, goldTextSx } from "@/lib/gold-theme";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

function ContactPillButton() {
  return (
    <Box
      component="a"
      href="#contact-form"
      className="hover-grow"
      sx={{
        boxSizing: "border-box",
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: figmaPx(52),
        pl: `${figmaPx(26)}px`,
        pr: `${figmaPx(6)}px`,
        ...goldButtonSx,
        borderRadius: "9999px",
        textDecoration: "none",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: `${figmaPx(14)}px`,
          height: figmaPx(52),
          flexShrink: 0,
        }}
      >
        <Box
          component="span"
          sx={{
            ...barlow,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: figmaPx(17),
            lineHeight: `${figmaPx(22)}px`,
            color: GOLD_INK,
            whiteSpace: "nowrap",
            flexShrink: 0,
            display: "inline-block",
            backfaceVisibility: "hidden",
          }}
        >
          {CTA_BUTTON_LABEL}
        </Box>
        <Box
          aria-hidden
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: figmaPx(40),
            height: figmaPx(40),
            boxSizing: "border-box",
            background: GOLD_INK,
            borderRadius: "99px",
            flexShrink: 0,
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 16 16"
            sx={{
              width: figmaPx(18),
              height: figmaPx(18),
              display: "block",
            }}
          >
            <g transform="rotate(-45 8 8)">
              <path
                d="M2 8h10.5M9.2 3.8 13.8 8 9.2 12.2"
                fill="none"
                stroke="#FFD866"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function ContactCta() {
  return (
    <Box
      component="section"
      sx={{
        boxSizing: "border-box",
        width: "100%",
        bgcolor: "transparent",
        position: "relative",
      }}
    >
      <ScrollRevealPin holdPages={TITLE_HOLD_PAGES} anchorId="contact">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            gap: `${figmaPx(30)}px`,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
              gap: `${figmaPx(18)}px`,
              width: "100%",
              flexShrink: 0,
            }}
          >
            <Typography
              component="h2"
              sx={{
                ...barlow,
                width: "100%",
                m: 0,
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: figmaPx(48),
                lineHeight: `${figmaPx(64)}px`,
                textAlign: "center",
                letterSpacing: "-0.02em",
                ...goldTextSx,
                whiteSpace: "nowrap",
              }}
            >
              {CTA_TITLE}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                p: 0,
                gap: `${figmaPx(10)}px`,
                width: figmaPx(1152),
              }}
            >
              <Typography
                sx={{
                  ...barlow,
                  width: figmaPx(1152),
                  m: 0,
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: figmaPx(20),
                  lineHeight: "140%",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                {CTA_BODY_LINES[0]}
                <br />
                {CTA_BODY_LINES[1]}
              </Typography>
            </Box>
          </Box>

          <ContactPillButton />
        </Box>
      </ScrollRevealPin>
    </Box>
  );
}
