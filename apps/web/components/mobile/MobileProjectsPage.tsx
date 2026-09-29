import Box from "@mui/material/Box";
import MobileNavbar from "@/components/mobile/MobileNavbar";
import MobileProjectShowcase from "@/components/mobile/MobileProjectShowcase";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_STAGE_ZOOM,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import type { ShowcaseProject } from "@/lib/projects";

export default function MobileProjectsPage({
  projects,
}: {
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
          <MobileNavbar hrefPrefix="/" />
        </Box>
      </Box>

      <Box sx={{ width: MOBILE_DESIGN_WIDTH, zoom: MOBILE_STAGE_ZOOM }}>
        <MobileProjectShowcase
          projects={projects}
          arrowHref={`/#${mobileAnchorId("projects")}`}
          arrowLabel="Back to home"
          arrowUpRight
        />
      </Box>
    </Box>
  );
}
