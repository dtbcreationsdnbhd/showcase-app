export const INQUIRY_PAGE_SIZES = [10, 20, 50] as const;

export const INQUIRY_PAGE_SIZE = INQUIRY_PAGE_SIZES[0];

export const INQUIRY_SOURCES = ["web", "mobile"] as const;

export type InquiryQuery = {
  query: string;
  source: string;
};

export function inquiryPageHref(
  page: number,
  filters: InquiryQuery,
  pageSize: number = INQUIRY_PAGE_SIZE,
) {
  const params = new URLSearchParams();
  const trimmed = filters.query.trim();
  if (trimmed) params.set("q", trimmed);
  if (isSource(filters.source)) params.set("source", filters.source);
  if (page > 1) params.set("page", String(page));
  if (isPageSize(pageSize) && pageSize !== INQUIRY_PAGE_SIZE) {
    params.set("size", String(pageSize));
  }
  const search = params.toString();
  return search ? `/?${search}` : "/";
}

export function isPageSize(
  value: number,
): value is (typeof INQUIRY_PAGE_SIZES)[number] {
  return INQUIRY_PAGE_SIZES.some((item) => item === value);
}

export function isSource(
  value: string,
): value is (typeof INQUIRY_SOURCES)[number] {
  return INQUIRY_SOURCES.some((item) => item === value);
}
