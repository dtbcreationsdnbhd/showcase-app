import Box from "@mui/material/Box";
import SolutionsPoster from "@/components/landing/SolutionsPoster";
import {
  SOLUTIONS_VIEWPORT_PAGES,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";

export default function TargetedSolutions() {
  return (
    <Box
      component="section"
      id="solutions"
      sx={{
        position: "relative",
        width: "100%",
        height: `calc(${SOLUTIONS_VIEWPORT_PAGES} * ${STAGE_VIEWPORT_PAGE_HEIGHT_CSS})`,
        lineHeight: 0,
      }}
    >
      <SolutionsPoster />
    </Box>
  );
}
