import Box from "@mui/material/Box";
import WhyUsPoster from "@/components/landing/WhyUsPoster";
import {
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
  WHY_US_VIEWPORT_PAGES,
} from "@/lib/landing-layout";

export default function HowWeWork() {
  return (
    <Box
      component="section"
      id="why-us"
      sx={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        height: `calc(${WHY_US_VIEWPORT_PAGES} * ${STAGE_VIEWPORT_PAGE_HEIGHT_CSS})`,
        lineHeight: 0,
      }}
    >
      <WhyUsPoster sectionId="why-us" />
    </Box>
  );
}
