export const PROJECT_PAGE_SIZES = [10, 20, 50] as const;

export const PROJECT_PAGE_SIZE = PROJECT_PAGE_SIZES[0];

export function projectPageHref(
  page: number,
  query: string,
  pageSize: number = PROJECT_PAGE_SIZE,
) {
  const params = new URLSearchParams();
  const trimmed = query.trim();
  if (trimmed) params.set("q", trimmed);
  if (page > 1) params.set("page", String(page));
  if (isPageSize(pageSize) && pageSize !== PROJECT_PAGE_SIZE) {
    params.set("size", String(pageSize));
  }
  const search = params.toString();
  return search ? `/projects?${search}` : "/projects";
}

export function isPageSize(
  value: number,
): value is (typeof PROJECT_PAGE_SIZES)[number] {
  return PROJECT_PAGE_SIZES.some((item) => item === value);
}
