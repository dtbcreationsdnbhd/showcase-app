"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const WEB_ORIGIN = process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

const OPTIONS = [
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
] as const;

type PreviewLocale = (typeof OPTIONS)[number]["id"];

export default function ProjectPreview({ id, name }: { id: string; name: string }) {
  const [locale, setLocale] = useState<PreviewLocale>("en");
  const src =
    locale === "zh" ? `${WEB_ORIGIN}/zh/preview/${id}` : `${WEB_ORIGIN}/preview/${id}`;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography
          component="h2"
          sx={{
            m: 0,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#7B61FF",
          }}
        >
          Preview
        </Typography>
        <Box role="group" aria-label="Preview language" sx={{ display: "flex", alignItems: "center" }}>
          {OPTIONS.map((option, index) => {
            const active = option.id === locale;
            return (
              <Box key={option.id} sx={{ display: "flex", alignItems: "center" }}>
                {index > 0 ? (
                  <Box component="span" aria-hidden sx={{ color: "#C4BDD6", px: 0.75, fontSize: 13 }}>
                    |
                  </Box>
                ) : null}
                <Box
                  component="button"
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLocale(option.id)}
                  sx={{
                    border: 0,
                    p: 0,
                    bgcolor: "transparent",
                    cursor: "pointer",
                    font: "inherit",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#7B61FF" : "#8A8499",
                    fontFamily: option.id === "zh" ? '"PingFang SC", "Microsoft YaHei", sans-serif' : "inherit",
                  }}
                >
                  {option.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "16 / 10",
          overflow: "hidden",
          borderRadius: "8px",
          border: "1px solid #E6E1F2",
          bgcolor: "#2A0818",
        }}
      >
        <Box
          key={locale}
          component="iframe"
          title={`${name} on the ${locale === "zh" ? "Chinese" : "English"} website`}
          src={src}
          sx={{ display: "block", width: "100%", height: "100%", border: 0 }}
        />
      </Box>
    </Box>
  );
}
