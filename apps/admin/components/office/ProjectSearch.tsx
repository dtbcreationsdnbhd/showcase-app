"use client";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

import { useInquiryPending } from "@/components/office/InquiryPending";
import { projectPageHref } from "@/lib/project-filters";
import { cornerRadius } from "@/lib/ui";

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

export default function ProjectSearch({
  query,
  pageSize,
}: {
  query: string;
  pageSize: number;
}) {
  const { replace } = useInquiryPending();
  const [value, setValue] = useState(query);
  const [previousQuery, setPreviousQuery] = useState(query);

  if (query !== previousQuery) {
    setPreviousQuery(query);
    if (query !== value.trim()) setValue(query);
  }

  useEffect(() => {
    const next = value.trim();
    if (next === query) return;

    const timer = window.setTimeout(() => {
      replace(projectPageHref(1, next, pageSize));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [pageSize, query, replace, value]);

  const filtering = Boolean(value.trim());

  function resetFilters() {
    setValue("");
    replace(projectPageHref(1, "", pageSize));
  }

  return (
    <Box
      component="form"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        replace(projectPageHref(1, value.trim(), pageSize));
      }}
      sx={{
        mt: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
      }}
    >
      <TextField
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search"
        aria-label="Search projects"
        hiddenLabel
        sx={{
          width: "100%",
          maxWidth: 420,
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
      <IconButton
        type="button"
        aria-label="Reset filters"
        disabled={!filtering}
        onClick={resetFilters}
        sx={{
          width: 44,
          height: 44,
          color: "#6B6578",
          "&.Mui-disabled": { color: "#C4BFCE" },
        }}
      >
        <RestartAltIcon />
      </IconButton>
    </Box>
  );
}
