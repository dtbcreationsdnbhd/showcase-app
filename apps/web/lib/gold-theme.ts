/** Shared luxe look: metallic gold accents and glossy glass panels on the crimson backdrop. */

export const GOLD_INK = "#4A0A1E";

export const GOLD_FILL =
  "linear-gradient(180deg, #FFF3C4 0%, #FFD866 34%, #F6AE2D 68%, #D27F1C 100%)";

export const GOLD_TEXT =
  "linear-gradient(180deg, #FFF8E1 0%, #FFE08A 40%, #F8B33A 72%, #E8891C 100%)";

/** Flat-ish gold for small dots, bars and 1px rims where a vertical sheen would vanish. */
export const GOLD_SOLID = "linear-gradient(90deg, #FFE08A 0%, #F6AE2D 100%)";

export const GOLD_RIM = "rgba(255, 214, 128, 0.7)";

export const GOLD_TEXT_GLOW = "drop-shadow(0 0 18px rgba(255, 184, 72, 0.45))";

export const GOLD_BUTTON_SHADOW = [
  "inset 0 1.5px 0 rgba(255, 255, 255, 0.85)",
  "inset 0 -3px 6px rgba(150, 62, 0, 0.35)",
  "0 0 0 1.5px #FFE7A3",
  "0 0 0 3px rgba(255, 196, 92, 0.35)",
  "0 6px 26px rgba(255, 168, 56, 0.55)",
].join(", ");

export const GOLD_BUTTON_SHADOW_SM = [
  "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
  "inset 0 -2px 4px rgba(150, 62, 0, 0.3)",
  "0 0 0 1px #FFE7A3",
  "0 3px 14px rgba(255, 168, 56, 0.5)",
].join(", ");

export const GLASS_BG =
  "linear-gradient(160deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 110, 165, 0.08) 55%, rgba(255, 190, 110, 0.07) 100%)";

export const GLASS_SHADOW = [
  "inset 0 1px 0 rgba(255, 255, 255, 0.28)",
  "0 10px 36px rgba(48, 0, 18, 0.35)",
  "0 0 26px rgba(255, 176, 72, 0.14)",
].join(", ");

export const goldTextSx = {
  backgroundImage: GOLD_TEXT,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  filter: GOLD_TEXT_GLOW,
} as const;

export const goldButtonSx = {
  background: GOLD_FILL,
  boxShadow: GOLD_BUTTON_SHADOW,
  color: GOLD_INK,
} as const;

export const glassPanelSx = {
  background: GLASS_BG,
  border: `1px solid ${GOLD_RIM}`,
  boxShadow: GLASS_SHADOW,
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
} as const;
