import Box from "@mui/material/Box";
import Navbar from "@/components/landing/Navbar";
import ProjectShowcase from "@/components/landing/ProjectShowcase";
import { getLandingLogoSrc } from "@/lib/landing-assets";
import {
  LANDING_DESIGN_WIDTH,
  PROJECTS_PAGE_HEIGHT,
  PROJECTS_PAGE_NAV_HEIGHT,
} from "@/lib/landing-layout";

export default function ProjectsPage() {
  const logoSrc = getLandingLogoSrc();

  return (
    <Box
      component="main"
      className="landing-frame"
      style={{
        minHeight: "100vh",
        height: `max(100vh, calc(100vw * ${PROJECTS_PAGE_HEIGHT} / ${LANDING_DESIGN_WIDTH}))`,
        backgroundColor: "#050B13",
      }}
    >
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
            width: LANDING_DESIGN_WIDTH,
            transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
            transformOrigin: "top left",
            pointerEvents: "auto",
          }}
        >
          <Navbar logoSrc={logoSrc} hrefPrefix="/" />
        </Box>
      </Box>

      <Box
        className="landing-stage"
        style={{
          transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
          transformOrigin: "top left",
        }}
      >
        <Box
          sx={{
            pt: `${PROJECTS_PAGE_NAV_HEIGHT}px`,
            bgcolor: "#050B13",
          }}
        >
          <ProjectShowcase arrowHref="/#projects" followCursor arrowUpRight />
        </Box>
      </Box>
    </Box>
  );
}
