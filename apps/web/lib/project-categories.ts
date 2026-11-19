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

export function projectCategoryLabel(value: string): string {
  return (
    PROJECT_CATEGORIES.find((item) => item.value === value)?.label ?? value
  );
}
