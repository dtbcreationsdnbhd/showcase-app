import Link from "next/link";

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
  if (total === 0) return null;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#F0EDF7] px-6 py-4 text-sm"
    >
      <div className="flex items-center gap-3">
        <p className="text-[#6B6578]">
          {start}–{end} of {total}
        </p>
        <div className="flex items-center gap-1" aria-label="Rows per page">
          {INQUIRY_PAGE_SIZES.map((size) => {
            const current = size === pageSize;
            return (
              <Link
                key={size}
                href={inquiryPageHref(1, filters, size)}
                aria-label={`${size} rows per page`}
                aria-current={current ? "true" : undefined}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 ${
                  current
                    ? "bg-[#7B61FF] text-white"
                    : "text-[#2A2A2A] hover:bg-[#F4F1FB]"
                }`}
              >
                {size}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <PageLink
          href={inquiryPageHref(page - 1, filters, pageSize)}
          label="Previous page"
          disabled={page <= 1}
        >
          Prev
        </PageLink>
        {pageNumbers(page, pageCount).map((number) => {
          const current = number === page;
          return (
            <Link
              key={number}
              href={inquiryPageHref(number, filters, pageSize)}
              aria-label={`Page ${number}`}
              aria-current={current ? "page" : undefined}
              className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 ${
                current
                  ? "bg-[#7B61FF] text-white"
                  : "text-[#2A2A2A] hover:bg-[#F4F1FB]"
              }`}
            >
              {number}
            </Link>
          );
        })}
        <PageLink
          href={inquiryPageHref(page + 1, filters, pageSize)}
          label="Next page"
          disabled={page >= pageCount}
        >
          Next
        </PageLink>
      </div>
    </nav>
  );
}

function pageNumbers(page: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

function PageLink({
  href,
  label,
  disabled,
  children,
}: {
  href: string;
  label: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="flex h-8 items-center rounded-full px-3 text-[#B7B2C2]"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-8 items-center rounded-full px-3 text-[#2A2A2A] hover:bg-[#F4F1FB]"
    >
      {children}
    </Link>
  );
}
