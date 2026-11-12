import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import {
  SERVICES_MENU,
  type ServiceGroup,
  type ServiceIcon,
} from "@/lib/landing-nav";
import { LANDING_DESIGN_WIDTH } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
  fontStyle: "normal",
} as const;

const ACCENT_BG: Record<ServiceGroup["accent"], string> = {
  pink: "#CC35CC",
  gradient: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
  purple: "#563DFE",
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
const CARET_CLASS = "services-caret";

export const SERVICES_MENU_CLASS = "services-menu";
export const SERVICES_BG = "rgba(10, 9, 24, 0.92)";

/** Hover/focus target: wraps the SERVICES link and owns the dropdown panel. */
export default function ServicesMenu({ children }: { children: ReactNode }) {
  return (
    <Box
      className={SERVICES_MENU_CLASS}
      sx={{
        display: "flex",
        [`&:hover > .${PANEL_CLASS}, &:has(:focus-visible) > .${PANEL_CLASS}`]: {
          opacity: 1,
          visibility: "visible",
          transform: "translate(-50%, 0)",
          pointerEvents: "auto",
          transition: "opacity 0.2s ease, transform 0.2s ease, visibility 0s",
        },
        [`&:hover .${CARET_CLASS}, &:has(:focus-visible) .${CARET_CLASS}`]: {
          transform: "rotate(180deg)",
        },
      }}
    >
      {children}
      <ServicesPanel />
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
        stroke="rgba(255, 255, 255, 0.5)"
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
function ServicesPanel() {
  return (
    <Box
      className={PANEL_CLASS}
      sx={{
        position: "absolute",
        top: 78,
        left: "50%",
        width: LANDING_DESIGN_WIDTH,
        pt: "24px",
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        transform: "translate(-50%, -8px)",
        transition:
          "opacity 0.2s ease 0.1s, transform 0.2s ease 0.1s, visibility 0s linear 0.3s",
      }}
    >
      <Box
        sx={{
          background: SERVICES_BG,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.55)",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "96px",
          pt: "56px",
          pb: "64px",
          px: `${(LANDING_DESIGN_WIDTH - 1680) / 2}px`,
        }}
      >
        {SERVICES_MENU.map((group) => (
          <Box component="section" key={group.title}>
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
                  ...barlow,
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: "24px",
                  letterSpacing: "0.02em",
                  color: "#FFFFFF",
                  px: "18px",
                  py: "9px",
                  borderRadius: "12px",
                  background: ACCENT_BG[group.accent],
                }}
              >
                {group.title}
              </Box>
              {group.badge ? (
                <Box
                  component="span"
                  sx={{
                    ...barlow,
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
                  {group.badge}
                </Box>
              ) : null}
            </Box>

            {group.items.map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                  py: "18px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  "&:first-of-type": { borderTop: "none" },
                  "&:hover .services-item-title": { color: "#FFFFFF" },
                  "&:hover .services-item-icon": {
                    color: "#CC35CC",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box
                    className="services-item-title"
                    sx={{
                      ...barlow,
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
                    {item.label}
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
                          background: "rgba(204, 53, 204, 0.2)",
                          color: "#F0A8F0",
                        }}
                      >
                        {item.tag}
                      </Box>
                    ) : null}
                  </Box>
                  <Box
                    sx={{
                      ...barlow,
                      mt: "4px",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "22px",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {item.desc}
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
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
