import Box from "@mui/material/Box";
import {
  SHOWCASE_HEIGHT_CSS,
  SHOWCASE_PAD_BOTTOM,
  SHOWCASE_PAD_TOP,
  figmaPx,
} from "@/lib/landing-layout";
import ProjectShowcaseSlider from "@/components/landing/ProjectShowcaseSlider";
import { SHOWCASE_TITLE } from "@/lib/landing-content";
import type { ShowcaseProject } from "@/lib/projects";

export default function ProjectShowcase({
  projects,
}: {
  projects: readonly ShowcaseProject[];
}) {
  if (projects.length === 0) return null;

  return (
    <Box
      component="section"
      id="projects"
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pt: `${SHOWCASE_PAD_TOP}px`,
        pb: `${SHOWCASE_PAD_BOTTOM}px`,
        px: 0,
        gap: `${figmaPx(50)}px`,
        width: "100%",
        height: SHOWCASE_HEIGHT_CSS,
        bgcolor: "#050B13",
        position: "relative",
        scrollMarginTop: `${figmaPx(20)}px`,
      }}
    >
      <ProjectShowcaseSlider projects={projects} title={SHOWCASE_TITLE} />
    </Box>
  );
}
