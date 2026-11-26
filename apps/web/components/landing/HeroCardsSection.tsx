import Box from "@mui/material/Box";
import HeroCarousel, { type HeroSlide } from "@/components/landing/HeroCarousel";
import type { ShowcaseProject } from "@/lib/projects";
import {
  HERO_CARDS_VIEWPORT_PAGES,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";

/** Same window the hero used: previous card, active card, next card. */
const CARDS_VIEW_W = 12 + 380 * 3 + 28 * 2;

export default function HeroCardsSection({
  slides,
  projects,
}: {
  slides: HeroSlide[];
  projects: readonly ShowcaseProject[];
}) {
  return (
    <Box
      component="section"
      id="hero-cards"
      sx={{
        position: "relative",
        width: "100%",
        height: `calc(${HERO_CARDS_VIEWPORT_PAGES} * ${STAGE_VIEWPORT_PAGE_HEIGHT_CSS})`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(10px)",
        }}
      >
        <Box sx={{ width: CARDS_VIEW_W, maxWidth: "100%", overflow: "hidden" }}>
          <HeroCarousel slides={slides} projects={projects} />
        </Box>
      </Box>
    </Box>
  );
}
