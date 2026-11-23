"use client";

import Box from "@mui/material/Box";
import type { MouseEvent } from "react";
import { useLocaleLoading } from "@/components/landing/LocaleLoading";
import { CJK_FONT, chromeCopy, withLocale, type Locale } from "@/lib/locale";

const OPTIONS = ["en", "zh"] as const;

export default function LanguageSwitch({
  locale,
  pathname,
  fontFamily = CJK_FONT,
  fontSize = 16,
}: {
  locale: Locale;
  pathname: string;
  fontFamily?: string;
  fontSize?: number;
}) {
  const copy = chromeCopy(locale);
  const { begin: beginLoading } = useLocaleLoading();

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
        fontFamily,
        fontStyle: "normal",
        fontWeight: 500,
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
                  fontFamily,
                  fontSize,
                  lineHeight: "22px",
                  fontWeight: 500,
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
              onClick={
                active
                  ? undefined
                  : (event: MouseEvent<HTMLAnchorElement>) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey ||
                        event.button !== 0
                      ) {
                        return;
                      }
                      event.preventDefault();
                      beginLoading();
                      // `/` and `/zh` rewrite to the same page, so a client
                      // navigation only changes the URL. Paint the overlay,
                      // then load the other language for real.
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          window.location.assign(href);
                        });
                      });
                    }
              }
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 44,
                minHeight: 44,
                px: "4px",
                boxSizing: "border-box",
                fontFamily: option === "zh" ? CJK_FONT : fontFamily,
                fontSize,
                lineHeight: "22px",
                fontWeight: 500,
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
