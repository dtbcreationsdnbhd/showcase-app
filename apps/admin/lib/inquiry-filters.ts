export const INQUIRY_PAGE_SIZES = [10, 20, 50] as const;

export const INQUIRY_PAGE_SIZE = INQUIRY_PAGE_SIZES[0];

export const INQUIRY_SOURCES = ["web", "mobile"] as const;

export const INQUIRY_SERVICES = [
  "Branding Design",
  "Design System",
  "Product Design",
  "Website Design",
  "Other Services",
] as const;

export const INQUIRY_BUDGETS = [
  "$10.000 - $20.000",
  "$20.000 - $50.000",
  "$50.000 - $100.000",
  "> $100.000",
] as const;

export const INQUIRY_CYCLES = [
  "2-3 Months",
  "6-12 Months",
  "Ongoing Work",
  "Other",
] as const;

export type InquiryQuery = {
  query: string;
  source: string;
  service: string;
  budget: string;
  cycle: string;
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
  if (isService(filters.service)) params.set("service", filters.service);
  if (isBudget(filters.budget)) params.set("budget", filters.budget);
  if (isCycle(filters.cycle)) params.set("cycle", filters.cycle);
  if (page > 1) params.set("page", String(page));
  if (isPageSize(pageSize) && pageSize !== INQUIRY_PAGE_SIZE) {
    params.set("size", String(pageSize));
  }
  const search = params.toString();
  return search ? `/inquiries?${search}` : "/inquiries";
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

export function isService(value: string) {
  return INQUIRY_SERVICES.some((item) => item === value);
}

export function isBudget(value: string) {
  return INQUIRY_BUDGETS.some((item) => item === value);
}

export function isCycle(value: string) {
  return INQUIRY_CYCLES.some((item) => item === value);
}
