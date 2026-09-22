/** 1920-wide stage the landing scales from. Add a section's height here when it lands. */
export const LANDING_DESIGN_WIDTH = 1920;
export const FIGMA_FRAME_WIDTH = 1440;

/** Figma desktop frame is 1440; map those px onto the 1920 stage. */
export function figmaPx(px: number): number {
  return (px * LANDING_DESIGN_WIDTH) / FIGMA_FRAME_WIDTH;
}

export const HERO_DESIGN_HEIGHT = 1200;
/** Title page + AI / web / star / refresh — each one viewport on the scaled stage. */
export const SOLUTIONS_PAGE_COUNT = 5;
export const SOLUTIONS_SERVICE_PAGES = 4;
/**
 * Stage px for one viewport tall page: after `scale(100vw/1920)` it reads as 100vh.
 * Use in CSS height: `calc(${LANDING_DESIGN_WIDTH}px * 100vh / 100vw)`.
 */
export const STAGE_VIEWPORT_PAGE_HEIGHT_CSS = `calc(${LANDING_DESIGN_WIDTH}px * 100vh / 100vw)`;
/** Air after the last service page so the sticky icon can release before How We Work. */
export const SOLUTIONS_RELEASE_HEIGHT = figmaPx(220);
/** @deprecated Prefer STAGE_VIEWPORT_PAGE_HEIGHT_CSS; kept for any static fallback. */
export const SOLUTIONS_INTRO_HEIGHT = figmaPx(418);
/** @deprecated Prefer STAGE_VIEWPORT_PAGE_HEIGHT_CSS * service pages + release. */
export const SOLUTIONS_ROWS_HEIGHT = figmaPx(4 * 370 + 3 * 50 + 220);
export const PROCESS_INTRO_HEIGHT = figmaPx(144);
export const PROCESS_STEPS_HEIGHT = figmaPx(1172);
/** Tighter join into Project Showcase than the original 90 top padding. */
export const SHOWCASE_PAD_TOP = figmaPx(80);
export const SHOWCASE_PAD_BOTTOM = figmaPx(90);
/** padding + header 70 + gap 50 + cards 414.75 */
export const SHOWCASE_HEIGHT =
  SHOWCASE_PAD_TOP + figmaPx(70 + 50 + 414.75) + SHOWCASE_PAD_BOTTOM;
export const CONTACT_CTA_HEIGHT = figmaPx(200);
export const CONTACT_FORM_PAD_TOP = figmaPx(56);
export const CONTACT_FORM_PAD_BOTTOM = figmaPx(80);
export const CONTACT_FORM_HEIGHT =
  figmaPx(587.25) + CONTACT_FORM_PAD_TOP + CONTACT_FORM_PAD_BOTTOM;
/** Short fade from the hero photo into the solutions background. */
export const HERO_BOTTOM_FADE = figmaPx(110);
/**
 * Wave PNG stays black until the purple glow; cover+bottom puts that join
 * through the cards. Hold transparency over the black field, then fade the
 * image in across the glow — same idea as HERO_BOTTOM_FADE, on the photo.
 */
export const CONTACT_WAVE_MASK_HOLD_PCT = 46;
export const CONTACT_WAVE_MASK_FADE = HERO_BOTTOM_FADE * 1.8;
export const FOOTER_HEIGHT = figmaPx(315);
/** Navbar is 102 on the 1920 stage; projects page has no Hero under it. */
export const PROJECTS_PAGE_NAV_HEIGHT = 40;
export const PROJECTS_PAGE_HEIGHT = PROJECTS_PAGE_NAV_HEIGHT + SHOWCASE_HEIGHT;

/** Everything except Targeted Solutions (solutions uses viewport pages). */
export const LANDING_HEIGHT_WITHOUT_SOLUTIONS =
  HERO_DESIGN_HEIGHT +
  PROCESS_INTRO_HEIGHT +
  PROCESS_STEPS_HEIGHT +
  SHOWCASE_HEIGHT +
  CONTACT_CTA_HEIGHT +
  CONTACT_FORM_HEIGHT +
  FOOTER_HEIGHT;

/**
 * Approximate design height assuming a 16:9 viewport for one page.
 * Prefer `landingFrameHeightCss()` for the live scaled frame.
 */
export const LANDING_DESIGN_HEIGHT =
  LANDING_HEIGHT_WITHOUT_SOLUTIONS +
  SOLUTIONS_PAGE_COUNT * (LANDING_DESIGN_WIDTH * (9 / 16)) +
  SOLUTIONS_RELEASE_HEIGHT;

/** Screen-space height of the scaled landing frame (vh pages + fixed stage sections). */
export function landingFrameHeightCss(): string {
  return `calc(100vw * ${LANDING_HEIGHT_WITHOUT_SOLUTIONS + SOLUTIONS_RELEASE_HEIGHT} / ${LANDING_DESIGN_WIDTH} + ${SOLUTIONS_PAGE_COUNT} * 100vh)`;
}
