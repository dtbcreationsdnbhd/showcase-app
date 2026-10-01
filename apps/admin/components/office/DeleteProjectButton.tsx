"use client";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState, useTransition } from "react";

import { deleteShowcaseProject } from "@/app/(office)/projects/actions";
import NoticeSnackbar, { type AuthNotice } from "@/components/NoticeSnackbar";
import { cornerRadius } from "@/lib/ui";

export default function DeleteProjectButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<AuthNotice | null>(null);
  const [pending, startTransition] = useTransition();

  function close() {
    if (pending) return;
    setOpen(false);
    setError(null);
  }

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteShowcaseProject(id);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      setOpen(false);
      setNotice({
        id: crypto.randomUUID(),
        message: "Project deleted",
        tone: "success",
      });
    });
  }

  return (
    <>
      <IconButton
        aria-label={`Delete ${name}`}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
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
        <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: cornerRadius,
            },
          },
        }}
      >
        <Box sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
            Delete
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Delete &quot;{name}&quot;? This cannot be undone.
          </Typography>
          {error ? (
            <Typography variant="body2" color="error" sx={{ mt: 1.5 }}>
              {error}
            </Typography>
          ) : null}
        </Box>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button type="button" onClick={close} disabled={pending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={pending}
          >
            {pending ? <CircularProgress size={18} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}
