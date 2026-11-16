import Box from "@mui/material/Box";
import ContactForm from "@/components/landing/ContactForm";
import Faq from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowWeWork from "@/components/landing/HowWeWork";
import Navbar from "@/components/landing/Navbar";
import TargetedSolutions from "@/components/landing/TargetedSolutions";
import MobileLanding from "@/components/mobile/MobileLanding";
import {
  getLandingHeroDesktopSrc,
  getLandingHeroSrc,
  getLandingLogoSrc,
} from "@/lib/landing-assets";
import {
  LANDING_DESIGN_WIDTH,
  landingFrameHeightCss,
} from "@/lib/landing-layout";
import { DESKTOP_ONLY, MOBILE_ONLY } from "@/lib/landing-layout-mobile";
import { listProjects, projectToHeroSlide } from "@/lib/projects";

export default async function Home() {
  const projects = await listProjects();
  const logoSrc = getLandingLogoSrc();
  const heroSrc = getLandingHeroSrc();
  const heroSlides = projects.map(projectToHeroSlide);

  return (
    <Box component="main">
      <Box
        className="landing-frame"
        style={{
          height: landingFrameHeightCss(false),
        }}
        sx={{
          [MOBILE_ONLY]: { display: "none" },
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
            <Navbar logoSrc={logoSrc} />
          </Box>
        </Box>

        <Box
          className="landing-stage"
          style={{
            transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
            transformOrigin: "top left",
          }}
        >
          <Hero heroSrc={getLandingHeroDesktopSrc()} slides={heroSlides} />
          <TargetedSolutions />
          <HowWeWork />
          <Faq />
          <ContactForm waveSrc={null} />
          <Footer />
        </Box>
      </Box>

      <Box sx={{ [DESKTOP_ONLY]: { display: "none" } }}>
        <MobileLanding
          heroSrc={heroSrc}
          projects={projects}
          logoSrc={logoSrc}
          heroSlides={heroSlides}
        />
      </Box>
    </Box>
  );
}
