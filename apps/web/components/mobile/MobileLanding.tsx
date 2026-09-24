import Box from "@mui/material/Box";
import MobileHero from "@/components/mobile/MobileHero";
import MobileNavbar from "@/components/mobile/MobileNavbar";
import {
  MOBILE_DESIGN_WIDTH,
  MOBILE_STAGE_ZOOM,
} from "@/lib/landing-layout-mobile";

export default function MobileLanding({
  heroSrc,
}: {
  heroSrc: string | null;
}) {
  return (
    <Box sx={{ position: "relative", width: "100%", overflowX: "clip" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 80,
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
      </Box>
    </Box>
  );
}
