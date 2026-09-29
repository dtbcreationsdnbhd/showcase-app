"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import {
  mobileSheetMotion,
  useMobileSheet,
} from "@/components/mobile/use-mobile-sheet";
import type { ShowcaseProject } from "@/lib/projects";
import {
  MOBILE_BREAKPOINT,
  MOBILE_DESIGN_WIDTH,
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  MOBILE_STAGE_ZOOM,
  MOBILE_VIEWPORT_HEIGHT_CSS,
} from "@/lib/landing-layout-mobile";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const HEADER_H = 74;
const PHOTO_H = 574;
const PANEL_RADIUS = 28;
/** The sheet is full bleed and rides up over the photo, so the photo shows
 *  only through the two rounded corner cutouts. */
const PANEL_OVERLAP = 40;

const labelSx = {
  ...barlow,
  m: 0,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "rgba(255, 255, 255, 0.5)",
} as const;

const bodySx = {
  ...barlow,
  m: 0,
  width: "100%",
  minWidth: 0,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "#FFFFFF",
  overflowWrap: "anywhere",
  whiteSpace: "pre-wrap",
} as const;

function ChevronDownIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={{ width: 26, height: 26, display: "block" }}
    >
      <path
        d="M5 9l7 7 7-7"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mt: "40px" }}>
      <Typography sx={labelSx}>{label}</Typography>
      <Box sx={{ mt: "8px" }}>{children}</Box>
    </Box>
  );
}

export default function MobileProjectDetailPopup({
  project,
  onClose,
}: {
  project: ShowcaseProject | null;
  onClose: () => void;
}) {
  const open = project !== null;
  const { present, shown, reduced, onTransitionEnd } = useMobileSheet(open);
  const held = useRef(project);
  if (project) held.current = project;
  const detail = held.current;
  const [thumb, setThumb] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const swipeStart = useRef<{ x: number; y: number; axis: "x" | "y" | null } | null>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setThumb(0);
    setDragX(0);
    setDragging(false);
  }, [detail?.id]);

  useEffect(() => {
    if (!present) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // CSS hides this portal past the breakpoint, but the state would survive
    // and keep the scroll lock on, freezing the desktop page.
    const media = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);
    const onBreakpointChange = () => {
      if (media.matches) onClose();
    };
    media.addEventListener("change", onBreakpointChange);
    onBreakpointChange();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onBreakpointChange);
    };
  }, [present, onClose]);

  if (!present || !detail || typeof document === "undefined") return null;

  const imageCount = detail.detailImageUrls.length;

  function localDrag(dx: number) {
    const photo = photoRef.current;
    const visual = photo?.getBoundingClientRect().width ?? 0;
    if (!photo || !visual) return dx;
    return dx * (photo.offsetWidth / visual);
  }

  function onPhotoTouchStart(event: TouchEvent) {
    if (imageCount < 2) return;
    const touch = event.changedTouches[0];
    swipeStart.current = { x: touch.clientX, y: touch.clientY, axis: null };
  }

  function onPhotoTouchMove(event: TouchEvent) {
    const start = swipeStart.current;
    if (!start || imageCount < 2) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (!start.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (start.axis !== "x") return;

    let offset = localDrag(dx);
    const atStart = thumb === 0 && offset > 0;
    const atEnd = thumb === imageCount - 1 && offset < 0;
    if (atStart || atEnd) offset *= 0.35;
    setDragging(true);
    setDragX(offset);
  }

  function onPhotoTouchEnd(event: TouchEvent) {
    const start = swipeStart.current;
    swipeStart.current = null;
    setDragging(false);
    setDragX(0);
    if (!start || start.axis !== "x" || imageCount < 2) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const width = photoRef.current?.getBoundingClientRect().width ?? 1;
    if (Math.abs(dx) < Math.max(40, width * 0.18)) return;

    setThumb((current) => {
      if (dx < 0) return Math.min(current + 1, imageCount - 1);
      return Math.max(current - 1, 0);
    });
  }

  return createPortal(
    <div
      className="mobile-portal-root"
      style={{ position: "fixed", inset: 0, zIndex: 220 }}
    >
      <Box
        role="dialog"
        aria-modal
        aria-labelledby="mobile-project-detail-title"
        onTransitionEnd={onTransitionEnd}
        sx={{
          width: MOBILE_DESIGN_WIDTH,
          height: MOBILE_VIEWPORT_HEIGHT_CSS,
          zoom: MOBILE_STAGE_ZOOM,
          bgcolor: MOBILE_SECTION_BG,
          overflowY: "auto",
          overscrollBehavior: "contain",
          ...mobileSheetMotion(shown, reduced),
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            height: HEADER_H,
            px: `${MOBILE_GUTTER}px`,
            bgcolor: "#10141D",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="button"
            type="button"
            aria-label="Close"
            onClick={onClose}
            sx={{
              p: 0,
              m: 0,
              border: 0,
              bgcolor: "transparent",
              appearance: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronDownIcon />
          </Box>
          <Typography
            sx={{
              ...barlow,
              m: 0,
              flexGrow: 1,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "24px",
              color: "#FFFFFF",
              // Keep the label optically centred against the close button.
              mr: "26px",
            }}
          >
            Project Details
          </Typography>
        </Box>

        <Box
          ref={photoRef}
          onTouchStart={onPhotoTouchStart}
          onTouchMove={onPhotoTouchMove}
          onTouchEnd={onPhotoTouchEnd}
          onTouchCancel={onPhotoTouchEnd}
          sx={{
            position: "relative",
            width: "100%",
            height: PHOTO_H,
            overflow: "hidden",
            touchAction: "pan-y",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: imageCount > 0 ? `${imageCount * 100}%` : "100%",
              transform:
                imageCount > 0
                  ? `translateX(calc(${(-thumb * 100) / imageCount}% + ${dragX}px))`
                  : "none",
              transition: dragging || reduced ? "none" : "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {detail.detailImageUrls.map((src, index) => (
              <Box
                key={`${detail.id}-${index}`}
                sx={{
                  position: "relative",
                  width: `${100 / Math.max(imageCount, 1)}%`,
                  height: "100%",
                  flexShrink: 0,
                }}
              >
                {src ? (
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100vw"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                ) : null}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              position: "absolute",
              zIndex: 1,
              left: 0,
              right: 0,
              bottom: `${PANEL_OVERLAP + 16}px`,
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {detail.detailImageUrls.map((_, index) => (
              <Box
                key={index}
                component="button"
                type="button"
                aria-label={`Image ${index + 1}`}
                onClick={() => setThumb(index)}
                sx={{
                  p: 0,
                  m: 0,
                  border: 0,
                  appearance: "none",
                  cursor: "pointer",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor:
                    thumb === index ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                }}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            mt: `-${PANEL_OVERLAP}px`,
            minWidth: 0,
            px: `${MOBILE_GUTTER}px`,
            pt: "34px",
            pb: "80px",
            overflow: "hidden",
            borderRadius: `${PANEL_RADIUS}px ${PANEL_RADIUS}px 0 0`,
            // The panel is the page colour with a faint lift along its top edge.
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 70px), ${MOBILE_SECTION_BG}`,
          }}
        >
          <Typography sx={labelSx}>Project Name</Typography>
          <Typography
            id="mobile-project-detail-title"
            component="h2"
            sx={{
              ...barlow,
              m: 0,
              mt: "8px",
              fontWeight: 600,
              fontSize: 26,
              lineHeight: "36px",
              overflowWrap: "anywhere",
              backgroundImage:
                "linear-gradient(96.02deg, #FA9DFF 2.09%, #977EFF 97.91%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {detail.name}
          </Typography>

          <Section label="Tags">
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
              {detail.tags.map((tag) => (
                <Box
                  key={tag}
                  sx={{
                    boxSizing: "border-box",
                    py: "7px",
                    px: "13px",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "16px",
                  }}
                >
                  <Typography sx={bodySx}>
                    {tag.replace(/\.\.\.$/, "")}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Section>

          <Section label="Challenge">
            <Typography sx={bodySx}>{detail.challenge}</Typography>
          </Section>

          <Section label="Solution">
            <Typography sx={bodySx}>{detail.solution}</Typography>
          </Section>
        </Box>
      </Box>
    </div>,
    document.body,
  );
}
