"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

import ProjectFormDialog from "@/components/office/ProjectFormDialog";
import type { ShowcaseProject } from "@/lib/projects";

const actionIconSx = {
  width: 32,
  height: 32,
  color: "#2A2A2A",
  "&:hover": { bgcolor: "#F4F1FB" },
  "&.Mui-focusVisible": {
    outline: "2px solid #7B61FF",
    outlineOffset: 2,
  },
};

export default function EditProjectButton({ project }: { project: ShowcaseProject }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  return (
    <>
      <IconButton
        aria-label={`Edit ${project.name}`}
        onClick={() => {
          setSession((value) => value + 1);
          setOpen(true);
        }}
        sx={actionIconSx}
      >
        <EditOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <ProjectFormDialog
        open={open}
        session={session}
        mode="edit"
        project={project}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
