"use client";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";

const InquiryPendingContext = createContext<{
  pending: boolean;
  replace: (href: string) => void;
  push: (href: string) => void;
} | null>(null);

export function InquiryPendingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function replace(href: string) {
    startTransition(() => {
      router.replace(href);
    });
  }

  function push(href: string) {
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <InquiryPendingContext.Provider value={{ pending, replace, push }}>
      {children}
    </InquiryPendingContext.Provider>
  );
}

export function useInquiryPending() {
  const value = useContext(InquiryPendingContext);
  if (!value) {
    throw new Error("useInquiryPending must be used inside InquiryPendingProvider");
  }
  return value;
}

export function InquiryTablePending({
  children,
  label = "Loading inquiries",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const { pending } = useInquiryPending();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
      }}
    >
      {pending ? (
        <LinearProgress
          aria-label={label}
          sx={{ position: "absolute", top: 0, right: 0, left: 0, zIndex: 2 }}
        />
      ) : null}
      <Box
        sx={{
          display: "flex",
          minHeight: 0,
          flex: 1,
          flexDirection: "column",
          opacity: pending ? 0.45 : 1,
          pointerEvents: pending ? "none" : "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
