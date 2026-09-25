import Box from "@mui/material/Box";
import MobileNavbar from "@/components/mobile/MobileNavbar";
import MobileProjectShowcase from "@/components/mobile/MobileProjectShowcase";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_STAGE_ZOOM,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";

export default function MobileProjectsPage({
  imageSrc,
  detailImageSrc,
}: {
  imageSrc: string | null;
  detailImageSrc: string | null;
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
          imageSrc={imageSrc}
          detailImageSrc={detailImageSrc}
          arrowHref={`/#${mobileAnchorId("projects")}`}
          arrowLabel="Back to home"
          arrowUpRight
        />
      </Box>
    </Box>
  );
}
