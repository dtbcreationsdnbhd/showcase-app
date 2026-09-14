import Box from "@mui/material/Box";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import { getLandingHeroSrc, getLandingLogoSrc } from "@/lib/landing-assets";

const DESIGN_WIDTH = 1920;

export default function Home() {
  const logoSrc = getLandingLogoSrc();
  const heroSrc = getLandingHeroSrc();

  return (
    <Box component="main" className="landing-frame">
      <Box
        className="landing-stage"
        style={{
          transform: `scale(calc(100vw / ${DESIGN_WIDTH}px))`,
          transformOrigin: "top left",
        }}
      >
        <Hero heroSrc={heroSrc} />
        <Navbar logoSrc={logoSrc} />
      </Box>
    </Box>
  );
}
