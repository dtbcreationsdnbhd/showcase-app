import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { goldTextSx } from "@/lib/gold-theme";
import { getLandingWhyUsSrc } from "@/lib/landing-assets";
import {
  WHY_US_INTRO_SENTENCES,
  WHY_US_ITEMS,
  WHY_US_TITLE,
} from "@/lib/landing-content";
import {
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import MobileProcessSteps from "./MobileProcessSteps";
import MobileTitleReveal from "./MobileTitleReveal";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const body = {
  ...barlow,
  m: 0,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "140%",
  color: "#FFFFFF",
} as const;

export default function MobileHowWeWork() {
  return (
    <Box
      component="section"
      id={mobileAnchorId("why-us")}
      sx={{ width: "100%", bgcolor: MOBILE_SECTION_BG }}
    >
      <MobileTitleReveal>
        <Box
          sx={{
            px: `${MOBILE_GUTTER}px`,
            py: "60px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            component="h2"
            sx={{
              ...barlow,
              m: 0,
              fontWeight: 600,
              fontSize: 36,
              lineHeight: "44px",
              letterSpacing: "-0.02em",
              ...goldTextSx,
            }}
          >
            {WHY_US_TITLE}
          </Typography>

          <Typography sx={{ ...body, mt: "15px" }}>
            {WHY_US_INTRO_SENTENCES[0]} {WHY_US_INTRO_SENTENCES[1]}
          </Typography>
        </Box>
      </MobileTitleReveal>

      <MobileProcessSteps
        steps={WHY_US_ITEMS.map((item) => ({
          n: item.n,
          title: item.title,
          description: item.description,
          src: getLandingWhyUsSrc(item.image),
        }))}
      />
    </Box>
  );
}
