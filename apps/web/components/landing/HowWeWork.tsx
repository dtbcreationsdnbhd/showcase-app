import Box from "@mui/material/Box";
import WhyUsPoster from "@/components/landing/WhyUsPoster";
import { WHY_US_DESKTOP_HEIGHT } from "@/lib/landing-layout";

export default function HowWeWork() {
  return (
    <Box
      component="section"
      id="why-us"
      sx={{
        position: "relative",
        width: "100%",
        height: WHY_US_DESKTOP_HEIGHT,
        lineHeight: 0,
      }}
    >
      <WhyUsPoster sectionId="why-us" />
    </Box>
  );
}