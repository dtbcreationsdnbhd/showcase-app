"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import { SERVICE_ROWS, type ServiceCopy } from "@/lib/landing-content";
import {
  MOBILE_CONTENT_WIDTH,
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  MOBILE_SERVICE_TITLE_COLOR,
  MOBILE_VIEWPORT_HEIGHT_CSS,
} from "@/lib/landing-layout-mobile";
import MobileServiceIcon from "./MobileServiceIcon";
import { MobileSeamLine, useMobileStackLag } from "./mobile-stack";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

/** Lottie source box is 846x740. */
const ICON_H = Math.round((MOBILE_CONTENT_WIDTH * 740) / 846);

function ServiceCopyBlock({ title, description }: ServiceCopy) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Typography
        component="h3"
        sx={{
          ...barlow,
          m: 0,
          fontWeight: 600,
          fontSize: 30,
          lineHeight: "38px",
          letterSpacing: "-0.02em",
          color: MOBILE_SERVICE_TITLE_COLOR,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          ...barlow,
          m: 0,
          fontWeight: 500,
          fontSize: 17,
          lineHeight: "160%",
          letterSpacing: "0.02em",
          color: "#FFFFFF",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

type ServiceRow = (typeof SERVICE_ROWS)[number] & { iconSrc: string | null };

export default function MobileServicePages({ rows }: { rows: ServiceRow[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useMobileStackLag(wrapRef);

  return (
    <Box ref={wrapRef} sx={{ position: "relative", width: "100%" }}>
      {rows.map((row, index) => {
        const iconSrc = row.iconSrc;
        return (
          <Box
            key={row.icon}
            component="section"
            aria-label={row.alt}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: index + 1,
              width: "100%",
              // One page per icon. Each one sticks, and the next slides up over it.
              // `minHeight`, so a short device grows the page instead of clipping.
              minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
            }}
          >
            <Box
              data-sheet=""
              sx={{
                position: "relative",
                width: "100%",
                minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
                boxSizing: "border-box",
                px: `${MOBILE_GUTTER}px`,
                py: "52px",
                bgcolor: MOBILE_SECTION_BG,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
            <MobileSeamLine edge="top" />
            {iconSrc ? (
              <MobileServiceIcon
                src={iconSrc}
                alt={row.alt}
                width={MOBILE_CONTENT_WIDTH}
                height={ICON_H}
              />
            ) : null}
            <Box
              sx={{
                mt: "72px",
                display: "flex",
                flexDirection: "column",
                gap: "65px",
              }}
            >
              {row.services.map((service) => (
                <ServiceCopyBlock key={service.title} {...service} />
              ))}
            </Box>
            {index === rows.length - 1 ? (
              <MobileSeamLine edge="bottom" />
            ) : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
