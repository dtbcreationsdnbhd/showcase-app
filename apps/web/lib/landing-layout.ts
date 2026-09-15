/** 1920-wide stage the landing scales from. Add a section's height here when it lands. */
export const LANDING_DESIGN_WIDTH = 1920;
export const FIGMA_FRAME_WIDTH = 1440;

/** Figma desktop frame is 1440; map those px onto the 1920 stage. */
export function figmaPx(px: number): number {
  return (px * LANDING_DESIGN_WIDTH) / FIGMA_FRAME_WIDTH;
}

export const HERO_DESIGN_HEIGHT = 1200;
export const SOLUTIONS_INTRO_HEIGHT = figmaPx(418);
export const SOLUTIONS_ROWS_HEIGHT = figmaPx(1960);
/** Short fade from the hero photo into the solutions background. */
export const HERO_BOTTOM_FADE = figmaPx(110);

export const LANDING_DESIGN_HEIGHT =
  HERO_DESIGN_HEIGHT + SOLUTIONS_INTRO_HEIGHT + SOLUTIONS_ROWS_HEIGHT;
