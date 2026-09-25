"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";
import { COPYRIGHT_TEXT } from "@/lib/landing-content";
import { FOOTER_HEIGHT, figmaPx } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const LETTERS = ["A", "P", "E", "X"] as const;
/** Hidden position, below the footer edge. */
const TRAVEL_EM = 0.95;
/** Same delay both ways. Retract uses the reverse order. */
const SHOW_STAGGER = 0.08;
const STIFFNESS = 460;
const SHOW_DAMPING = 28;
/** Launch speed. The spring carries each letter past the target, then back. */
const SHOW_KICK = 16;
const STEP = 0.008;

/** The pop-in spring, sampled so the retract can play it backwards. */
function buildSpringCurve() {
  const samples = [TRAVEL_EM];
  let y = TRAVEL_EM;
  let velocity = -SHOW_KICK;
  for (let i = 0; i < 160; i++) {
    velocity += (-STIFFNESS * y - SHOW_DAMPING * velocity) * STEP;
    y += velocity * STEP;
    samples.push(y);
    if (i > 8 && Math.abs(y) < 0.004 && Math.abs(velocity) < 0.03) break;
  }
  samples[samples.length - 1] = 0;
  return samples;
}

const SPRING = buildSpringCurve();
const SPRING_END = SPRING.length - 1;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const letters = [
      ...footer.querySelectorAll<HTMLElement>(".footer-apex-letter"),
    ];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      for (const letter of letters) letter.style.transform = "none";
      return;
    }

    const y = letters.map(() => TRAVEL_EM);
    const head = letters.map(() => 0);
    let mode: "hidden" | "shown" = "hidden";
    let open = false;
    let clock = 0;
    let last = 0;
    let frame = 0;

    const paint = () => {
      letters.forEach((letter, index) => {
        letter.style.transform = `translate3d(0, ${y[index]}em, 0)`;
      });
    };

    const step = () => {
      clock += STEP;
      const reverse = mode !== "shown";
      let moving = false;

      letters.forEach((_, index) => {
        const order = reverse ? letters.length - 1 - index : index;
        if (clock < order * SHOW_STAGGER) {
          moving = true;
          return;
        }
        const next = reverse
          ? Math.max(0, head[index] - 1)
          : Math.min(SPRING_END, head[index] + 1);
        if (next !== head[index]) moving = true;
        head[index] = next;
        y[index] = SPRING[head[index]];
      });
      return moving;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : STEP;
      last = now;
      let acc = dt;
      let moving = false;
      let steps = 0;
      while (acc >= STEP && steps < 8) {
        acc -= STEP;
        steps += 1;
        if (step()) moving = true;
      }
      paint();
      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    const play = (next: "hidden" | "shown") => {
      const target = next === "shown" ? SPRING_END : 0;
      const settled = !frame && head.every((value) => value === target);
      if (settled) {
        mode = next;
        return;
      }
      if (next === mode && frame) return;
      mode = next;
      clock = 0;
      last = 0;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const entered = () => {
      const rect = footer.getBoundingClientRect();
      const view = window.innerHeight;
      if (open) {
        // Stay out once the footer has lifted off the bottom, so the retract can finish.
        return rect.bottom < view + 48;
      }
      // Pop again only after the footer is back on the bottom edge.
      return rect.bottom <= view + 4;
    };

    const onScroll = () => {
      const nowOpen = entered();
      if (nowOpen === open) return;
      open = nowOpen;
      play(open ? "shown" : "hidden");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Box
      component="footer"
      ref={footerRef}
      sx={{
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        height: FOOTER_HEIGHT,
        bgcolor: "#120D27",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        className="footer-apex"
        sx={{
          ...barlow,
          position: "absolute",
          width: figmaPx(1086),
          height: figmaPx(500),
          left: figmaPx(177),
          top: figmaPx(35),
          m: 0,
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: figmaPx(375),
          lineHeight: "100%",
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {LETTERS.map((letter) => (
          <Box
            key={letter}
            component="span"
            className="footer-apex-letter"
            data-letter={letter}
          >
            <Box
              component="span"
              className="footer-apex-glyph"
              sx={{
                backgroundImage: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {letter}
            </Box>
          </Box>
        ))}
      </Box>

      <Typography
        sx={{
          ...barlow,
          position: "absolute",
          width: "100%",
          height: figmaPx(26),
          left: 0,
          top: figmaPx(35),
          zIndex: 1,
          m: 0,
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: figmaPx(12),
          lineHeight: "160%",
          textAlign: "center",
          letterSpacing: "0.02em",
          color: "#FFFFFF",
        }}
      >
        {COPYRIGHT_TEXT}
      </Typography>
    </Box>
  );
}
