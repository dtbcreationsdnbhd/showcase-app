export const FEATURE_ICONS = [
  "search",
  "gear",
  "doc",
  "link",
  "chart",
  "headset",
  "display",
  "image",
  "users",
  "eye",
  "clapper",
  "megaphone",
  "star",
  "video",
  "share",
  "music",
  "waveform",
  "sliders",
  "headphones",
  "layers",
  "pencil",
  "sparkle",
  "camera",
  "robot",
  "chat",
] as const;

export type FeatureIconName = (typeof FEATURE_ICONS)[number];

export type ProjectFeature = {
  label: string;
  icon: FeatureIconName;
};

export const MAX_PROJECT_FEATURES = 6;

export function isFeatureIcon(value: unknown): value is FeatureIconName {
  return (
    typeof value === "string" &&
    (FEATURE_ICONS as readonly string[]).includes(value)
  );
}

export function parseProjectFeatures(value: unknown): ProjectFeature[] {
  if (!Array.isArray(value)) return [];

  const features: ProjectFeature[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as { label?: unknown; icon?: unknown };
    const label = String(record.label ?? "").trim();
    if (!label || !isFeatureIcon(record.icon)) continue;
    features.push({ label, icon: record.icon });
    if (features.length === MAX_PROJECT_FEATURES) break;
  }

  return features;
}
