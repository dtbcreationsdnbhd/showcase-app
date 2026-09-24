import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getLandingServiceIconLottieSrc } from "@/lib/landing-assets";
import { SERVICE_ROWS, type ServiceCopy } from "@/lib/landing-content";
import {
  MOBILE_CONTENT_WIDTH,
  MOBILE_DIVIDER_COLOR,
  MOBILE_GUTTER,
  MOBILE_SECTION_BG,
  MOBILE_SERVICE_TITLE_COLOR,
  MOBILE_VIEWPORT_HEIGHT_CSS,
} from "@/lib/landing-layout-mobile";
import MobileServiceIcon from "./MobileServiceIcon";

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

export default function MobileServicePages() {
  return (
    <>
      {SERVICE_ROWS.map((row) => {
        const iconSrc = getLandingServiceIconLottieSrc(row.icon);
        return (
          <Box
            key={row.icon}
            component="section"
            aria-label={row.alt}
            sx={{
              width: "100%",
              bgcolor: MOBILE_SECTION_BG,
              // One page per icon, like the desktop pinned rows.
              // `minHeight`, so a short device grows the page instead of clipping.
              minHeight: MOBILE_VIEWPORT_HEIGHT_CSS,
              px: `${MOBILE_GUTTER}px`,
              py: "52px",
              boxSizing: "border-box",
              borderBottom: `1px solid ${MOBILE_DIVIDER_COLOR}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
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
          </Box>
        );
      })}
    </>
  );
}
