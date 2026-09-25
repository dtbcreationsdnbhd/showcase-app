"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type InquiryNotice = {
  id: number;
  message: string;
  tone: "success" | "error";
};

export default function InquirySnackbar({
  notice,
  onClose,
}: {
  notice: InquiryNotice | null;
  onClose: () => void;
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => onCloseRef.current(), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!notice) return null;

  const error = notice.tone === "error";

  return createPortal(
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        top: 80,
        transform: "translateX(-50%)",
        zIndex: 3000,
        maxWidth: "calc(100vw - 32px)",
        padding: "8px 16px",
        borderRadius: 10,
        background: "#120D27",
        color: error ? "#FF8A8A" : "#C3A4FF",
        border: error
          ? "1px solid rgba(255, 138, 138, 0.35)"
          : "1px solid rgba(195, 164, 255, 0.35)",
        boxShadow: error
          ? "0px 4px 20px rgba(255, 138, 138, 0.25)"
          : "0px 4px 20px rgba(236, 115, 255, 0.35)",
        fontFamily:
          'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
        fontWeight: 500,
        fontSize: 13,
        lineHeight: "20px",
        textAlign: "center",
      }}
    >
      {notice.message}
    </div>,
    document.body,
  );
}
