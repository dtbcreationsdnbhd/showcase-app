/** Top-level showcase categories (matches admin + DB slug). */
export const PROJECT_CATEGORIES = [
  {
    value: "digital_tools",
    label: "Digital Tools",
  },
  {
    value: "service",
    label: "Service",
  },
  {
    value: "website_designs",
    label: "Website Designs",
  },
  {
    value: "platform_creation",
    label: "Platform Creation",
  },
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]["value"];

const CATEGORY_VALUES = new Set<string>(
  PROJECT_CATEGORIES.map((item) => item.value),
);

/** Prefer one project from each category for the hero carousel. */
export const HERO_CATEGORY_ORDER = PROJECT_CATEGORIES.map(
  (item) => item.value,
) as readonly ProjectCategory[];

export function isProjectCategory(value: string): value is ProjectCategory {
  return CATEGORY_VALUES.has(value);
}

const CATEGORY_ZH: Record<ProjectCategory, string> = {
  digital_tools: "数字化工具",
  service: "服务",
  website_designs: "网站设计",
  platform_creation: "平台搭建",
};

export function projectCategoryLabel(value: string, locale: "en" | "zh" = "en"): string {
  const item = PROJECT_CATEGORIES.find((entry) => entry.value === value);
  if (!item) return value;
  return locale === "zh" ? CATEGORY_ZH[item.value] : item.label;
}
