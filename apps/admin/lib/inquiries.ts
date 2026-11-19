import { createClient } from "@/lib/supabase/server";

import {
  INQUIRY_PAGE_SIZE,
  isPageSize,
  isSource,
  type InquiryQuery,
} from "@/lib/inquiry-filters";

export {
  INQUIRY_PAGE_SIZE,
  INQUIRY_SOURCES,
  inquiryPageHref,
  isPageSize,
  type InquiryQuery,
} from "@/lib/inquiry-filters";

type InquiryTable = "staging_inquiries" | "production_inquiries";

export type Inquiry = {
  id: string;
  created_at: string;
  source: "web" | "mobile";
  services: string[];
  budget: string | null;
  project_cycle: string | null;
  full_name: string;
  contact: string | null;
  looking_to_build: string | null;
  project_details: string | null;
  telegram: string | null;
  service: string | null;
  brand_name: string | null;
  region: string | null;
};

export type InquiryList =
  | {
      ok: true;
      rows: Inquiry[];
      total: number;
      page: number;
      pageSize: number;
    }
  | { ok: false; message: string };

function inquiryTable(): InquiryTable {
  const name = process.env.NEXT_PUBLIC_INQUIRY_TABLE;
  if (name === "staging_inquiries" || name === "production_inquiries") {
    return name;
  }

  throw new Error(
    "NEXT_PUBLIC_INQUIRY_TABLE must be staging_inquiries or production_inquiries.",
  );
}

export async function listInquiries({
  filters,
  page,
  pageSize = INQUIRY_PAGE_SIZE,
}: {
  filters: InquiryQuery;
  page: number;
  pageSize?: number;
}): Promise<InquiryList> {
  let table: InquiryTable;
  try {
    table = inquiryTable();
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Missing inquiry table setting.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select(
      "id, created_at, source, services, budget, project_cycle, full_name, contact, looking_to_build, project_details, telegram, service, brand_name, region",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      message: `Could not load form submissions. ${error.message}`,
    };
  }

  const needle = filters.query.trim().toLowerCase();
  const source = isSource(filters.source) ? filters.source : "";
  const matched = ((data ?? []) as Inquiry[]).filter((row) => {
    if (source && row.source !== source) return false;
    if (needle && !inquirySearchText(row).includes(needle)) return false;
    return true;
  });
  const size = isPageSize(pageSize) ? pageSize : INQUIRY_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(matched.length / size));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * size;

  return {
    ok: true,
    rows: matched.slice(start, start + size),
    total: matched.length,
    page: safePage,
    pageSize: size,
  };
}

function inquirySearchText(row: Inquiry) {
  return [
    row.source,
    row.full_name,
    row.contact ?? "",
    row.telegram ?? "",
    row.service ?? "",
    row.brand_name ?? "",
    row.region ?? "",
    Array.isArray(row.services) ? row.services.join(" ") : "",
    row.budget ?? "",
    row.project_cycle ?? "",
    row.looking_to_build ?? "",
    row.project_details ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function formatInquiryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(date);
}
