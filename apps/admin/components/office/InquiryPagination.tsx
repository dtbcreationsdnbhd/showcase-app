"use client";

import TablePagination from "@mui/material/TablePagination";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  if (total === 0) return null;

  return (
    <TablePagination
      component="div"
      count={total}
      page={page - 1}
      onPageChange={(_, nextPage) => {
        router.push(inquiryPageHref(nextPage + 1, filters, pageSize));
      }}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(event) => {
        router.push(inquiryPageHref(1, filters, Number(event.target.value)));
      }}
      rowsPerPageOptions={[...INQUIRY_PAGE_SIZES]}
      sx={{ px: 4 }}
    />
  );
}
