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

export const FEATURE_ICON_LABELS: Record<FeatureIconName, string> = {
  search: "Search",
  gear: "Gear",
  doc: "Document",
  link: "Link",
  chart: "Chart",
  headset: "Headset",
  display: "Display",
  image: "Image",
  users: "Users",
  eye: "Eye",
  clapper: "Clapper",
  megaphone: "Megaphone",
  star: "Star",
  video: "Video",
  share: "Share",
  music: "Music",
  waveform: "Waveform",
  sliders: "Sliders",
  headphones: "Headphones",
  layers: "Layers",
  pencil: "Pencil",
  sparkle: "Sparkle",
  camera: "Camera",
  robot: "Robot",
  chat: "Chat",
};

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
