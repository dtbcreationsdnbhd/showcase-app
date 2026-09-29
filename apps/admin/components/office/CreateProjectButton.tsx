"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useState } from "react";

import ProjectFormDialog from "@/components/office/ProjectFormDialog";

export default function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setSession((value) => value + 1);
          setOpen(true);
        }}
        sx={{ minWidth: 112, px: 3 }}
      >
        Create
      </Button>
      <ProjectFormDialog
        open={open}
        session={session}
        mode="create"
        onClose={() => setOpen(false)}
      />
    </>
  );
}
