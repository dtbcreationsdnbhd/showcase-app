/** Mobile stage: the Figma mobile frame is iPhone 16 Pro Max (440 x 956). */
export const MOBILE_DESIGN_WIDTH = 440;
export const MOBILE_DESIGN_HEIGHT = 956;

/** Below this the mobile tree renders; at or above it the 1920 desktop stage does. */
export const MOBILE_BREAKPOINT = 768;
export const MOBILE_ONLY = `@media (max-width: ${MOBILE_BREAKPOINT - 1}px)`;
export const DESKTOP_ONLY = `@media (min-width: ${MOBILE_BREAKPOINT}px)`;

/**
 * `zoom`, not `transform: scale` — a zoomed stage still contributes its height
 * to layout, so the mobile tree needs none of the total-height bookkeeping that
 * `landingFrameHeightCss()` does for the desktop stage.
 */
export const MOBILE_STAGE_ZOOM = `calc(100vw / ${MOBILE_DESIGN_WIDTH}px)`;

/**
 * Stage px for one full viewport: after the zoom it reads as 100dvh. `dvh`, not
 * `vh`, so the menu doesn't jump when mobile Safari's address bar collapses.
 */
export const MOBILE_VIEWPORT_HEIGHT_CSS = `calc(${MOBILE_DESIGN_WIDTH}px * 100dvh / 100vw)`;

/**
 * Both trees are in the DOM, so the desktop one keeps the bare hash ids and the
 * mobile one needs its own — duplicate ids would send `#top` to a hidden node.
 */
export function mobileAnchorId(name: string): string {
  return `m-${name}`;
}

export const MOBILE_NAV_HEIGHT = 100;
/** Hero fills one frame; the photo is a portrait crop, not the desktop 1440x900. */
export const MOBILE_HERO_HEIGHT = MOBILE_DESIGN_HEIGHT;
/** Fade from the hero photo into the section below it. */
export const MOBILE_HERO_BOTTOM_FADE = 120;
