"use client";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";

export default function ProjectDetailsButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <IconButton
      component={Link}
      href={`/projects/${id}`}
      aria-label={`View details for ${name}`}
      sx={{
        width: 32,
        height: 32,
        color: "#2A2A2A",
        "&:hover": { bgcolor: "#F4F1FB" },
        "&.Mui-focusVisible": {
          outline: "2px solid #7B61FF",
          outlineOffset: 2,
        },
      }}
    >
      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );
}
