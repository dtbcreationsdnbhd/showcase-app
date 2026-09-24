"use client";

import Box from "@mui/material/Box";
import { Lottie } from "lottie-react";

/**
 * The dot-matrix icon, held on its first frame. Mobile v1 is static, but the
 * artwork only exists as Lottie, so we mount it with the player stopped rather
 * than ship a separate export.
 */
export default function MobileServiceIcon({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <Box role="img" aria-label={alt} sx={{ width, height }}>
      <Lottie
        src={src}
        autoplay={false}
        loop={false}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
}
