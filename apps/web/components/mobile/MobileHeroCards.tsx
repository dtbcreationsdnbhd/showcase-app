"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import { flushSync } from "react-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import type { HeroSlide } from "@/components/landing/HeroCarousel";
import { MOBILE_DESIGN_WIDTH } from "@/lib/landing-layout-mobile";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = 168;
const IMAGE_H = Math.round((CARD_W * 4) / 3);
const FOOTER_H = 96;
const CARD_H = IMAGE_H + FOOTER_H;
/** Vertical room so the active card's gold glow isn't clipped by neighbours. */
const GLOW_PAD = 24;
const GAP = 8;
const STEP = CARD_W + GAP;
const INTERVAL_MS = 4000;
const RESUME_AFTER_MS = 6000;
const DRAG_START_PX = 6;

/** Centre the active card in the 440 stage. */
const CENTER_X = (MOBILE_DESIGN_WIDTH - CARD_W) / 2;

export default function MobileHeroCards({
  slides,
}: {
  slides: readonly HeroSlide[];
}) {
  const n = slides.length;
  const reduced = usePrefersReducedMotion();
  const initialPos = Math.max(n, n + Math.min(1, Math.max(0, n - 1)));
  const [pos, setPos] = useState(initialPos);
  const [animate, setAnimate] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(initialPos);
  const drag = useRef({ id: -1, startX: 0, dx: 0, scale: 1, moved: false });
  const suppressClick = useRef(false);
  const lastInteraction = useRef(0);

  const setPosition = (p: number) => {
    posRef.current = p;
    setPos(p);
  };

  const inMiddle = (p: number) => p >= n && p < 2 * n;
  const toMiddle = (p: number) => n + (((p % n) + n) % n);

  const snapToMiddle = () => {
    const p = posRef.current;
    if (inMiddle(p)) return;
    flushSync(() => {
      setAnimate(false);
      setPosition(toMiddle(p));
    });
  };

  const move = (by: number) => {
    snapToMiddle();
    const step = Math.max(-(n - 1), Math.min(n - 1, by));
    setPosition(posRef.current + step);
  };

  const moveRef = useRef(move);
  useLayoutEffect(() => {
    moveRef.current = move;
  });

  useEffect(() => {
    if (n < 2 || reduced) return;
    const id = setInterval(() => {
      if (document.hidden || (drag.current.id !== -1 && drag.current.moved)) {
        return;
      }
      if (Date.now() - lastInteraction.current < RESUME_AFTER_MS) return;
      moveRef.current(1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [n, reduced]);

  useLayoutEffect(() => {
    if (animate) return;
    void trackRef.current?.offsetWidth;
    setAnimate(true);
  }, [animate]);

  const handleTransitionEnd = (e: TransitionEvent) => {
    if (e.target !== e.currentTarget) return;
    if (!inMiddle(posRef.current)) {
      setAnimate(false);
      setPosition(toMiddle(posRef.current));
    }
  };

  const shift = (by: number) => {
    lastInteraction.current = Date.now();
    move(by);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = rootRef.current;
    // Stage uses CSS `zoom`; map screen px back into design px.
    const scale = el ? el.getBoundingClientRect().width / el.offsetWidth : 1;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      dx: 0,
      scale: scale || 1,
      moved: false,
    };
    // Capture immediately so moves aren't eaten by the inner <a> / browser.
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = (e.clientX - d.startX) / d.scale;
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      d.moved = true;
      snapToMiddle();
      setDragging(true);
    }
    d.dx = dx;
    setDragX(dx);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    drag.current = { ...d, id: -1 };
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dx = d.dx;
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    setDragging(false);
    setDragX(0);
    if (Math.abs(dx) > STEP * 0.2) {
      const steps = Math.max(1, Math.round(Math.abs(dx) / STEP));
      shift(-Math.sign(dx) * steps);
    } else {
      lastInteraction.current = Date.now();
    }
  };

  const onClickCapture = (e: MouseEvent) => {
    if (!suppressClick.current) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const track = n > 0 ? [...slides, ...slides, ...slides] : [];
  const transition = (props: string) =>
    animate && !dragging && !reduced ? props : "none";

  if (n === 0) return null;

  return (
    <Box
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onClickCapture={onClickCapture}
      sx={{
        width: "100%",
        height: CARD_H + GLOW_PAD * 2,
        overflow: "visible",
        overscrollBehaviorX: "contain",
        // `none` so horizontal swipes hit our handlers; page still scrolls
        // when the finger starts outside this card band.
        touchAction: "none",
        userSelect: "none",
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      <Box
        ref={trackRef}
        onTransitionEnd={handleTransitionEnd}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: `${GAP}px`,
          height: CARD_H,
          my: `${GLOW_PAD}px`,
          transform: `translateX(${CENTER_X - pos * STEP + dragX}px)`,
          transition: transition(
            "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          ),
        }}
      >
        {track.map((slide, j) => {
          const isActive = j === pos;
          const isClone = j < n || j >= 2 * n;
          return (
            <Box
              key={`${slide.key}-${j}`}
              component="a"
              href={isClone ? undefined : slide.href}
              draggable={false}
              aria-hidden={isClone || undefined}
              tabIndex={isClone ? -1 : undefined}
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => {
                if (isClone) {
                  e.preventDefault();
                  return;
                }
                if (j !== pos) {
                  e.preventDefault();
                  shift(j - pos);
                }
              }}
              sx={{
                width: CARD_W,
                height: CARD_H,
                flexShrink: 0,
                borderRadius: "16px",
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
                bgcolor: "#5A0F32",
                border: "1px solid",
                borderColor: isActive
                  ? "rgba(255, 215, 122, 0.9)"
                  : "rgba(255, 214, 128, 0.3)",
                boxShadow: isActive
                  ? "0 0 0 1px rgba(255, 215, 122, 0.35), 0 8px 28px rgba(255, 168, 56, 0.35)"
                  : "0 8px 20px rgba(40, 0, 14, 0.35)",
                opacity: isActive ? 1 : 0.72,
                transform: isActive ? "scale(1.06)" : "scale(0.88)",
                transition: transition(
                  "transform 600ms, opacity 600ms, border-color 600ms, box-shadow 600ms",
                ),
                // Let the root own the gesture; links were stealing the swipe.
                pointerEvents: dragging ? "none" : "auto",
              }}
            >
              <Box
                sx={{ position: "relative", width: CARD_W, height: IMAGE_H }}
              >
                {slide.src ? (
                  <Image
                    src={slide.src}
                    alt=""
                    width={CARD_W * 2}
                    height={IMAGE_H * 2}
                    sizes="50vw"
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      pointerEvents: "none",
                    }}
                  />
                ) : null}
                {slide.isVideo ? (
                  <Box
                    aria-hidden
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "rgba(42, 9, 24, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        component="svg"
                        viewBox="0 0 24 24"
                        sx={{ width: 16, height: 16, ml: "2px" }}
                      >
                        <path d="M8 5v14l11-7z" fill="#FFFFFF" />
                      </Box>
                    </Box>
                  </Box>
                ) : null}
              </Box>
              <Box
                sx={{
                  px: "12px",
                  pt: "10px",
                  pb: "14px",
                  minHeight: FOOTER_H,
                  height: FOOTER_H,
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  background:
                    "linear-gradient(180deg, #8A1848 0%, #5A0F32 100%)",
                  borderTop: "1px solid rgba(255, 214, 128, 0.35)",
                }}
              >
                <Typography
                  sx={{
                    ...barlow,
                    m: 0,
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#FFD77A",
                  }}
                >
                  {slide.category}
                </Typography>
                <Typography
                  sx={{
                    ...barlow,
                    m: 0,
                    mt: "3px",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: "120%",
                    color: "#FFFFFF",
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  sx={{
                    ...barlow,
                    m: 0,
                    mt: "auto",
                    pt: "6px",
                    fontWeight: 500,
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.75)",
                  }}
                >
                  View Details ↗
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
