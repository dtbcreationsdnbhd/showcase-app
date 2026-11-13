import Box from "@mui/material/Box";

const FADE_H = 56;

/**
 * Soft edge for sticky mobile stacks. A hard 1px seam reads as a cut across
 * the shared site backdrop; a short gradient lets the next page fade in.
 */
export function MobileSeamLine({ edge }: { edge: "top" | "bottom" }) {
  const fromTop = edge === "top";
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: fromTop ? 0 : "auto",
        bottom: fromTop ? "auto" : 0,
        left: 0,
        right: 0,
        height: FADE_H,
        pointerEvents: "none",
        background: fromTop
          ? "linear-gradient(180deg, rgba(48, 4, 22, 0) 0%, rgba(48, 4, 22, 0.35) 45%, rgba(48, 4, 22, 0) 100%)"
          : "linear-gradient(0deg, rgba(48, 4, 22, 0) 0%, rgba(48, 4, 22, 0.35) 45%, rgba(48, 4, 22, 0) 100%)",
        zIndex: 2,
      }}
    />
  );
}
