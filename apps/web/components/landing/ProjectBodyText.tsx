"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { isRichHtml, sanitizeProjectHtml } from "@/lib/rich-text";

export default function ProjectBodyText({
  value,
  sx,
}: {
  value: string;
  sx?: SxProps<Theme>;
}) {
  if (!value.trim()) {
    return null;
  }

  if (!isRichHtml(value)) {
    return (
      <Typography
        sx={{
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          ...sx,
        }}
      >
        {value}
      </Typography>
    );
  }

  const html = sanitizeProjectHtml(value);

  return (
    <Box
      className="project-body-html"
      sx={{
        overflowWrap: "anywhere",
        minWidth: 0,
        width: "100%",
        "& p": { m: 0, mb: "0.65em" },
        "& p:last-child": { mb: 0 },
        // Tailwind preflight clears list markers — put them back for TipTap HTML.
        "& ul": {
          m: 0,
          mb: "0.65em",
          pl: "1.4em",
          listStyleType: "disc",
          listStylePosition: "outside",
        },
        "& ol": {
          m: 0,
          mb: "0.65em",
          pl: "1.4em",
          listStyleType: "decimal",
          listStylePosition: "outside",
        },
        "& li": { mb: "0.2em", display: "list-item" },
        "& strong, & b": { fontWeight: 700 },
        "& em, & i": { fontStyle: "italic" },
        "& u": { textDecoration: "underline" },
        "& a": { color: "inherit", textDecoration: "underline" },
        ...sx,
        whiteSpace: "normal",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
