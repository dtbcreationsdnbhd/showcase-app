import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CONTACT_CTA_HEIGHT_CSS, figmaPx } from "@/lib/landing-layout";

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
        width: figmaPx(164.25),
        height: figmaPx(39),
        pl: `${figmaPx(20)}px`,
        pr: `${figmaPx(6)}px`,
        background: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
        boxShadow: "0px 4px 20px rgba(236, 115, 255, 0.5)",
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
          gap: `${figmaPx(8)}px`,
          height: figmaPx(39),
          flexShrink: 0,
        }}
      >
        <Box
          component="span"
          sx={{
            ...barlow,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: figmaPx(13.5),
            lineHeight: `${figmaPx(22)}px`,
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            flexShrink: 0,
            display: "inline-block",
            backfaceVisibility: "hidden",
          }}
        >
          Get in touch with us
        </Box>
        <Box
          aria-hidden
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: figmaPx(30),
            height: figmaPx(30),
            boxSizing: "border-box",
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "99px",
            flexShrink: 0,
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 16 16"
            sx={{
              width: figmaPx(16),
              height: figmaPx(16),
              display: "block",
            }}
          >
            <g transform="rotate(-45 8 8)">
              <path
                d="M2 8h10.5M9.2 3.8 13.8 8 9.2 12.2"
                fill="none"
                stroke="#FFFFFF"
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
      id="contact"
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 0,
        width: "100%",
        height: CONTACT_CTA_HEIGHT_CSS,
        bgcolor: "#050B13",
        position: "relative",
        // Full-viewport band: no scroll-margin, or hash jump leaves ~navbar gap
        // above and the centered block reads low in the screen.
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 0,
          gap: `${figmaPx(10)}px`,
          width: "100%",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            gap: `${figmaPx(10)}px`,
            width: "100%",
            height: figmaPx(144),
            flexShrink: 0,
          }}
        >
          <Typography
            component="h2"
            sx={{
              ...barlow,
              width: "100%",
              height: figmaPx(58),
              m: 0,
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: figmaPx(28.5),
              lineHeight: `${figmaPx(58)}px`,
              textAlign: "center",
              letterSpacing: "-0.02em",
              backgroundImage: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            Ready to Scale? Connect with Our Team
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
              height: figmaPx(62),
            }}
          >
            <Typography
              sx={{
                ...barlow,
                width: figmaPx(1152),
                height: figmaPx(62),
                m: 0,
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: figmaPx(16.5),
                lineHeight: "140%",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              Whether you need to automate workflows, build custom systems, or
              launch high-converting digital assets,
              <br />
              we are here to turn your bottlenecks into measurable revenue.
            </Typography>
          </Box>
        </Box>

        <ContactPillButton />
      </Box>
    </Box>
  );
}
