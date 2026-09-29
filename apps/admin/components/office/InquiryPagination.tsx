"use client";

import TablePagination from "@mui/material/TablePagination";

import { useInquiryPending } from "@/components/office/InquiryPending";

import {
  INQUIRY_PAGE_SIZES,
  inquiryPageHref,
  type InquiryQuery,
} from "@/lib/inquiry-filters";

export default function InquiryPagination({
  page,
  pageSize,
  total,
  filters,
}: {
  page: number;
  pageSize: number;
  total: number;
  filters: InquiryQuery;
}) {
  const { pending, push } = useInquiryPending();

  if (total === 0) return null;

  return (
    <TablePagination
      component="div"
      count={total}
      page={page - 1}
      onPageChange={(_, nextPage) => {
        if (pending) return;
        push(inquiryPageHref(nextPage + 1, filters, pageSize));
      }}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(event) => {
        if (pending) return;
        push(inquiryPageHref(1, filters, Number(event.target.value)));
      }}
      rowsPerPageOptions={[...INQUIRY_PAGE_SIZES]}
      sx={{ px: 4 }}
    />
  );
}
