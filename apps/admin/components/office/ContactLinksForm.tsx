"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import NoticeSnackbar, { type AuthNotice } from "@/components/NoticeSnackbar";
import { saveContactLinks } from "@/app/(office)/contact/actions";
import type { ContactLink, ContactLinkId } from "@/lib/contact-links";
import { cornerRadius } from "@/lib/ui";

const BRAND: Record<ContactLinkId, { background: string; mark: ReactNode }> = {
  whatsapp: {
    background: "linear-gradient(180deg, #5FEA8A 0%, #25D366 100%)",
    mark: (
      <path d="M22 16.9v2.2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 1.1h2.2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 8.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.8 2.2Z" />
    ),
  },
  telegram: {
    background: "linear-gradient(180deg, #6EC8FF 0%, #2AABEE 100%)",
    mark: <path d="M21 4 3.5 11.2l6.2 2.1L17 8l-5.6 6.4.2 5.1 2.6-4.2L20 18.5 21 4Z" />,
  },
  facebook: {
    background: "linear-gradient(180deg, #4C9DFF 0%, #1877F2 100%)",
    mark: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  instagram: {
    background: "linear-gradient(135deg, #F9CE34 0%, #EE2A7B 55%, #6228D7 100%)",
    mark: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
  },
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" disabled={pending} sx={{ height: 40, minWidth: 112 }}>
      {pending ? <CircularProgress size={18} color="inherit" /> : "Save"}
    </Button>
  );
}

export default function ContactLinksForm({ links }: { links: ContactLink[] }) {
  const router = useRouter();
  const [notice, setNotice] = useState<AuthNotice | null>(null);

  return (
    <>
      <Box
        component="form"
        action={async (formData) => {
          const result = await saveContactLinks(formData);
          setNotice({
            id: String(Date.now()),
            message: result.ok ? "Saved" : result.message,
            tone: result.ok ? "success" : "error",
          });
          if (result.ok) router.refresh();
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {links.map((link) => (
            <Box
              key={link.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                p: 2,
                borderRadius: "12px",
                border: "1px solid #E6E1F2",
                bgcolor: "#FAF8FF",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: "50%",
                    color: "#fff",
                    background: BRAND[link.id].background,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                >
                  <Box
                    component="svg"
                    viewBox="0 0 24 24"
                    aria-hidden
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    sx={{ width: 16, height: 16 }}
                  >
                    {BRAND[link.id].mark}
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{link.label}</Typography>
              </Box>
              <TextField
                name={link.id}
                defaultValue={link.href}
                placeholder="https://"
                variant="outlined"
                size="small"
                fullWidth
                aria-label={`${link.label} link`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: cornerRadius,
                    bgcolor: "#fff",
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5 }}>
          <SaveButton />
        </Box>
      </Box>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}
