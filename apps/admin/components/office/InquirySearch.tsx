"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  INQUIRY_BUDGETS,
  INQUIRY_CYCLES,
  INQUIRY_SERVICES,
  INQUIRY_SOURCES,
  inquiryPageHref,
  type InquiryQuery,
} from "@/lib/inquiry-filters";

const sourceOptions = INQUIRY_SOURCES.map((source) => ({
  value: source,
  label: source === "web" ? "Web" : "Mobile",
}));

const serviceOptions = INQUIRY_SERVICES.map((service) => ({
  value: service,
  label: service,
}));

const budgetOptions = INQUIRY_BUDGETS.map((budget) => ({
  value: budget,
  label: budget,
}));

const cycleOptions = INQUIRY_CYCLES.map((cycle) => ({
  value: cycle,
  label: cycle,
}));

export default function InquirySearch({
  filters,
  pageSize,
}: {
  filters: InquiryQuery;
  pageSize: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(filters.query);
  const [previousQuery, setPreviousQuery] = useState(filters.query);
  const [open, setOpen] = useState<
    "source" | "service" | "budget" | "cycle" | null
  >(null);

  if (filters.query !== previousQuery) {
    setPreviousQuery(filters.query);
    if (filters.query !== value.trim()) setValue(filters.query);
  }

  useEffect(() => {
    const next = value.trim();
    if (next === filters.query) return;

    const timer = window.setTimeout(() => {
      router.replace(inquiryPageHref(1, { ...filters, query: next }, pageSize));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [filters, pageSize, router, value]);

  function apply(next: Partial<InquiryQuery>) {
    setOpen(null);
    router.replace(
      inquiryPageHref(
        1,
        {
          ...filters,
          query: value.trim(),
          ...next,
        },
        pageSize,
      ),
    );
  }

  return (
    <section className="shrink-0 rounded-xl bg-white px-6 py-6 shadow-[0_8px_30px_rgba(80,60,140,0.06)]">
      <h2 className="text-2xl font-semibold tracking-tight">Inquiries</h2>
      <form
        role="search"
        className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-5"
        onSubmit={(event) => {
          event.preventDefault();
          apply({ query: value.trim() });
        }}
      >
        <label className="flex h-11 items-center gap-2 rounded-full bg-[#F4F1FB] px-4 text-[#6B6578]">
          <SearchIcon />
          <input
            name="q"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search"
            aria-label="Search form submissions"
            className="w-full bg-transparent text-sm text-[#171717] outline-none placeholder:text-[#8A8498]"
          />
        </label>

        <FilterMenu
          label="Source"
          value={filters.source}
          options={sourceOptions}
          open={open === "source"}
          onToggle={() => setOpen(open === "source" ? null : "source")}
          onClose={() => setOpen(null)}
          onChange={(source) => apply({ source })}
        />
        <FilterMenu
          label="Services"
          value={filters.service}
          options={serviceOptions}
          open={open === "service"}
          onToggle={() => setOpen(open === "service" ? null : "service")}
          onClose={() => setOpen(null)}
          onChange={(service) => apply({ service })}
        />
        <FilterMenu
          label="Budget"
          value={filters.budget}
          options={budgetOptions}
          open={open === "budget"}
          onToggle={() => setOpen(open === "budget" ? null : "budget")}
          onClose={() => setOpen(null)}
          onChange={(budget) => apply({ budget })}
        />
        <FilterMenu
          label="Project cycle"
          value={filters.cycle}
          options={cycleOptions}
          open={open === "cycle"}
          onToggle={() => setOpen(open === "cycle" ? null : "cycle")}
          onClose={() => setOpen(null)}
          onChange={(cycle) => apply({ cycle })}
        />
      </form>
    </section>
  );
}

function FilterMenu({
  label,
  value,
  options,
  open,
  onToggle,
  onClose,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onToggle}
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-full bg-[#F4F1FB] px-4 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B61FF]"
      >
        <span className={selected ? "text-[#171717]" : "text-[#8A8498]"}>
          {selected?.label ?? label}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+8px)] right-0 left-0 z-20 overflow-hidden rounded-2xl bg-white py-1 shadow-[0_12px_32px_rgba(80,60,140,0.16)]"
        >
          <li>
            <MenuOption selected={!value} onClick={() => onChange("")}>
              ALL
            </MenuOption>
          </li>
          {options.map((option) => (
            <li key={option.value}>
              <MenuOption
                selected={option.value === value}
                onClick={() => onChange(option.value)}
              >
                {option.label}
              </MenuOption>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MenuOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={`flex w-full cursor-pointer px-4 py-2.5 text-left text-sm ${
        selected
          ? "bg-[#F4F1FB] font-medium text-[#7B61FF]"
          : "text-[#171717] hover:bg-[#F7F5FB]"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 text-[#6B6578] transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
