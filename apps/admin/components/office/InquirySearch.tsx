"use client";

import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  INQUIRY_BUDGETS,
  INQUIRY_CYCLES,
  INQUIRY_SERVICES,
  INQUIRY_SOURCES,
  inquiryPageHref,
  type InquiryQuery,
} from "@/lib/inquiry-filters";
import { cornerRadius } from "@/lib/ui";

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

const controlSx = {
  height: 44,
  borderRadius: cornerRadius,
  bgcolor: "#F4F1FB",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused": {
    outline: "2px solid #7B61FF",
    outlineOffset: 2,
  },
};

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
    <Box component="section">
      <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
        Dashboard
      </Typography>
      <Box
        component="form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          apply({ query: value.trim() });
        }}
        sx={{
          mt: 2.5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr repeat(4, 1fr)" },
          gap: 1.5,
        }}
      >
        <TextField
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search"
          aria-label="Search form submissions"
          hiddenLabel
          sx={{
            "& .MuiOutlinedInput-root": controlSx,
            "& .MuiOutlinedInput-input": {
              fontSize: 14,
              "&::placeholder": { color: "#8A8498", opacity: 1 },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "#6B6578" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <FilterSelect
          label="Source"
          value={filters.source}
          options={sourceOptions}
          onChange={(source) => apply({ source })}
        />
        <FilterSelect
          label="Services"
          value={filters.service}
          options={serviceOptions}
          onChange={(service) => apply({ service })}
        />
        <FilterSelect
          label="Budget"
          value={filters.budget}
          options={budgetOptions}
          onChange={(budget) => apply({ budget })}
        />
        <FilterSelect
          label="Project cycle"
          value={filters.cycle}
          options={cycleOptions}
          onChange={(cycle) => apply({ cycle })}
        />
      </Box>
    </Box>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Select
      displayEmpty
      value={value}
      aria-label={label}
      onChange={(event) => onChange(event.target.value)}
      renderValue={(selected) => {
        const match = options.find((option) => option.value === selected);
        return (
          <Box
            component="span"
            sx={{ color: match ? "text.primary" : "#8A8498", fontSize: 14 }}
          >
            {match?.label ?? label}
          </Box>
        );
      }}
      MenuProps={{
        slotProps: {
          paper: {
            sx: {
              mt: 1,
              borderRadius: cornerRadius,
              boxShadow: "0 12px 32px rgba(80,60,140,0.16)",
            },
          },
        },
      }}
      sx={{
        ...controlSx,
        "& .MuiSelect-icon": { color: "#6B6578" },
        "& .MuiSelect-select": { display: "flex", alignItems: "center" },
      }}
    >
      <MenuItem value="">ALL</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
