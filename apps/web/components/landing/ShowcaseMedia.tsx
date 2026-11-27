"use client";

import Box from "@mui/material/Box";
import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import { isVideoUrl } from "@/lib/project-media";

/** Image or video fill for project cards / detail frames. */
export default function ShowcaseMedia({
  src,
  alt,
  sizes,
  eager = false,
  controls = false,
  autoPlay = true,
  playOnClick = false,
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
  /** Paused cover frame. A click starts playback and a second click pauses. */
  playOnClick?: boolean;
  objectFit?: "contain" | "cover";
  objectPosition?: string;
  filter?: string;
}) {
  if (isVideoUrl(src)) {
    return (
      <VideoMedia
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        playOnClick={playOnClick}
        objectFit={objectFit}
        objectPosition={objectPosition}
        filter={filter}
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

/** A media-fragment hint so browsers paint a frame before playback. */
function frameSrc(src: string): string {
  if (/#t=/i.test(src)) return src;
  return `${src}#t=0.1`;
}

function VideoMedia({
  src,
  controls,
  autoPlay,
  playOnClick,
  objectFit,
  objectPosition,
  filter,
}: {
  src: string;
  controls: boolean;
  autoPlay: boolean;
  playOnClick: boolean;
  objectFit: "contain" | "cover";
  objectPosition: string;
  filter?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const shouldAutoPlay = autoPlay && !controls && !playOnClick;
  const videoSrc = shouldAutoPlay ? src : frameSrc(src);

  function togglePlay(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      const pending = video.play();
      if (pending) {
        pending.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
      return;
    }
    video.pause();
    setPlaying(false);
  }

  return (
    <>
      <Box
        component="video"
        ref={videoRef}
        src={videoSrc}
        muted={playOnClick ? !playing : !controls}
        loop={!controls && !playOnClick}
        autoPlay={shouldAutoPlay}
        controls={controls && !playOnClick}
        playsInline
        preload={shouldAutoPlay ? "metadata" : "auto"}
        onPlay={() => {
          if (playOnClick) setPlaying(true);
        }}
        onPause={() => {
          if (playOnClick) setPlaying(false);
        }}
        onEnded={() => {
          if (playOnClick) setPlaying(false);
        }}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit,
          objectPosition,
          zIndex: 1,
          filter,
          pointerEvents: "none",
        }}
      />
      {playOnClick ? (
        <Box
          component="button"
          type="button"
          aria-label={playing ? "Pause video" : "Play video"}
          onClick={togglePlay}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            p: 0,
            m: 0,
            border: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            appearance: "none",
          }}
        >
          {playing ? null : <PlayMark />}
        </Box>
      ) : null}
    </>
  );
}

function PlayMark() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 72,
        height: 72,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(8, 4, 12, 0.55)",
        border: "1.5px solid rgba(255, 255, 255, 0.72)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        pointerEvents: "none",
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 30, height: 30, display: "block", ml: "3px" }}
      >
        <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="#FFFFFF" />
      </Box>
    </Box>
  );
}
