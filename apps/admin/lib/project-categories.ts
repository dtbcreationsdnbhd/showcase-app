/** Top-level showcase categories (admin select + stored slug). */
export const PROJECT_CATEGORIES = [
  {
    value: "digital_tools",
    label: "Digital Tools",
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

export function isProjectCategory(value: string): value is ProjectCategory {
  return CATEGORY_VALUES.has(value);
}

export function projectCategoryLabel(value: string): string {
  return (
    PROJECT_CATEGORIES.find((item) => item.value === value)?.label ?? value
  );
}
