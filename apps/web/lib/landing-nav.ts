/** Shared by the desktop navbar and the mobile menu so the two can't drift. */
export const NAV_LINKS = [
  { label: "HOME", hash: "#top", center: false },
  { label: "SERVICES", hash: "#services", center: true },
  { label: "HOW WE WORK", hash: "#how-we-work", center: true },
  { label: "PROJECTS", hash: "#projects", center: true },
] as const;

/** True while a navbar/hash scroll is in flight — How We Work scrubs 1:1 (fast-forward). */
let landingNavDepth = 0;

export function isLandingNav(): boolean {
  return landingNavDepth > 0;
}

function releaseLandingNav() {
  landingNavDepth = Math.max(0, landingNavDepth - 1);
  if (landingNavDepth === 0) {
    window.dispatchEvent(new Event("scroll"));
  }
}

/** Smooth-scroll to a hash target. How We Work fast-forwards with the trip. */
export function scrollLandingBy(delta: number): void {
  landingNavDepth += 1;
  window.scrollBy({ top: delta, behavior: "smooth" });
  const onEnd = () => {
    window.removeEventListener("scrollend", onEnd);
    window.clearTimeout(timeout);
    requestAnimationFrame(() => requestAnimationFrame(releaseLandingNav));
  };
  window.addEventListener("scrollend", onEnd);
  const timeout = window.setTimeout(onEnd, 2000);
}
