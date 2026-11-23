"use client";

import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import CenterHashLink from "@/components/landing/CenterHashLink";
import {
  SERVICES_MENU,
  type ServiceGroup,
  type ServiceIcon,
} from "@/lib/landing-nav";
import { GOLD_RIM } from "@/lib/gold-theme";
import { LANDING_DESIGN_WIDTH } from "@/lib/landing-layout";
import { CJK_FONT, type Locale } from "@/lib/locale";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
  fontStyle: "normal",
} as const;

const ACCENT_BG: Record<ServiceGroup["accent"], string> = {
  pink: "rgba(255, 45, 120, 0.28)",
  service: "rgba(120, 196, 255, 0.22)",
  gradient: "rgba(255, 196, 92, 0.2)",
  orange: "rgba(255, 138, 31, 0.26)",
};

const ICONS: Record<ServiceIcon, ReactNode> = {
  send: (
    <>
      <path d="M21 3 10 14" />
      <path d="M21 3 14.5 21 10 14 3 9.5 21 3Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
  character: (
    <>
      <circle cx="11" cy="9" r="3.5" />
      <path d="M4 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
      <path d="m19 2.5.7 1.6 1.6.7-1.6.7L19 7.1l-.7-1.6-1.6-.7 1.6-.7.7-1.6Z" />
    </>
  ),
  drama: (
    <>
      <rect x="3" y="10" width="18" height="10" rx="2" />
      <path d="m3 10 16.5-4.5.7 2.6L3 10" />
      <path d="m8.5 8.5 1.6-3M13.5 7.2l1.6-3" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l11-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  screen: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  adult: (
    <>
      <circle cx="12" cy="12" r="9" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="sans-serif"
      >
        18+
      </text>
    </>
  ),
};

const PANEL_CLASS = "services-panel";
const PANEL_FADE = 90;
const CARET_CLASS = "services-caret";

const SERVICES_MENU_CLASS = "services-menu";
const SERVICES_BG = "#560A2C";
const PANEL_TOP_FADE = 44;
const PANEL_MASK = `linear-gradient(180deg, transparent 0, #000 ${PANEL_TOP_FADE}px, #000 calc(100% - ${PANEL_FADE}px), transparent 100%)`;

/** Hover/focus target: wraps the SERVICES link and owns the dropdown panel. */
export default function ServicesMenu({
  href,
  locale,
  children,
}: {
  href: string;
  locale: Locale;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);

  return (
    <Box
      className={SERVICES_MENU_CLASS}
      onMouseEnter={() => {
        setInstant(false);
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        setInstant(false);
        setOpen(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      sx={{
        display: "flex",
        [`& .${CARET_CLASS}`]: open ? { transform: "rotate(180deg)" } : {},
      }}
    >
      {children}
      <ServicesPanel
        href={href}
        locale={locale}
        open={open}
        instant={instant}
        onNavigate={() => {
          setInstant(true);
          setOpen(false);
        }}
      />
    </Box>
  );
}

export function ServicesCaret() {
  return (
    <Box
      component="svg"
      className={CARET_CLASS}
      viewBox="0 0 12 12"
      aria-hidden
      sx={{
        position: "absolute",
        right: 2,
        top: "50%",
        mt: "-6px",
        width: 12,
        height: 12,
        transition: "transform 0.2s ease",
      }}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

/** Anchored to the 1680 navbar row (the nearest positioned ancestor) and
 *  centred on it, so 1920 spans the whole stage. Its top padding bridges the
 *  gap under the link so the pointer can cross into it, and lands the panel
 *  flush with the header's bottom edge. */
function ServicesPanel({
  href,
  locale,
  open,
  instant,
  onNavigate,
}: {
  href: string;
  locale: Locale;
  open: boolean;
  instant: boolean;
  onNavigate: () => void;
}) {
  const textFont = locale === "zh" ? { fontFamily: CJK_FONT } : barlow;
  return (
    <Box
      className={PANEL_CLASS}
      onClick={onNavigate}
      sx={{
        position: "absolute",
        top: 78,
        left: "50%",
        width: LANDING_DESIGN_WIDTH,
        pt: "24px",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translate(-50%, 0)" : "translate(-50%, -8px)",
        transition:
          open && !instant
            ? "opacity 0.2s ease, transform 0.2s ease, visibility 0s"
            : "none",
      }}
    >
      <Box
        sx={{
          // No backdrop blur: its edge sampling draws a seam against the navbar.
          background: SERVICES_BG,
          maskImage: PANEL_MASK,
          WebkitMaskImage: PANEL_MASK,
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "48px",
          pt: "56px",
          pb: `${64 + PANEL_FADE}px`,
          px: "72px",
        }}
      >
        {SERVICES_MENU.map((group) => (
          <Box component="section" key={group.id}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "12px",
                mb: "14px",
              }}
            >
              <Box
                component="span"
                sx={{
                  ...textFont,
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: "24px",
                  letterSpacing: "0.02em",
                  color: "#FFE08A",
                  px: "18px",
                  py: "9px",
                  borderRadius: "9999px",
                  background: ACCENT_BG[group.accent],
                  border: `1.5px solid ${GOLD_RIM}`,
                  boxShadow:
                    "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 16px rgba(255, 184, 72, 0.25)",
                }}
              >
                {group.title[locale] ?? group.title.en}
              </Box>
              {group.badge ? (
                <Box
                  component="span"
                  sx={{
                    ...textFont,
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: "18px",
                    color: "rgba(255, 255, 255, 0.7)",
                    px: "10px",
                    py: "4px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {group.badge[locale] ?? group.badge.en}
                </Box>
              ) : null}
            </Box>

            {group.items.map((item) => (
              <CenterHashLink
                key={item.id}
                hash={href.slice(href.indexOf("#"))}
                href={href}
                sx={{
                  textDecoration: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                  py: "18px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  "&:first-of-type": { borderTop: "none" },
                  "&:hover .services-item-title": { color: "#FFD866" },
                  "&:hover .services-item-dot": {
                    width: 8,
                    mr: 0,
                    opacity: 1,
                  },
                  "&:hover .services-item-icon": {
                    color: "#FFD866",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box
                    className="services-item-title"
                    sx={{
                      ...textFont,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontWeight: 600,
                      fontSize: 22,
                      lineHeight: "28px",
                      color: "rgba(255, 255, 255, 0.88)",
                      transition: "color 0.15s ease",
                    }}
                  >
                    {/* Collapsed with a negative margin so it cancels the row gap until hover. */}
                    <Box
                      component="span"
                      className="services-item-dot"
                      aria-hidden
                      sx={{
                        flexShrink: 0,
                        width: 0,
                        height: 8,
                        mr: "-10px",
                        borderRadius: "50%",
                        background: "#FFD866",
                        boxShadow: "0 0 10px rgba(255, 216, 102, 0.8)",
                        opacity: 0,
                        transition:
                          "width 0.2s ease, margin 0.2s ease, opacity 0.2s ease",
                      }}
                    />
                    {item.label[locale] ?? item.label.en}
                    {item.tag ? (
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 500,
                          fontSize: 13,
                          lineHeight: "18px",
                          px: "8px",
                          py: "2px",
                          borderRadius: "9999px",
                          background: "rgba(255, 45, 120, 0.2)",
                          color: "#FFB3CC",
                        }}
                      >
                        {item.tag[locale] ?? item.tag.en}
                      </Box>
                    ) : null}
                  </Box>
                  <Box
                    sx={{
                      ...textFont,
                      mt: "4px",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "22px",
                      color: "rgba(255, 255, 255, 0.72)",
                    }}
                  >
                    {item.desc[locale] ?? item.desc.en}
                  </Box>
                </Box>
                <Box
                  component="svg"
                  className="services-item-icon"
                  viewBox="0 0 24 24"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  sx={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    color: "rgba(255, 255, 255, 0.55)",
                    transition: "color 0.15s ease, transform 0.15s ease",
                  }}
                >
                  {ICONS[item.icon]}
                </Box>
              </CenterHashLink>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
