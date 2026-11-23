"use client";

import Box from "@mui/material/Box";
import { CJK_FONT, chromeCopy, withLocale, type Locale } from "@/lib/locale";

const OPTIONS = ["en", "zh"] as const;

export default function LanguageSwitch({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string;
}) {
  const copy = chromeCopy(locale);

  return (
    <Box
      role="group"
      aria-label={copy.language}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "2px",
        flexShrink: 0,
        fontFamily: CJK_FONT,
        fontStyle: "normal",
      }}
    >
      {OPTIONS.map((option, index) => {
        const active = option === locale;
        const href = withLocale(pathname, option);
        const label = option === "en" ? "EN" : "中文";
        return (
          <Box key={option} sx={{ display: "flex", alignItems: "center" }}>
            {index > 0 ? (
              <Box
                component="span"
                aria-hidden
                sx={{
                  color: "rgba(255, 255, 255, 0.35)",
                  fontSize: 15,
                  lineHeight: "22px",
                  px: "2px",
                }}
              >
                |
              </Box>
            ) : null}
            <Box
              component={active ? "span" : "a"}
              href={active ? undefined : href}
              aria-current={active ? "true" : undefined}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 44,
                minHeight: 44,
                px: "4px",
                boxSizing: "border-box",
                fontSize: 16,
                lineHeight: "22px",
                fontWeight: active ? 600 : 500,
                color: active ? "#FFD866" : "rgba(255, 255, 255, 0.78)",
                textDecoration: "none",
                cursor: active ? "default" : "pointer",
                whiteSpace: "nowrap",
                borderRadius: "8px",
                transition: "color 0.15s ease",
                "&:hover": active ? undefined : { color: "#FFFFFF" },
                "&:focus-visible": {
                  outline: "2px solid #FFD866",
                  outlineOffset: 2,
                },
              }}
            >
              {label}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
