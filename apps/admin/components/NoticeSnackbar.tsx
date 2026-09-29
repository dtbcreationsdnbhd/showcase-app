"use client";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export type AuthNotice = {
  id: string;
  message: string;
  tone: "success" | "error";
};

export default function NoticeSnackbar({
  notice,
  onClose,
}: {
  notice: AuthNotice | null;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={Boolean(notice)}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={notice?.tone === "error" ? "error" : "success"}
        variant="filled"
        onClose={onClose}
      >
        {notice?.message}
      </Alert>
    </Snackbar>
  );
}
