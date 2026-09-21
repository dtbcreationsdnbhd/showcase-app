import Box from "@mui/material/Box";
import ContactCta from "@/components/landing/ContactCta";
import ContactForm from "@/components/landing/ContactForm";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowWeWork from "@/components/landing/HowWeWork";
import Navbar from "@/components/landing/Navbar";
import ProjectShowcase from "@/components/landing/ProjectShowcase";
import TargetedSolutions from "@/components/landing/TargetedSolutions";
import {
  getLandingContactWaveSrc,
  getLandingHeroSrc,
  getLandingLogoSrc,
} from "@/lib/landing-assets";
import {
  LANDING_DESIGN_HEIGHT,
  LANDING_DESIGN_WIDTH,
} from "@/lib/landing-layout";

export default function Home() {
  const logoSrc = getLandingLogoSrc();
  const heroSrc = getLandingHeroSrc();
  const contactWaveSrc = getLandingContactWaveSrc();

  return (
    <Box
      component="main"
      className="landing-frame"
      style={{
        height: `calc(100vw * ${LANDING_DESIGN_HEIGHT} / ${LANDING_DESIGN_WIDTH})`,
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
        <Hero heroSrc={heroSrc} />
        <TargetedSolutions />
        <HowWeWork />
        <ProjectShowcase arrowHref="/projects" />
        <ContactCta />
        <ContactForm waveSrc={contactWaveSrc} />
        <Footer />
      </Box>
    </Box>
  );
}
