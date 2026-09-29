import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";

import AuthNoticeBanner from "@/components/AuthNoticeBanner";
import ContentFrame from "@/components/office/ContentFrame";
import InquiriesTable from "@/components/office/InquiriesTable";
import InquiryPagination from "@/components/office/InquiryPagination";
import InquirySearch from "@/components/office/InquirySearch";
import {
  INQUIRY_BUDGETS,
  INQUIRY_CYCLES,
  INQUIRY_PAGE_SIZE,
  INQUIRY_SERVICES,
  INQUIRY_SOURCES,
  inquiryPageHref,
  isPageSize,
  listInquiries,
  type InquiryQuery,
} from "@/lib/inquiries";
import { noticeFromParam } from "@/lib/notices";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    source?: string;
    service?: string;
    budget?: string;
    cycle?: string;
    size?: string;
    notice?: string;
  }>;
}) {
  const params = await searchParams;
  const filters = filtersFromParams(params);
  const requestedPage = pageFromParam(params.page);
  const pageSize = pageSizeFromParam(params.size);
  const result = await listInquiries({
    filters,
    page: requestedPage,
    pageSize,
  });

  if (result.ok && result.page !== requestedPage) {
    redirect(inquiryPageHref(result.page, filters, result.pageSize));
  }

  const filtering = Boolean(
    filters.query ||
      filters.source ||
      filters.service ||
      filters.budget ||
      filters.cycle,
  );

  return (
    <ContentFrame
      flush
      header={<InquirySearch filters={filters} pageSize={pageSize} />}
      footer={
        result.ok ? (
          <InquiryPagination
            page={result.page}
            pageSize={result.pageSize}
            total={result.total}
            filters={filters}
          />
        ) : null
      }
    >
      <AuthNoticeBanner notice={noticeFromParam(params.notice)} />
      {result.ok ? (
        <InquiriesTable
          rows={result.rows}
          start={(result.page - 1) * result.pageSize + 1}
          emptyLabel={
            filtering ? "No matching submissions." : "No form submissions yet."
          }
        />
      ) : (
        <Typography variant="body2" color="error" role="alert">
          {result.message}
        </Typography>
      )}
    </ContentFrame>
  );
}

function filtersFromParams(params: {
  q?: string;
  source?: string;
  service?: string;
  budget?: string;
  cycle?: string;
}): InquiryQuery {
  const source = params.source ?? "";
  const service = params.service ?? "";
  const budget = params.budget ?? "";
  const cycle = params.cycle ?? "";

  return {
    query: params.q?.trim() ?? "",
    source: INQUIRY_SOURCES.some((item) => item === source) ? source : "",
    service: INQUIRY_SERVICES.some((item) => item === service) ? service : "",
    budget: INQUIRY_BUDGETS.some((item) => item === budget) ? budget : "",
    cycle: INQUIRY_CYCLES.some((item) => item === cycle) ? cycle : "",
  };
}

function pageFromParam(value: string | undefined) {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return 1;
  return page;
}

function pageSizeFromParam(value: string | undefined) {
  const size = Number(value);
  if (isPageSize(size)) return size;
  return INQUIRY_PAGE_SIZE;
}
