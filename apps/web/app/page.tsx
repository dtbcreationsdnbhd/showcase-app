import Box from "@mui/material/Box";
import Hero from "@/components/landing/Hero";
import HowWeWork from "@/components/landing/HowWeWork";
import Navbar from "@/components/landing/Navbar";
import ProjectShowcase from "@/components/landing/ProjectShowcase";
import TargetedSolutions from "@/components/landing/TargetedSolutions";
import { getLandingHeroSrc, getLandingLogoSrc } from "@/lib/landing-assets";
import {
  LANDING_DESIGN_HEIGHT,
  LANDING_DESIGN_WIDTH,
} from "@/lib/landing-layout";

export default function Home() {
  const logoSrc = getLandingLogoSrc();
  const heroSrc = getLandingHeroSrc();

  return (
    <Box
      component="main"
      className="landing-frame"
      style={{
        height: `calc(100vw * ${LANDING_DESIGN_HEIGHT} / ${LANDING_DESIGN_WIDTH})`,
      }}
    >
      <Box
        className="landing-stage"
        style={{
          transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
          transformOrigin: "top left",
        }}
      >
        <Hero heroSrc={heroSrc} />
        <Navbar logoSrc={logoSrc} />
        <TargetedSolutions />
        <HowWeWork />
        <ProjectShowcase />
      </Box>
    </Box>
  );
}
