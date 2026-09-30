"use client";

import TablePagination from "@mui/material/TablePagination";

import { useInquiryPending } from "@/components/office/InquiryPending";
import {
  PROJECT_PAGE_SIZES,
  projectPageHref,
} from "@/lib/project-filters";

export default function ProjectPagination({
  page,
  pageSize,
  total,
  query,
}: {
  page: number;
  pageSize: number;
  total: number;
  query: string;
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
        push(projectPageHref(nextPage + 1, query, pageSize));
      }}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(event) => {
        if (pending) return;
        push(projectPageHref(1, query, Number(event.target.value)));
      }}
      rowsPerPageOptions={[...PROJECT_PAGE_SIZES]}
      sx={{ px: 4 }}
    />
  );
}
