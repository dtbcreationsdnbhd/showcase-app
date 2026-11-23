import Box from "@mui/material/Box";
import { TITLE_HOLD_PAGES, figmaPx } from "@/lib/landing-layout";
import ProjectShowcaseSlider from "@/components/landing/ProjectShowcaseSlider";
import ScrollRevealPin from "@/components/landing/ScrollRevealPin";
import { showcaseTitle } from "@/lib/landing-content";
import { getLocale } from "@/lib/get-locale";
import type { ShowcaseProject } from "@/lib/projects";

export default function ProjectShowcase({
  projects,
}: {
  projects: readonly ShowcaseProject[];
}) {
  if (projects.length === 0) return null;
  const title = showcaseTitle(await getLocale());

  return (
    <Box
      component="section"
      sx={{
        boxSizing: "border-box",
        width: "100%",
        bgcolor: "transparent",
        position: "relative",
      }}
    >
      <ScrollRevealPin holdPages={TITLE_HOLD_PAGES} anchorId="projects">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: `${figmaPx(50)}px`,
            width: "100%",
          }}
        >
          <ProjectShowcaseSlider projects={projects} title={title} />
        </Box>
      </ScrollRevealPin>
    </Box>
  );
}
