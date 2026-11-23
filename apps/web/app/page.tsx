import Box from "@mui/material/Box";
import ContactForm from "@/components/landing/ContactForm";
import Faq from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HeroCardsSection from "@/components/landing/HeroCardsSection";
import LandingBackgrounds from "@/components/landing/LandingBackgrounds";
import HowWeWork from "@/components/landing/HowWeWork";
import Navbar from "@/components/landing/Navbar";
import TargetedSolutions from "@/components/landing/TargetedSolutions";
import ViewportFrame from "@/components/landing/ViewportFrame";
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
import { getLocale } from "@/lib/get-locale";
import { listProjects, localizeProjects, projectToHeroSlide } from "@/lib/projects";

export default async function Home() {
  const locale = await getLocale();
  const projects = localizeProjects(await listProjects(), locale);
  const logoSrc = getLandingLogoSrc();
  const heroSrc = getLandingHeroSrc();
  const heroSlides = projects.map((project) => projectToHeroSlide(project, locale));

  return (
    <ViewportFrame
      desktop={
        <Box component="main">
          <Box
            className="landing-frame"
            style={{
              height: landingFrameHeightCss(false),
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
              <Hero heroSrc={getLandingHeroDesktopSrc()} />
              <HeroCardsSection slides={heroSlides} />
              <TargetedSolutions />
              <LandingBackgrounds
                heroSrc={getLandingHeroDesktopSrc()}
                solutionsSrc={
                  locale === "zh"
                    ? "/landing/solutions-bg-cn.png"
                    : "/landing/solutions-bg.webp"
                }
              />
              <HowWeWork />
              <Faq />
              <ContactForm waveSrc={null} />
              <Footer />
            </Box>
          </Box>
        </Box>
      }
      mobile={
        <MobileLanding
          heroSrc={heroSrc}
          projects={projects}
          logoSrc={logoSrc}
          heroSlides={heroSlides}
        />
      }
    />
  );
}
