"use client";

import { useEffect, useRef } from "react";
import { figmaPx } from "@/lib/landing-layout";

const DOT = figmaPx(12);
const VIEW = figmaPx(88);
const VIEW_FONT = figmaPx(12);
const NEXT = figmaPx(64);
const NEXT_FONT = figmaPx(16);
/** Lower = more lag. Position chase. */
const FOLLOW = 3.5;
/** How fast the purple dot grows into the View Project circle. */
const MORPH = 1.7;

export default function SiteCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let blend = 0;
    let blendTarget = 0;
    let activeLabel = "";
    let visible = false;
    let raf = 0;
    let last = 0;

    const paint = () => {
      const grown = activeLabel === "Next" ? NEXT : VIEW;
      const font = activeLabel === "Next" ? NEXT_FONT : VIEW_FONT;
      const size = DOT + (grown - DOT) * blend;
      const r = Math.round(204 + (255 - 204) * blend);
      const g = Math.round(53 + (255 - 53) * blend);
      const b = Math.round(204 + (255 - 204) * blend);
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      dot.style.setProperty("--cursor-size", String(size));
      dot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      label.style.setProperty("--cursor-label", String(font));
      label.style.opacity = String(Math.min(1, Math.max(0, (blend - 0.72) / 0.28)));
    };

    const settle = () => {
      x = targetX;
      y = targetY;
      blend = blendTarget;
      paint();
      raf = 0;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const follow = reduced.matches ? 1 : 1 - Math.exp(-FOLLOW * dt);
      const morph = reduced.matches ? 1 : 1 - Math.exp(-MORPH * dt);
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      blend += (blendTarget - blend) * morph;
      paint();
      const moving = Math.hypot(targetX - x, targetY - y) > 0.4;
      const morphing = Math.abs(blendTarget - blend) > 0.004;
      if (moving || morphing) {
        raf = requestAnimationFrame(tick);
        return;
      }
      settle();
    };

    const kick = () => {
      if (raf) {
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const place = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      const hit = event.target instanceof Element ? event.target : null;
      const card = hit?.closest("[data-cursor-label]");
      const nextLabel = card?.getAttribute("data-cursor-label") ?? "";
      blendTarget = nextLabel ? 1 : 0;
      if (nextLabel) {
        activeLabel = nextLabel;
        label.textContent = nextLabel;
      }
      if (!visible) {
        x = targetX;
        y = targetY;
        visible = true;
        dot.style.opacity = "1";
        paint();
        if (blendTarget !== blend) {
          kick();
        }
        return;
      }
      kick();
    };

    const hide = () => {
      visible = false;
      blend = 0;
      blendTarget = 0;
      dot.style.opacity = "0";
      paint();
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const spring = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType === "touch") {
        return;
      }
      const from = event.target instanceof Element ? event.target : null;
      const el = from?.closest(".hover-grow, .hover-grow-lg, .hover-grow-sm");
      if (!(el instanceof HTMLElement)) {
        return;
      }
      const next = event.relatedTarget;
      if (next instanceof Node && el.contains(next)) {
        return;
      }
      el.classList.remove("is-spring");
      void el.offsetWidth;
      el.classList.add("is-spring");
    };

    const springDone = (event: AnimationEvent) => {
      if (event.animationName !== "hover-spring") {
        return;
      }
      const el = event.target;
      if (el instanceof Element) {
        el.classList.remove("is-spring");
      }
    };

    window.addEventListener("pointermove", place);
    document.addEventListener("pointerout", spring);
    document.addEventListener("animationend", springDone);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
      window.removeEventListener("pointermove", place);
      document.removeEventListener("pointerout", spring);
      document.removeEventListener("animationend", springDone);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="site-cursor"
      style={{ ["--cursor-size" as string]: DOT }}
    >
      <span
        ref={labelRef}
        className="site-cursor-label"
        style={{ ["--cursor-label" as string]: figmaPx(12) }}
      >
        Next
      </span>
    </div>
  );
}
