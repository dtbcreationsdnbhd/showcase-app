"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";

const PLACEHOLDER =
  "linear-gradient(135deg, #4A0F2A 0%, #7A1A2E 100%)";

const mediaSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center top",
  display: "block",
  pointerEvents: "none",
} as const;

/**
 * The loop track is three copies of every slide. `active` is the centered
 * card. `preview` is a neighbor, including the card about to slide in and the
 * middle-copy twin of a visible clone, so a loop snap does not mount a blank
 * video. Farther copies stay on the gradient.
 */
export function carouselVideoRole(index: number, pos: number, count: number) {
  const distance = Math.abs(index - pos);
  const isClone = index < count || index >= count * 2;
  const middleIndex = (slot: number) =>
    count + (((slot % count) + count) % count);
  const warmTwin =
    !isClone &&
    [pos - 2, pos - 1, pos, pos + 1, pos + 2].some((slot) => {
      if (slot < 0 || slot >= count * 3) return false;
      if (Math.abs(slot - pos) > 2) return false;
      const clone = slot < count || slot >= count * 2;
      return clone && middleIndex(slot) === index;
    });

  return {
    active: distance === 0,
    preview: (distance > 0 && distance <= 2) || warmTwin,
  };
}

export default function CarouselSlideMedia({
  src,
  alt,
  isVideo = false,
  active,
  preview = false,
  sizes,
}: {
  src: string | null;
  alt: string;
  isVideo?: boolean;
  /** Centered card: play the element that is already showing a frame. */
  active: boolean;
  /** Nearby card: same element, paused on a frame. */
  preview?: boolean;
  sizes: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const showVideo = Boolean(src && isVideo && (active || preview));

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    if (active) {
      const pending = video.play();
      if (pending) pending.catch(() => {});
      return;
    }

    video.pause();
    if (video.readyState >= 1 && video.currentTime < 0.05) {
      try {
        video.currentTime = 0.1;
      } catch {
        // Metadata is not seekable yet; loadedmetadata retries.
      }
    }
  }, [active, preview, showVideo]);

  const holdFirstFrame = () => {
    const video = videoRef.current;
    if (!video || active || video.currentTime >= 0.05) return;
    try {
      video.currentTime = 0.1;
    } catch {
      // Ignore until the browser can seek.
    }
  };

  if (showVideo && src) {
    return (
      <Box
        component="video"
        ref={videoRef}
        src={src}
        muted
        loop={active}
        playsInline
        preload={active ? "auto" : "metadata"}
        onLoadedMetadata={holdFirstFrame}
        draggable={false}
        sx={mediaSx}
      />
    );
  }

  if (src && !isVideo) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        draggable={false}
        loading={active ? "eager" : "lazy"}
        sizes={sizes}
        style={{ objectFit: "cover", objectPosition: "center top" }}
      />
    );
  }

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: PLACEHOLDER,
      }}
    />
  );
}
