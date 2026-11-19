"use client";

import Box from "@mui/material/Box";
import Image from "next/image";
import { isVideoUrl } from "@/lib/project-media";

/** Image or video fill for project cards / detail frames. */
export default function ShowcaseMedia({
  src,
  alt,
  sizes,
  eager = false,
  controls = false,
  autoPlay = true,
  objectFit = "contain",
  objectPosition = "center",
  filter,
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  /** Detail viewers can show native controls. */
  controls?: boolean;
  /** Cards mute+loop; turn off when controls are enough. */
  autoPlay?: boolean;
  objectFit?: "contain" | "cover";
  objectPosition?: string;
  filter?: string;
}) {
  if (isVideoUrl(src)) {
    return (
      <Box
        component="video"
        src={src}
        muted={!controls}
        loop={!controls}
        autoPlay={autoPlay && !controls}
        controls={controls}
        playsInline
        preload="metadata"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit,
          objectPosition,
          zIndex: 1,
          filter,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      loading={eager ? "eager" : undefined}
      sizes={sizes}
      style={{
        objectFit,
        objectPosition,
        zIndex: 1,
        filter,
      }}
    />
  );
}
