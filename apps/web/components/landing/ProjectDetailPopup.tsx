"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ShowcaseMedia from "@/components/landing/ShowcaseMedia";
import { GOLD_INK, GOLD_SOLID, GOLD_TEXT, GOLD_TEXT_GLOW, goldButtonSx } from "@/lib/gold-theme";
import { figmaPx } from "@/lib/landing-layout";
import type { FeatureIconName } from "@/lib/project-sheet";
import {
  projectGalleryMedia,
  type ShowcaseProject,
} from "@/lib/projects";

const GALLERY_ROTATE_MS = 5000;

/** Shown until a project is saved with its own popup copy. */
const SAMPLE_SHEET = {
  subtitle: "Search Growth Solutions for Long-Term Visibility.",
  features: [
    { label: "Keyword Research", icon: "search" },
    { label: "On-Page SEO", icon: "gear" },
    { label: "Content Creation", icon: "doc" },
    { label: "Backlink Building", icon: "link" },
    { label: "SEO Reporting", icon: "chart" },
    { label: "Expert Consultation", icon: "headset" },
  ],
  whyIt:
    "Paid ads can bring quick visibility, but long-term growth needs more than advertising alone. Without a strong Google presence, potential customers may find your competitors instead.",
  howWeHelp:
    "We help businesses increase their Google visibility and attract relevant organic traffic through strategic keyword research, on-page optimization, quality content, and backlink building. With customized strategies and weekly reporting, we support sustainable growth and reduce reliance on paid advertising.",
  ctaText: "Get Your Free SEO Audit",
  footerText: "Build Visibility. Drive Traffic. Grow Your Business.",
} as const;

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const POPUP_GOLD = "#F6C15A";

const PAD_X = 44;
const PAD_Y = 52;
/** Popup frame stays this wide; the photo column is the narrower share. */
const PHOTO_W = 420;
const PHOTO_H = 540 / 0.78;
const COL_GAP = 48;
const TEXT_W = 760;

const bodySx = {
  ...barlow,
  m: 0,
  width: "100%",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: figmaPx(20),
  lineHeight: "155%",
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
  aspectRatio = PHOTO_W / PHOTO_H,
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
    bgcolor: "#120804",
    border: "1.5px solid rgba(255, 196, 92, 0.85)",
    boxShadow: "0 0 18px rgba(255, 160, 40, 0.28)",
    borderRadius: `${figmaPx(16)}px`,
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
        objectPosition="center top"
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

function GoldTitle({ id, children }: { id: string; children: string }) {
  const type = {
    ...barlow,
    m: 0,
    fontWeight: 700,
    fontSize: figmaPx(56),
    lineHeight: `${figmaPx(62)}px`,
  };
  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Typography
        component="span"
        aria-hidden
        sx={{
          ...type,
          position: "absolute",
          left: 0,
          top: 0,
          color: "#C47A12",
          textShadow: [
            "0 1px 0 #E8B24A",
            "0 2px 0 #D49828",
            "0 3px 0 #C08018",
            "0 4px 0 #A86810",
            "0 6px 10px rgba(80, 30, 0, 0.45)",
          ].join(", "),
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {children}
      </Typography>
      <Typography
        id={id}
        component="h2"
        sx={{
          ...type,
          position: "relative",
          backgroundImage: GOLD_TEXT,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          filter: GOLD_TEXT_GLOW,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function SheetLabel({ children }: { children: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: `${figmaPx(8)}px` }}>
      <Box
        sx={{
          width: figmaPx(4),
          height: figmaPx(24),
          borderRadius: figmaPx(2),
          background: GOLD_SOLID,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          ...barlow,
          m: 0,
          fontWeight: 600,
          fontSize: figmaPx(22),
          letterSpacing: "0.04em",
          color: POPUP_GOLD,
          textShadow:
            "0 1px 0 rgba(255, 236, 190, 0.85), 0 2px 0 #C4841A",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function FeatureIcon({ name }: { name: FeatureIconName }) {
  const common = {
    fill: "none",
    stroke: POPUP_GOLD,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={{ width: figmaPx(20), height: figmaPx(20), flexShrink: 0 }}
    >
      {name === "search" ? (
        <>
          <circle {...common} cx="11" cy="11" r="6.5" />
          <path {...common} d="M16 16.5 20 20.5" />
        </>
      ) : null}
      {name === "gear" ? (
        <path
          {...common}
          d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M12 4.5v1.6M12 17.9V19.5M4.5 12H6.1M17.9 12H19.5M6.4 6.4l1.1 1.1M16.5 16.5l1.1 1.1M17.6 6.4l-1.1 1.1M7.5 16.5l-1.1 1.1"
        />
      ) : null}
      {name === "doc" ? (
        <path {...common} d="M7 3.5h7l4 4V20.5H7V3.5Z M14 3.5V8h4.5 M9.5 12.5h6 M9.5 16h6" />
      ) : null}
      {name === "link" ? (
        <path
          {...common}
          d="M10 13.5a4 4 0 0 0 6 .4l2.2-2.2a4 4 0 0 0-5.6-5.6L11 7.7 M14 10.5a4 4 0 0 0-6-.4L5.8 12.3a4 4 0 0 0 5.6 5.6L13 16.3"
        />
      ) : null}
      {name === "chart" ? (
        <path {...common} d="M4.5 19.5h15 M7 16.5v-4 M12 16.5V8 M17 16.5v-6" />
      ) : null}
      {name === "headset" ? (
        <path
          {...common}
          d="M5 13.5v-1a7 7 0 0 1 14 0v1 M5 13.5h2.2v4.5H6.2A1.2 1.2 0 0 1 5 16.8v-3.3Z M19 13.5h-2.2v4.5h.9a1.2 1.2 0 0 0 1.3-1.2v-3.3Z M14.5 18.2a2.5 2.5 0 0 1-2.5 2.3h-1"
        />
      ) : null}
      {name === "display" ? (
        <>
          <rect {...common} x="3.5" y="4" width="17" height="11.5" rx="1.6" />
          <path {...common} d="M8 20h8M12 15.5V20" />
        </>
      ) : null}
      {name === "image" ? (
        <>
          <rect {...common} x="3.5" y="5" width="17" height="14" rx="1.6" />
          <circle {...common} cx="8.5" cy="9.2" r="1.3" />
          <path {...common} d="M3.5 16.2 8.4 12.2l3.4 3 3.1-2.6 5.6 4.4" />
        </>
      ) : null}
      {name === "users" ? (
        <>
          <circle {...common} cx="12" cy="8" r="2.1" />
          <circle {...common} cx="7" cy="9.2" r="1.6" />
          <circle {...common} cx="17" cy="9.2" r="1.6" />
          <path {...common} d="M8.4 18.4c.4-2.2 1.8-3.5 3.6-3.5s3.2 1.3 3.6 3.5" />
          <path {...common} d="M4.4 18c.4-1.6 1.3-2.6 2.6-2.9" />
          <path {...common} d="M19.6 18c-.4-1.6-1.3-2.6-2.6-2.9" />
        </>
      ) : null}
      {name === "eye" ? (
        <>
          <path {...common} d="M2.5 12S6.4 6.8 12 6.8 21.5 12 21.5 12 17.6 17.2 12 17.2 2.5 12 2.5 12Z" />
          <circle {...common} cx="12" cy="12" r="2.4" />
        </>
      ) : null}
      {name === "clapper" ? (
        <>
          <path {...common} d="M4.5 9.5h15v9.2a1.6 1.6 0 0 1-1.6 1.6H6.1a1.6 1.6 0 0 1-1.6-1.6V9.5Z" />
          <path {...common} d="M4.2 9.5 6.4 4.8h3.2L7.4 9.5M9.2 9.5 11.4 4.8h3.1L12.3 9.5M14.2 9.5 16.4 4.8h2.8L17.2 9.5" />
        </>
      ) : null}
      {name === "megaphone" ? (
        <>
          <path {...common} d="M4.5 9.2h3.2l7.6-3.4v12.4L7.7 14.8H4.5V9.2Z" />
          <path {...common} d="M7.6 14.6v2.6a1.6 1.6 0 0 0 1.6 1.6h.6M16.2 9.2c1.4.7 1.4 4.9 0 5.6" />
        </>
      ) : null}
      {name === "star" ? (
        <path {...common} d="M12 3.8 14.1 9l5.5.4-4.2 3.5 1.3 5.3L12 15.4 7.3 18.2 8.6 12.9 4.4 9.4 9.9 9 12 3.8Z" />
      ) : null}
      {name === "video" ? (
        <>
          <rect {...common} x="3.5" y="6" width="17" height="12" rx="2" />
          <path {...common} d="M10.2 9.4v5.2L15 12l-4.8-2.6Z" />
        </>
      ) : null}
      {name === "share" ? (
        <>
          <circle {...common} cx="7" cy="12" r="2.1" />
          <circle {...common} cx="16.5" cy="7.2" r="2.1" />
          <circle {...common} cx="16.5" cy="16.8" r="2.1" />
          <path {...common} d="M8.9 11.1 14.6 8.2M8.9 12.9l5.7 2.9" />
        </>
      ) : null}
      {name === "music" ? (
        <>
          <path {...common} d="M9 17.2V6.4l9-1.6v10.2" />
          <circle {...common} cx="6.8" cy="17.2" r="2.2" />
          <circle {...common} cx="15.8" cy="15" r="2.2" />
        </>
      ) : null}
      {name === "waveform" ? (
        <path {...common} d="M4 10v4M8 7v10M12 4.5v15M16 8v8M20 10.5v3" />
      ) : null}
      {name === "sliders" ? (
        <>
          <path {...common} d="M5 5.5v13M12 5.5v13M19 5.5v13" />
          <circle {...common} cx="5" cy="10" r="1.7" />
          <circle {...common} cx="12" cy="14.5" r="1.7" />
          <circle {...common} cx="19" cy="8.5" r="1.7" />
        </>
      ) : null}
      {name === "headphones" ? (
        <>
          <path {...common} d="M5 13.2v-1a7 7 0 0 1 14 0v1" />
          <rect {...common} x="3.6" y="13" width="3.6" height="5.4" rx="1.2" />
          <rect {...common} x="16.8" y="13" width="3.6" height="5.4" rx="1.2" />
        </>
      ) : null}
      {name === "layers" ? (
        <>
          <path {...common} d="M12 4.2 20 8.2 12 12.2 4 8.2 12 4.2Z" />
          <path {...common} d="M4 12 12 16l8-4" />
          <path {...common} d="M4 15.6 12 19.6l8-4" />
        </>
      ) : null}
      {name === "pencil" ? (
        <>
          <path {...common} d="M14.2 5.2 18.8 9.8 9.2 19.4 4.2 19.8 4.6 14.8 14.2 5.2Z" />
          <path {...common} d="M12.4 7 17 11.6" />
        </>
      ) : null}
      {name === "sparkle" ? (
        <>
          <path {...common} d="M12 3.5 13.1 8.2 17.8 9.3 13.1 10.4 12 15.1 10.9 10.4 6.2 9.3 10.9 8.2 12 3.5Z" />
          <path {...common} d="M17.6 14.2 18.2 16.2 20.2 16.8 18.2 17.4 17.6 19.4 17 17.4 15 16.8 17 16.2 17.6 14.2Z" />
        </>
      ) : null}
      {name === "camera" ? (
        <>
          <rect {...common} x="3.2" y="7" width="12.2" height="10" rx="1.8" />
          <path {...common} d="M15.4 10.2 20.8 7.6v8.8l-5.4-2.6v-3.6Z" />
        </>
      ) : null}
      {name === "robot" ? (
        <>
          <rect {...common} x="6" y="8" width="12" height="9.5" rx="2" />
          <path {...common} d="M12 8V5.2M9.2 12.2h.1M14.7 12.2h.1M9.4 15.2h5.2" />
          <circle {...common} cx="12" cy="5.2" r="0.8" />
          <path {...common} d="M6 12.2H4.2M19.8 12.2H18" />
        </>
      ) : null}
      {name === "chat" ? (
        <path {...common} d="M5 6.2h14a1.6 1.6 0 0 1 1.6 1.6v7.2a1.6 1.6 0 0 1-1.6 1.6H10l-4.2 3.2v-3.2H5a1.6 1.6 0 0 1-1.6-1.6V7.8A1.6 1.6 0 0 1 5 6.2Z" />
      ) : null}
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
  closable = true,
}: {
  project: ShowcaseProject;
  onClose: () => void;
  closable?: boolean;
}) {
  const detail = project;
  const hasSheet =
    Boolean(detail.subtitle || detail.whyIt || detail.howWeHelp || detail.ctaText || detail.footerText) ||
    detail.features.length > 0;
  const sheet = hasSheet ? detail : { ...detail, ...SAMPLE_SHEET };
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
        if (closable) onClose();
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
  }, [closable, onClose, media.length]);

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
  const closeSize = figmaPx(36);
  const cardH = figmaPx(PAD_Y * 2 + PHOTO_H + 72);

  return createPortal(
    <Box
      role="presentation"
      onClick={closable ? onClose : undefined}
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
          transformOrigin: "center center",
          transform: `scale(calc(min(94vw, ${((94 * cardW) / cardH).toFixed(2)}vh) / ${cardW}px))`,
        }}
      >
        {closable ? (
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
            border: "1.5px solid rgba(255, 196, 92, 0.9)",
            borderRadius: "50%",
            bgcolor: "rgba(20, 8, 4, 0.72)",
            boxShadow: "0 0 12px rgba(255, 160, 40, 0.35)",
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
              stroke={POPUP_GOLD}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </Box>
        </Box>
        ) : null}

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
            py: `${figmaPx(28)}px`,
            px: 0,
            width: cardW,
            bgcolor: "#160904",
            border: "1.5px solid rgba(255, 196, 92, 0.92)",
            boxShadow:
              "0 0 28px rgba(255, 150, 30, 0.38), inset 0 0 48px rgba(255, 140, 20, 0.08)",
            borderRadius: `${figmaPx(28)}px`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              px: `${figmaPx(PAD_X)}px`,
              pb: `${figmaPx(18)}px`,
              boxSizing: "border-box",
            }}
          >
            <Box
              component="img"
              src="/landing/logo.png"
              alt="VisionCraft"
              sx={{ height: figmaPx(42), width: "auto", display: "block" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "stretch",
              px: `${figmaPx(PAD_X)}px`,
              pb: `${figmaPx(8)}px`,
              gap: `${figmaPx(COL_GAP)}px`,
              width: "100%",
              boxSizing: "border-box",
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
              gap: `${figmaPx(20)}px`,
              width: figmaPx(TEXT_W),
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(4)}px`, width: "100%" }}>
              <SheetLabel>Product Name</SheetLabel>
              <GoldTitle id="project-detail-title">{sheet.name}</GoldTitle>
              {sheet.subtitle ? (
                <Typography sx={{ ...bodySx, color: "rgba(255,255,255,0.88)" }}>
                  {sheet.subtitle}
                </Typography>
              ) : null}
            </Box>

            {sheet.features.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(8)}px`, width: "100%" }}>
              <SheetLabel>Key Features</SheetLabel>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: `${figmaPx(8)}px`,
                  width: "100%",
                }}
              >
                {sheet.features.map((feature, index) => (
                  <Box
                    key={`${feature.icon}-${feature.label}-${index}`}
                    sx={{
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      gap: `${figmaPx(8)}px`,
                      minWidth: 0,
                      py: `${figmaPx(8)}px`,
                      px: `${figmaPx(12)}px`,
                      border: "1px solid rgba(255, 196, 92, 0.55)",
                      borderRadius: "999px",
                      bgcolor: "rgba(40, 16, 6, 0.55)",
                    }}
                  >
                    <FeatureIcon name={feature.icon} />
                    <Typography
                      sx={{
                        ...barlow,
                        m: 0,
                        fontWeight: 500,
                        fontSize: figmaPx(13),
                        lineHeight: 1.2,
                        color: "#FFFFFF",
                      }}
                    >
                      {feature.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            ) : null}

            {sheet.whyIt ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(6)}px`, width: "100%" }}>
              <SheetLabel>Why You Need It</SheetLabel>
              <Typography sx={{ ...bodySx, fontSize: figmaPx(16) }}>{sheet.whyIt}</Typography>
            </Box>
            ) : null}

            {sheet.howWeHelp ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(6)}px`, width: "100%" }}>
              <SheetLabel>How We Help</SheetLabel>
              <Typography sx={{ ...bodySx, fontSize: figmaPx(16) }}>{sheet.howWeHelp}</Typography>
            </Box>
            ) : null}

            {sheet.ctaText || sheet.footerText ? (
            <Box
              sx={{
                mt: "auto",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: `${figmaPx(16)}px`,
              }}
            >
              {sheet.ctaText ? (
              <Box
                component="a"
                href="/#contact"
                onClick={onClose}
                className="hover-grow"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: `${figmaPx(10)}px`,
                  height: figmaPx(52),
                  px: `${figmaPx(28)}px`,
                  borderRadius: "999px",
                  textDecoration: "none",
                  ...goldButtonSx,
                  ...barlow,
                  fontWeight: 600,
                  fontSize: figmaPx(18),
                  color: GOLD_INK,
                }}
              >
                {sheet.ctaText}
                <Box component="span" aria-hidden sx={{ fontSize: figmaPx(18), lineHeight: 1 }}>
                  →
                </Box>
              </Box>
              ) : null}

              {sheet.footerText ? (
              <Typography
                sx={{
                  ...barlow,
                  m: 0,
                  width: "100%",
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: figmaPx(16),
                  letterSpacing: "0.02em",
                  color: "rgba(255, 220, 160, 0.78)",
                }}
              >
                {sheet.footerText}
              </Typography>
              ) : null}
            </Box>
            ) : null}
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
