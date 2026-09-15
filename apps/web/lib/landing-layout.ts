/** 1920-wide stage the landing scales from. Add a section's height here when it lands. */
export const LANDING_DESIGN_WIDTH = 1920;
export const FIGMA_FRAME_WIDTH = 1440;

/** Figma desktop frame is 1440; map those px onto the 1920 stage. */
export function figmaPx(px: number): number {
  return (px * LANDING_DESIGN_WIDTH) / FIGMA_FRAME_WIDTH;
}

export const HERO_DESIGN_HEIGHT = 1200;
export const SOLUTIONS_INTRO_HEIGHT = figmaPx(418);
/** 4 rows of 370 + 3 gaps of 50, plus a little air before How We Work. */
export const SOLUTIONS_ROWS_HEIGHT = figmaPx(4 * 370 + 3 * 50 + 64);
export const PROCESS_INTRO_HEIGHT = figmaPx(144);
export const PROCESS_STEPS_HEIGHT = figmaPx(1172);
/** Tighter join into Project Showcase than the original 90 top padding. */
export const SHOWCASE_PAD_TOP = figmaPx(80);
export const SHOWCASE_PAD_BOTTOM = figmaPx(90);
/** padding + header 70 + gap 50 + cards 414.75 */
export const SHOWCASE_HEIGHT =
  SHOWCASE_PAD_TOP + figmaPx(70 + 50 + 414.75) + SHOWCASE_PAD_BOTTOM;
/** Short fade from the hero photo into the solutions background. */
export const HERO_BOTTOM_FADE = figmaPx(110);

export const LANDING_DESIGN_HEIGHT =
  HERO_DESIGN_HEIGHT +
  SOLUTIONS_INTRO_HEIGHT +
  SOLUTIONS_ROWS_HEIGHT +
  PROCESS_INTRO_HEIGHT +
  PROCESS_STEPS_HEIGHT +
  SHOWCASE_HEIGHT;
