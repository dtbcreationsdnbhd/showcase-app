"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DOMPurify from "isomorphic-dompurify";
import { isRichHtml } from "@/lib/rich-text";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
];

export default function RichTextView({
  value,
  emptyLabel = "—",
}: {
  value: string;
  emptyLabel?: string;
}) {
  if (!value.trim()) {
    return (
      <Typography variant="body2" sx={{ lineHeight: "24px" }}>
        {emptyLabel}
      </Typography>
    );
  }

  if (!isRichHtml(value)) {
    return (
      <Typography
        variant="body2"
        sx={{
          lineHeight: "24px",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    );
  }

  const html = DOMPurify.sanitize(value, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  return (
    <Box
      sx={{
        lineHeight: "24px",
        fontSize: "0.875rem",
        overflowWrap: "anywhere",
        "& p": { m: 0, mb: 1 },
        "& p:last-child": { mb: 0 },
        "& ul, & ol": { m: 0, mb: 1, pl: 2.5 },
        "& li": { mb: 0.25 },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
