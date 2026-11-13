"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
  type WheelEvent,
} from "react";
import { flushSync } from "react-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export type HeroSlide = {
  key: string;
  category: string;
  title: string;
  href: string;
  src: string | null;
  isVideo?: boolean;
};

const jakarta = {
  fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
} as const;

const CARD_W = 380;
const IMAGE_H = (CARD_W * 4) / 3;
const CARD_H = 680;
const GAP = 28;
const STEP = CARD_W + GAP;
const INTERVAL_MS = 4000;
const RESUME_AFTER_MS = 6000;
const DRAG_START_PX = 6;
const WHEEL_THRESHOLD = 30;
const WHEEL_COOLDOWN_MS = 600;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length;
  // Three copies of the slides let the track loop: `pos` stays in the middle copy
  // and snaps back there (without animation) whenever it drifts into an outer copy.
  const initialPos = n + Math.min(1, n - 1);
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
  const lastWheel = useRef(0);

  const setPosition = (p: number) => {
    posRef.current = p;
    setPos(p);
  };

  const inMiddle = (p: number) => p >= n && p < 2 * n;
  const toMiddle = (p: number) => n + (((p % n) + n) % n);

  // Rapid swipes can interrupt the transition before `transitionend` fires, so
  // every move re-centres first; otherwise `pos` can walk off the end of the track.
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
    if (n < 2) return;
    const id = setInterval(() => {
      if (document.hidden || (drag.current.id !== -1 && drag.current.moved)) {
        return;
      }
      if (Date.now() - lastInteraction.current < RESUME_AFTER_MS) return;
      moveRef.current(1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [n]);

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
    // The landing stage is CSS-scaled, so convert screen px back to stage px.
    const scale = el ? el.getBoundingClientRect().width / el.offsetWidth : 1;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      dx: 0,
      scale,
      moved: false,
    };
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
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    d.dx = dx;
    setDragX(dx);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    drag.current = { ...d, id: -1 };
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

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaX) < WHEEL_THRESHOLD) return;
    const now = Date.now();
    if (now - lastWheel.current < WHEEL_COOLDOWN_MS) return;
    lastWheel.current = now;
    shift(Math.sign(e.deltaX));
  };

  const track = [...slides, ...slides, ...slides];
  const transition = (props: string) =>
    animate && !dragging ? props : "none";

  return (
    <Box
      ref={rootRef}
      sx={{
        flexGrow: 1,
        minWidth: 0,
        height: 760,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "16px",
        overflow: "hidden",
        pointerEvents: "auto",
        overscrollBehaviorX: "contain",
      }}
    >
      <Box
        ref={trackRef}
        onTransitionEnd={handleTransitionEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onClickCapture={onClickCapture}
        onWheel={onWheel}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: `${GAP}px`,
          height: CARD_H + 30,
          px: "12px",
          transform: `translateX(${-(pos - 1) * STEP + dragX}px)`,
          transition: transition(
            "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          ),
          touchAction: "pan-y",
          userSelect: "none",
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        {track.map((s, j) => {
          const isActive = j === pos;
          const isClone = j < n || j >= 2 * n;
          return (
            <Box
              key={`${s.key}-${j}`}
              aria-hidden={isClone || undefined}
              onClick={() => shift(j - pos)}
              sx={{
                position: "relative",
                flexShrink: 0,
                width: CARD_W,
                height: CARD_H,
                display: "flex",
                flexDirection: "column",
                borderRadius: "24px",
                overflow: "hidden",
                bgcolor: "#5A0F32",
                border: "1px solid",
                borderColor: isActive
                  ? "rgba(255, 215, 122, 0.85)"
                  : "rgba(255, 214, 128, 0.3)",
                boxShadow: isActive
                  ? "0 0 18px rgba(255, 200, 100, 0.45), 0 0 48px rgba(255, 168, 56, 0.3), 0 28px 48px -24px rgba(40, 0, 14, 0.5)"
                  : "0 12px 30px rgba(40, 0, 14, 0.4)",
                transform: isActive ? "scale(1.03)" : "scale(0.9)",
                filter: isActive ? "none" : "brightness(0.7)",
                transition: transition(
                  "transform 600ms, filter 600ms, border-color 600ms, box-shadow 600ms",
                ),
              }}
            >
              <Box sx={{ position: "relative", height: IMAGE_H, flexShrink: 0 }}>
                {s.src ? (
                  <Image
                    src={s.src}
                    alt={s.title}
                    fill
                    draggable={false}
                    loading="eager"
                    sizes={`${CARD_W * 2}px`}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, #4A0F2A 0%, #7A1A2E 100%)",
                    }}
                  />
                )}

                {s.isVideo && (
                  <Box
                    aria-hidden
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 76,
                      height: 76,
                      borderRadius: "50%",
                      bgcolor: "rgba(42, 9, 24, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      fontSize: 26,
                      pl: "4px",
                    }}
                  >
                    ▶
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  p: "20px 26px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  background:
                    "linear-gradient(180deg, #8A1848 0%, #5A0F32 100%)",
                  borderTop: "1px solid rgba(255, 214, 128, 0.45)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.18)",
                }}
              >
                <Typography
                  sx={{
                    ...jakarta,
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#FFD77A",
                  }}
                >
                  {s.category}
                </Typography>
                <Typography
                  sx={{
                    ...jakarta,
                    fontSize: 26,
                    fontWeight: 600,
                    lineHeight: "32px",
                    color: "#FFFFFF",
                  }}
                >
                  {s.title}
                </Typography>
                <Box
                  component="a"
                  href={s.href}
                  draggable={false}
                  tabIndex={isClone ? -1 : undefined}
                  onClick={(e) => e.stopPropagation()}
                  className="hover-grow"
                  sx={{
                    ...jakarta,
                    mt: "auto",
                    alignSelf: "flex-start",
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    textDecoration: "none",
                    "&:hover": { color: "#FFD866" },
                  }}
                >
                  View Details ↗
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
