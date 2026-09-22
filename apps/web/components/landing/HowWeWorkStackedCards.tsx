"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LANDING_DESIGN_WIDTH,
  PROCESS_ANIM_TRAVEL,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
  figmaPx,
} from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = figmaPx(500);
const CARD_H = figmaPx(257);
const NOTCH_W = figmaPx(137);
const NOTCH_H = figmaPx(139);
const CARD_R = figmaPx(30);
/** Match reference xp__plate: rotateX(56deg) lying stack. */
const LAY_RX = 56;
/** Closed pile — only plate edges show. */
const STACK_Y = figmaPx(8);
const STACK_Z = figmaPx(20);
/** Opened column — slight peel only; keep overlap, don’t open wide. */
const COLUMN_Y = figmaPx(66);
const COLUMN_Z = figmaPx(24);
/** Focused step: photo left + copy right — keep the pair near viewport center. */
const FOCUS_SCALE = 0.78;
const FOCUS_Y = figmaPx(28);
const PHOTO_X = -figmaPx(180);
const COPY_LEFT = figmaPx(60);
const COPY_WIDTH = figmaPx(340);
/** Waiting deck under the focus — tighter under the active pair. */
const WAIT_BASE_Y = FOCUS_Y + figmaPx(200);
/** Done deck above the focus — leave air above the active pair. */
const DONE_BASE_Y = FOCUS_Y - figmaPx(250);
/** Upper done pile — same lying pitch as the open column. */
const DONE_RX = LAY_RX + 6;
/** Lower wait pile — steeper so the under-stack reads more tilted. */
const WAIT_RX = LAY_RX + 16;
/** Same pitch spacing for upper + lower stacks so titles don’t glue together. */
const WAIT_Y = figmaPx(24);
const WAIT_Z = figmaPx(20);
const WAIT_SCALE = FOCUS_SCALE * 0.88;
const WAIT_X = 0;
/** Matched open/close share of the scroll track — a bit longer so ends don’t feel rushed. */
const EDGE = 0.15;

function cardClipPath(): string {
  const w = CARD_W;
  const h = CARD_H;
  const nx = NOTCH_W;
  const ny = NOTCH_H;
  const r = CARD_R;
  return `path("M ${nx} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${ny + r} A ${r} ${r} 0 0 1 ${r} ${ny} H ${nx - r} A ${r} ${r} 0 0 0 ${nx} ${ny - r} V 0 Z")`;
}

export type ProcessStepView = {
  n: string;
  title: string;
  description: string;
  src: string | null;
};

function clamp01(x: number): number {
  return Math.min(Math.max(x, 0), 1);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Near-linear scrub — motion tracks the wheel 1:1 (silky); light S only softens ends. */
function scrub(t: number): number {
  const x = clamp01(t);
  const s = x * x * (3 - 2 * x);
  return x * 0.72 + s * 0.28;
}

/** Softer S for intro/outro — calmer start & settle than scrub. */
function edgeEase(t: number): number {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function eased(t: number): number {
  return scrub(t);
}

function rangeProgress(value: number, start: number, end: number): number {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function ProcessCard({
  src,
  title,
  style,
}: {
  src: string | null;
  title: string;
  style: React.CSSProperties;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        left: "50%",
        top: "50%",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
      style={style}
    >
      {src ? (
        <Image
          src={src}
          alt={title}
          width={500}
          height={257}
          sizes={`${CARD_W}px`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "#0C1622",
            clipPath: cardClipPath(),
          }}
        />
      )}
    </Box>
  );
}

function CardStage({
  cardStyles,
  copyText,
  copyOpacity,
  copyOffsetX,
  stackShadow,
}: {
  cardStyles: {
    key: string;
    src: string | null;
    title: string;
    style: React.CSSProperties;
  }[];
  copyText: string;
  copyOpacity: number;
  /** px: negative = from photo, positive = exit to the right. */
  copyOffsetX: number;
  stackShadow: number;
}) {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: figmaPx(1100),
          height: figmaPx(720),
          ml: `${-figmaPx(1100) / 2}px`,
          mt: `${-figmaPx(720) / 2}px`,
          perspective: `${figmaPx(1600)}px`,
          perspectiveOrigin: "50% 45%",
          transformStyle: "preserve-3d",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: "50%",
            top: "58%",
            width: figmaPx(420),
            height: figmaPx(70),
            ml: `${-figmaPx(420) / 2}px`,
            borderRadius: "50%",
            bgcolor: "transparent",
            boxShadow: `0 ${figmaPx(24)}px ${figmaPx(40)}px ${figmaPx(8)}px rgba(0,0,0,0.55)`,
            opacity: 0.85 * stackShadow,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {cardStyles.map((card) => (
          <ProcessCard
            key={card.key}
            src={card.src}
            title={card.title}
            style={card.style}
          />
        ))}
      </Box>

      {copyOpacity > 0.01 ? (
        <Typography
          sx={{
            ...barlow,
            position: "absolute",
            left: `calc(50% + ${COPY_LEFT}px)`,
            top: "50%",
            width: COPY_WIDTH,
            m: 0,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: figmaPx(14),
            lineHeight: "175%",
            letterSpacing: "0.02em",
            color: "#FFFFFF",
            opacity: copyOpacity,
            willChange: "transform, opacity",
            transform: `translateY(calc(-50% + ${FOCUS_Y}px)) translateX(${copyOffsetX}px)`,
          }}
        >
          {copyText}
        </Typography>
      ) : null}
    </>
  );
}

/**
 * Cards scroll stage. One continuous fixed pin (Solutions pattern) —
 * no in-flow ↔ fixed handoff, so the title→cards join doesn't flash.
 */
export default function HowWeWorkStackedCards({
  steps,
}: {
  steps: ProcessStepView[];
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const cardCount = steps.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const pin = pinEl;
    if (!track || !pin) return;

    let scrollRaf = 0;
    let chaseRaf = 0;
    let lastTs = 0;
    let targetProgress = 0;
    let displayProgress = 0;
    let lastPublished = -1;

    // One card ≈ this much of total progress (focus band is 1 - 2*EDGE).
    const cardSpan = (1 - 2 * EDGE) / Math.max(cardCount, 1);
    // Cap catch-up so a fling still plays leave→upper pile (≈2.4 cards/sec).
    const maxProgressPerSec = cardSpan * 2.4;

    const publish = (p: number) => {
      if (Math.abs(p - lastPublished) > 0.00015) {
        lastPublished = p;
        setProgress(p);
      }
    };

    const chase = (ts: number) => {
      chaseRaf = 0;
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.048) : 1 / 60;
      lastTs = ts;

      const gap = targetProgress - displayProgress;
      const abs = Math.abs(gap);
      if (abs < 0.00025) {
        displayProgress = targetProgress;
        publish(displayProgress);
        lastTs = 0;
        return;
      }

      // Open/close stay slower on catch-up so the first & last beats aren’t clipped.
      const inEdge =
        displayProgress < EDGE ||
        displayProgress > 1 - EDGE ||
        targetProgress < EDGE ||
        targetProgress > 1 - EDGE;
      const maxStep = maxProgressPerSec * dt * (inEdge ? 0.52 : 1);
      // Slow scroll: gap stays tiny → snap 1:1. Fast fling: speed-cap catch-up.
      if (abs <= maxStep * 1.2) {
        displayProgress = targetProgress;
      } else {
        displayProgress = clamp01(displayProgress + Math.sign(gap) * maxStep);
      }
      publish(displayProgress);
      chaseRaf = requestAnimationFrame(chase);
    };

    const updatePin = () => {
      scrollRaf = 0;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const stageH = vh; // after scale, stage is one viewport tall
      const travel = Math.max(rect.height - stageH, 1);

      // Follow track in → park at top → ride out with track end.
      const startTop = rect.top;
      const endTop = rect.bottom - stageH;
      const parkTop = 0;
      const pinTop = Math.max(startTop, Math.min(parkTop, endTop));

      pin.style.top = `${pinTop}px`;
      pin.style.visibility =
        endTop < -stageH || startTop > vh ? "hidden" : "visible";

      targetProgress = clamp01(-rect.top / travel / PROCESS_ANIM_TRAVEL);

      if (reducedMotion) {
        displayProgress = targetProgress;
        publish(displayProgress);
        return;
      }

      if (!chaseRaf) {
        lastTs = 0;
        chaseRaf = requestAnimationFrame(chase);
      }
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(updatePin);
    };

    updatePin();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (chaseRaf) cancelAnimationFrame(chaseRaf);
    };
  }, [pinEl, cardCount, reducedMotion]);

  // Same scroll share on open/close; softer ease so ends feel less abrupt.
  const spreadT = reducedMotion
    ? 1
    : edgeEase(rangeProgress(progress, 0, EDGE));
  const outroT = reducedMotion
    ? 0
    : edgeEase(rangeProgress(progress, 1 - EDGE, 1));
  const focusSpan = rangeProgress(progress, EDGE, 1 - EDGE);
  // Continuous cursor so leave/enter don't hitch when the integer index flips.
  const cursor = focusSpan * Math.max(cardCount, 1);
  const activeIndex = Math.min(
    Math.max(cardCount - 1, 0),
    Math.max(0, Math.floor(Math.min(cursor, cardCount - 0.001))),
  );
  const local =
    focusSpan >= 0.999 || cardCount <= 1 ? 1 : clamp01(cursor - activeIndex);

  // Motion spans more of each card’s local range so scroll rarely “does nothing”.
  const pickT = reducedMotion ? 1 : scrub(rangeProgress(local, 0, 0.22));
  const slideT = reducedMotion ? 1 : scrub(rangeProgress(local, 0.16, 0.4));
  const copyEnter = reducedMotion
    ? 1
    : scrub(rangeProgress(local, 0.3, 0.52));
  // Only while the new card is still picking — once pick finishes, stop “exiting”
  // so the new copy can actually appear (pickT stays at 1 afterward).
  const copyExitOnSwitch =
    !reducedMotion &&
    activeIndex > 0 &&
    outroT < 0.001 &&
    pickT < 0.55
      ? rangeProgress(pickT, 0, 0.55)
      : 0;
  const copyExitOnOutro =
    !reducedMotion && outroT > 0.001
      ? scrub(rangeProgress(outroT, 0, 0.35))
      : outroT > 0.001
        ? 1
        : 0;

  const exiting = copyExitOnOutro > 0.001 || copyExitOnSwitch > 0.001;
  const exitAmt = Math.max(copyExitOnOutro, copyExitOnSwitch);
  const prevStep = steps[Math.max(activeIndex - 1, 0)];
  const copyText = copyExitOnSwitch > 0.001
    ? (prevStep?.description ?? "")
    : (steps[activeIndex]?.description ?? "");
  const copyOpacity = exiting
    ? 1 - exitAmt
    : focusSpan > 0.001
      ? copyEnter
      : 0;
  const copyOffsetX = exiting
    ? lerp(0, figmaPx(72), exitAmt)
    : lerp(-figmaPx(36), 0, copyEnter);

  const stackShadow = lerp(
    1 - eased(rangeProgress(focusSpan, 0, 0.1)) * 0.9,
    0.85,
    outroT,
  );
  const after = focusSpan;

  const cardStyles = useMemo(() => {
    return steps.map((step, i) => {
      const stackY0 = (i - 1.5) * STACK_Y;
      const stackZ0 = -i * STACK_Z;

      const colY = (i - 1.5) * COLUMN_Y;
      const colZ = -i * COLUMN_Z;

      const openedY = lerp(stackY0, colY, spreadT);
      const openedZ = lerp(stackZ0, colZ, spreadT);
      const openedRx = reducedMotion
        ? 0
        : lerp(LAY_RX, LAY_RX * 0.92, spreadT);

      // Upper done vs lower wait — wait tilts a bit more.
      const doneRx = reducedMotion ? 0 : DONE_RX;
      const waitRx = reducedMotion ? 0 : WAIT_RX;
      const futureOrd = i - activeIndex - 1;
      // Fixed wait slots by card index (same idea as done slots).
      const waitSlot = i - 1;
      const waitY = WAIT_BASE_Y + Math.max(waitSlot, 0) * WAIT_Y;
      const waitZ = -Math.max(waitSlot, 0) * WAIT_Z;

      let x = 0;
      let y = openedY;
      let z = openedZ;
      let rx = openedRx;
      let scale = 1;
      let opacity = 1;

      if (after < 0.001) {
        // unfurl only — still centered stack
      } else if (i < activeIndex) {
        // Done pile ABOVE focus. Continuous leave tied to cursor (no hitch).
        const doneSlot = i;
        const doneY = DONE_BASE_Y + doneSlot * WAIT_Y;
        const doneZ = -doneSlot * WAIT_Z;
        const leave = scrub(clamp01((cursor - (i + 1)) / 0.22));
        const nearest = i === activeIndex - 1;
        x = lerp(PHOTO_X, WAIT_X, leave);
        y = lerp(FOCUS_Y, doneY, leave);
        z = lerp(0, doneZ, leave);
        rx = lerp(0, doneRx, leave);
        scale = lerp(FOCUS_SCALE, WAIT_SCALE, leave);
        opacity = lerp(1, nearest ? 0.95 : 0.88, leave);
      } else if (i === activeIndex) {
        if (activeIndex === 0) {
          // First: straighten in the middle, then slide photo left.
          const liftY = lerp(openedY, FOCUS_Y, pickT);
          const liftZ = lerp(openedZ, figmaPx(20), pickT);
          const liftRx = lerp(openedRx, 0, pickT);
          const liftScale = lerp(1, FOCUS_SCALE, pickT);
          x = lerp(0, PHOTO_X, slideT);
          y = liftY;
          z = lerp(liftZ, 0, slideT);
          rx = liftRx;
          scale = lerp(liftScale, FOCUS_SCALE, slideT);
        } else {
          // Leave from this card’s own wait slot, then focus.
          const fromY = WAIT_BASE_Y + (i - 1) * WAIT_Y;
          const riseY = lerp(fromY, FOCUS_Y, pickT);
          const riseX = lerp(WAIT_X, PHOTO_X, pickT);
          x = lerp(riseX, PHOTO_X, slideT);
          y = riseY;
          z = 0;
          rx = lerp(waitRx, 0, pickT);
          scale = lerp(WAIT_SCALE, FOCUS_SCALE, pickT);
        }
        opacity = 1;
      } else {
        // Lower stack — same pitch as upper, so titles don’t glue into one card.
        const fold = activeIndex === 0 ? pickT : 1;
        const nearest = i === activeIndex + 1;
        x = lerp(0, WAIT_X, fold);
        y = lerp(openedY, waitY, fold);
        z = lerp(openedZ, waitZ, fold);
        rx = lerp(openedRx, waitRx, fold);
        scale = lerp(1, WAIT_SCALE, fold);
        opacity = lerp(1, nearest ? 0.95 : 0.88, fold);
      }

      // Outro: last card stacks UP into the done pile → whole pile drops
      // to page center → collapse to the opening closed stack.
      if (outroT > 0.001) {
        // Soft overlapped phases; close gets a longer tail so the end isn’t snappy.
        const stackUp = scrub(rangeProgress(outroT, 0, 0.34));
        const toCenter = scrub(rangeProgress(outroT, 0.24, 0.6));
        const close = scrub(rangeProgress(outroT, 0.48, 1));

        const doneSlot = i;
        const doneY = DONE_BASE_Y + doneSlot * WAIT_Y;
        const doneZ = -doneSlot * WAIT_Z;
        const nearestDone = i === cardCount - 1;

        // 1) Last focus joins the upper pile; others already there stay.
        const p1x = lerp(x, WAIT_X, stackUp);
        const p1y = lerp(y, doneY, stackUp);
        const p1z = lerp(z, doneZ, stackUp);
        const p1rx = lerp(rx, doneRx, stackUp);
        const p1scale = lerp(scale, WAIT_SCALE, stackUp);
        const p1opacity = lerp(opacity, nearestDone ? 0.95 : 0.88, stackUp);

        // 2) Whole upper group moves down to page center (column).
        const p2x = lerp(p1x, 0, toCenter);
        const p2y = lerp(p1y, colY, toCenter);
        const p2z = lerp(p1z, colZ, toCenter);
        const p2rx = lerp(p1rx, LAY_RX * 0.92, toCenter);
        const p2scale = lerp(p1scale, 1, toCenter);
        const p2opacity = lerp(p1opacity, 1, toCenter);

        // 3) Collapse to the same closed stack as the start.
        x = lerp(p2x, 0, close);
        y = lerp(p2y, stackY0, close);
        z = lerp(p2z, stackZ0, close);
        rx = lerp(p2rx, reducedMotion ? 0 : LAY_RX, close);
        scale = lerp(p2scale, 1, close);
        opacity = p2opacity;
      }

      return {
        key: step.n,
        src: step.src,
        title: step.title,
        style: {
          opacity,
          zIndex:
            i === activeIndex
              ? 30
              : i > activeIndex
                ? 8 - futureOrd
                : 12 - (activeIndex - 1 - i),
          transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) scale(${scale})`,
        } satisfies React.CSSProperties,
      };
    });
  }, [
    activeIndex,
    after,
    cardCount,
    cursor,
    outroT,
    pickT,
    reducedMotion,
    slideT,
    spreadT,
    steps,
  ]);

  return (
    <>
      <Box
        ref={trackRef}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      />
      {mounted
        ? createPortal(
            <div
              ref={(el) => {
                pinRef.current = el;
                setPinEl((prev) => (prev === el ? prev : el));
              }}
              data-process-pin="true"
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 50,
                width: LANDING_DESIGN_WIDTH,
                height: STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
                transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
                transformOrigin: "top left",
                background: "#050B13",
                overflow: "hidden",
                pointerEvents: "none",
                visibility: "hidden",
              }}
            >
              <CardStage
                cardStyles={cardStyles}
                copyText={copyText}
                copyOpacity={copyOpacity}
                copyOffsetX={copyOffsetX}
                stackShadow={stackShadow}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
