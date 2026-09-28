import Box from "@mui/material/Box";
import { MOBILE_GUTTER } from "@/lib/landing-layout-mobile";

const SEAM = "rgba(255, 255, 255, 0.72)";

export function MobileSeamLine({ edge }: { edge: "top" | "bottom" }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: edge === "top" ? 0 : "auto",
        bottom: edge === "bottom" ? 0 : "auto",
        left: `${MOBILE_GUTTER}px`,
        right: `${MOBILE_GUTTER}px`,
        height: "1px",
        bgcolor: SEAM,
      }}
    />
  );
}
