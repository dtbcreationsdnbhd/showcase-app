import Box from "@mui/material/Box";
import MobileContactCta from "@/components/mobile/MobileContactCta";
import MobileContactForm from "@/components/mobile/MobileContactForm";
import MobileFooter from "@/components/mobile/MobileFooter";
import MobileHero from "@/components/mobile/MobileHero";
import MobileHowWeWork from "@/components/mobile/MobileHowWeWork";
import MobileNavbar from "@/components/mobile/MobileNavbar";
import MobileProjectShowcase from "@/components/mobile/MobileProjectShowcase";
import MobileServicePages from "@/components/mobile/MobileServicePages";
import { SERVICE_ROWS } from "@/lib/landing-content";
import { getLandingServiceIconLottieSrc } from "@/lib/landing-assets";
import type { ShowcaseProject } from "@/lib/projects";
import MobileTargetedSolutions from "@/components/mobile/MobileTargetedSolutions";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_STAGE_ZOOM,
} from "@/lib/landing-layout-mobile";

export default function MobileLanding({
  heroSrc,
  projects,
}: {
  heroSrc: string | null;
  projects: readonly ShowcaseProject[];
}) {
  return (
    <Box sx={{ position: "relative", width: "100%", overflowX: "clip" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          // Above the menu panel (200) so the close button stays tappable.
          zIndex: 210,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            width: MOBILE_DESIGN_WIDTH,
            zoom: MOBILE_STAGE_ZOOM,
            pointerEvents: "auto",
          }}
        >
          <MobileNavbar />
        </Box>
      </Box>

      <Box sx={{ width: MOBILE_DESIGN_WIDTH, zoom: MOBILE_STAGE_ZOOM }}>
        <MobileHero heroSrc={heroSrc} />
        <MobileTargetedSolutions />
        <MobileServicePages
          rows={SERVICE_ROWS.map((row) => ({
            ...row,
            iconSrc: getLandingServiceIconLottieSrc(row.icon),
          }))}
        />
        <MobileHowWeWork />
        <MobileProjectShowcase projects={projects} />
        <MobileContactCta />
        <MobileContactForm />
        <MobileFooter />
      </Box>
    </Box>
  );
}
