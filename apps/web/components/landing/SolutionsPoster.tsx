import Box from "@mui/material/Box";
import { SOLUTIONS_DESKTOP_HEIGHT } from "@/lib/landing-layout";

const SRC = "/landing/solutions-bg.webp";

/** Sits at the top of the solutions section and scrolls away with it. */
export default function SolutionsPoster() {
  return (
    <Box
      component="img"
      src={SRC}
      alt="Smart solutions for smarter business growth"
      sx={{
        display: "block",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: SOLUTIONS_DESKTOP_HEIGHT,
        objectFit: "cover",
        objectPosition: "center",
        visibility: "hidden",
      }}
    />
  );
}
