"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ProjectBodyText from "@/components/landing/ProjectBodyText";
import ShowcaseMedia from "@/components/landing/ShowcaseMedia";
import { LANDING_DESIGN_WIDTH, figmaPx } from "@/lib/landing-layout";
import {
  projectGalleryMedia,
  type ShowcaseProject,
} from "@/lib/projects";
const GALLERY_ROTATE_MS = 5000;

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const PAD_X = 44;
const PAD_Y = 52;
/** Same portrait ratio as ProjectCard (276 × 414.75). */
const PHOTO_ASPECT = 276 / 414.75;
const PHOTO_W = 480;
const PHOTO_H = PHOTO_W / PHOTO_ASPECT;
const COL_GAP = 48;
const TEXT_W = 520;

const labelSx = {
  ...barlow,
  m: 0,
  width: "100%",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: figmaPx(14),
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "rgba(255, 255, 255, 0.5)",
} as const;

const bodySx = {
  ...barlow,
  m: 0,
  width: "100%",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: figmaPx(16),
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "#FFFFFF",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  minWidth: 0,
} as const;

function ProjectPhoto({
  src,
  width,
  height,
  alt,
  controls = false,
  objectFit = "cover",
  aspectRatio = PHOTO_ASPECT,
}: {
  src: string | null;
  width: number | string;
  height?: number | string;
  alt: string;
  controls?: boolean;
  objectFit?: "contain" | "cover";
  aspectRatio?: number;
}) {
  const frameSx = {
    position: "relative" as const,
    boxSizing: "border-box" as const,
    width,
    ...(height !== undefined
      ? { height }
      : { aspectRatio: `${aspectRatio}`, height: "auto" }),
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(198, 206, 214, 0.36) 42%, rgba(132, 140, 150, 0.42) 100%)",
    backdropFilter: "blur(22px) saturate(1.35)",
    WebkitBackdropFilter: "blur(22px) saturate(1.35)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: `${figmaPx(12)}px`,
    flexShrink: 0,
  };

  if (!src) {
    return (
      <ImagePlaceholder
        width={typeof width === "number" ? width : figmaPx(PHOTO_W)}
        height={
          typeof height === "number" ? height : figmaPx(PHOTO_H)
        }
      />
    );
  }

  const sizeHint =
    typeof width === "number" ? `${width}px` : `${figmaPx(PHOTO_W)}px`;

  return (
    <Box sx={frameSx}>
      <ShowcaseMedia
        src={src}
        alt={alt}
        sizes={sizeHint}
        controls={controls}
        autoPlay={!controls}
        objectFit={objectFit}
        filter="drop-shadow(0 0 1px rgba(255, 255, 255, 0.55)) drop-shadow(0 12px 22px rgba(0, 0, 0, 0.4))"
      />
    </Box>
  );
}

function GalleryArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <Box
      component="button"
      type="button"
      aria-label={isPrev ? "Previous media" : "Next media"}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        ...(isPrev ? { left: figmaPx(12) } : { right: figmaPx(12) }),
        zIndex: 2,
        width: figmaPx(40),
        height: figmaPx(40),
        p: 0,
        m: 0,
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(8, 4, 12, 0.45)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        appearance: "none",
        color: "#FFFFFF",
        transition: "background-color 160ms ease, border-color 160ms ease",
        "&:hover": {
          bgcolor: "rgba(8, 4, 12, 0.68)",
          borderColor: "rgba(255, 215, 122, 0.55)",
        },
        "&:focus-visible": {
          outline: "2px solid #FF2D78",
          outlineOffset: 2,
        },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 24 24"
        aria-hidden
        sx={{ width: figmaPx(18), height: figmaPx(18), display: "block" }}
      >
        <path
          d={isPrev ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
    </Box>
  );
}

function ImagePlaceholder({
  width,
  height,
  filled = true,
}: {
  width: number;
  height: number;
  filled?: boolean;
}) {
  const icon = Math.min(width, height) * 0.42;
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        width,
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: filled ? "#22060F" : "transparent",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: `${figmaPx(12)}px`,
        flexShrink: 0,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 48 48"
        aria-hidden
        sx={{
          width: icon,
          height: icon,
          display: "block",
          color: "rgba(255, 255, 255, 0.18)",
        }}
      >
        <rect
          x="5"
          y="8"
          width="38"
          height="32"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <circle cx="17" cy="19" r="4" fill="currentColor" />
        <path
          d="M8 36.4 18.2 24.8l7.2 7.4 6.4-6.8L40 36.4Z"
          fill="currentColor"
        />
      </Box>
    </Box>
  );
}

export default function ProjectDetailPopup({
  project,
  onClose,
}: {
  project: ShowcaseProject;
  onClose: () => void;
}) {
  const detail = project;
  const { media } = projectGalleryMedia(project);
  const [slide, setSlide] = useState(0);
  const [resumeKey, setResumeKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const imageSrc = media[slide] ?? media[0] ?? null;
  const canSlide = media.length > 1;

  function goTo(index: number) {
    if (media.length < 1) return;
    setSlide(((index % media.length) + media.length) % media.length);
    setResumeKey((key) => key + 1);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSlide(0);
    setResumeKey(0);
  }, [project.id]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (media.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSlide((current) => (current - 1 + media.length) % media.length);
        setResumeKey((key) => key + 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setSlide((current) => (current + 1) % media.length);
        setResumeKey((key) => key + 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, media.length]);

  useEffect(() => {
    if (!canSlide) return;
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % media.length);
    }, GALLERY_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [canSlide, media.length, project.id, resumeKey]);

  useEffect(() => {
    const html = document.documentElement;
    const previous = {
      overflow: html.style.overflow,
      gutter: html.style.scrollbarGutter,
    };
    // Keep the gutter so hiding the scrollbar doesn't nudge the page sideways.
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous.overflow;
      html.style.scrollbarGutter = previous.gutter;
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const cardW = figmaPx(PAD_X + PHOTO_W + COL_GAP + TEXT_W + PAD_X);
  const closeSize = figmaPx(44);
  const cardH = figmaPx(PAD_Y * 2 + PHOTO_H);

  return createPortal(
    <Box
      role="presentation"
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(34, 6, 15, 0.45)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: cardW,
          flexShrink: 0,
          transform: `scale(calc(min(100vw, ${((88 * LANDING_DESIGN_WIDTH) / cardH).toFixed(2)}vh) / ${LANDING_DESIGN_WIDTH}px))`,
        }}
      >
        <Box
          component="button"
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="hover-grow"
          sx={{
            position: "absolute",
            top: figmaPx(18),
            right: figmaPx(18),
            width: closeSize,
            height: closeSize,
            p: 0,
            m: 0,
            border: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            appearance: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            "&:focus-visible": {
              outline: "2px solid #FF2D78",
              outlineOffset: 3,
              borderRadius: `${figmaPx(8)}px`,
            },
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 16 16"
            aria-hidden
            sx={{ width: figmaPx(26), height: figmaPx(26), display: "block" }}
          >
            <path
              d="M3 3 13 13M13 3 3 13"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </Box>
        </Box>

        <Box
          role="dialog"
          aria-modal
          aria-labelledby="project-detail-title"
          onClick={(event) => event.stopPropagation()}
          sx={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: `${figmaPx(PAD_Y)}px`,
            px: 0,
            width: cardW,
            bgcolor: "rgba(65, 65, 65, 0.26)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: `${figmaPx(36)}px`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              px: `${figmaPx(PAD_X)}px`,
              gap: `${figmaPx(COL_GAP)}px`,
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: figmaPx(PHOTO_W),
                flexShrink: 0,
              }}
            >
              <ProjectPhoto
                src={imageSrc}
                width={figmaPx(PHOTO_W)}
                height={figmaPx(PHOTO_H)}
                alt={detail.name}
                objectFit="cover"
              />
              {canSlide ? (
                <>
                  <GalleryArrow
                    direction="prev"
                    onClick={() => goTo(slide - 1)}
                  />
                  <GalleryArrow
                    direction="next"
                    onClick={() => goTo(slide + 1)}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: figmaPx(16),
                      display: "flex",
                      justifyContent: "center",
                      gap: `${figmaPx(8)}px`,
                      zIndex: 2,
                    }}
                  >
                    {media.map((src, index) => (
                      <Box
                        key={`${src}-${index}`}
                        component="button"
                        type="button"
                        aria-label={`Go to media ${index + 1}`}
                        aria-current={slide === index ? "true" : undefined}
                        onClick={() => goTo(index)}
                        sx={{
                          width: figmaPx(8),
                          height: figmaPx(8),
                          p: 0,
                          m: 0,
                          border: 0,
                          borderRadius: "50%",
                          cursor: "pointer",
                          appearance: "none",
                          bgcolor:
                            slide === index
                              ? "rgba(255, 215, 122, 0.95)"
                              : "rgba(255, 255, 255, 0.35)",
                          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.35)",
                          "&:hover": {
                            bgcolor:
                              slide === index
                                ? "rgba(255, 215, 122, 1)"
                                : "rgba(255, 255, 255, 0.55)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              ) : null}
            </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              gap: `${figmaPx(28)}px`,
              width: figmaPx(TEXT_W),
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Project Name</Typography>
              <Typography
                id="project-detail-title"
                component="h2"
                sx={{
                  ...barlow,
                  m: 0,
                  width: "100%",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: figmaPx(28),
                  lineHeight: `${figmaPx(40)}px`,
                  backgroundImage:
                    "linear-gradient(96.02deg, #FF8FB1 2.09%, #FFB45C 97.91%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {detail.name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Tags</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  p: 0,
                  gap: `${figmaPx(7)}px`,
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {detail.tags.map((tag) => {
                  const wraps = /\.\.\.$/.test(tag);
                  const label = tag.replace(/\.\.\.$/, "");
                  return (
                    <Fragment key={tag}>
                      {wraps ? (
                        <Box
                          aria-hidden
                          sx={{ flexBasis: "100%", height: 0 }}
                        />
                      ) : null}
                      <Box
                        sx={{
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          py: `${figmaPx(5)}px`,
                          px: `${figmaPx(10)}px`,
                          bgcolor: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: `${figmaPx(12)}px`,
                          maxWidth: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            ...barlow,
                            m: 0,
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: figmaPx(14),
                            lineHeight: "160%",
                            letterSpacing: "0.02em",
                            color: "#FFFFFF",
                            whiteSpace: "normal",
                          }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    </Fragment>
                  );
                })}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Challenge</Typography>
              <ProjectBodyText value={detail.challenge} sx={bodySx} />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Solution</Typography>
              <ProjectBodyText value={detail.solution} sx={bodySx} />
            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
