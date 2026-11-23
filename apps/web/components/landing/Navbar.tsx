import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import CenterHashLink from "@/components/landing/CenterHashLink";
import LanguageSwitch from "@/components/landing/LanguageSwitch";
import ServicesMenu, { ServicesCaret } from "@/components/landing/ServicesMenu";
import { getLocale, getRequestPathname } from "@/lib/get-locale";
import { GOLD_INK, goldButtonSx } from "@/lib/gold-theme";
import { DESKTOP_NAV_LINKS, SERVICES_MENU_HASH } from "@/lib/landing-nav";
import { CJK_FONT, chromeCopy, homeHashPrefix, navLabel } from "@/lib/locale";

const latinHeaderFont = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
  fontStyle: "normal",
  fontWeight: 500,
} as const;

function ArrowRightIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 16 16"
      aria-hidden
      sx={{ width: 16, height: 16, display: "block" }}
    >
      <path
        d="M2 8h10.5M9.2 3.8 13.8 8 9.2 12.2"
        fill="none"
        stroke="#FFD866"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

export default async function Navbar({
  logoSrc,
  hrefPrefix,
}: {
  logoSrc: string | null;
  /** Overrides the home-page prefix. Omitted pages follow the current locale path. */
  hrefPrefix?: string;
}) {
  const locale = await getLocale();
  const pathname = await getRequestPathname();
  const prefix = hrefPrefix ?? homeHashPrefix(pathname);
  const copy = chromeCopy(locale);
  const headerFont =
    locale === "zh" ? { ...latinHeaderFont, fontFamily: CJK_FONT } : latinHeaderFont;
  const navFontSize = locale === "zh" ? 17 : 21;
  const navLineHeight = locale === "zh" ? "22px" : "26px";
  const ctaFontSize = 18;
  const withPrefix = (hash: string) => `${prefix}${hash}`;

  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        width: "100%",
        height: 102,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 0,
        gap: "10px",
        overflow: "visible",
        ...(locale === "zh" ? headerFont : latinHeaderFont),
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 180,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 35%, transparent 100%)",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          py: "24px",
          px: 0,
          gap: "123px",
          width: 1680,
          height: 102,
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          component="a"
          href={withPrefix("#top")}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: logoSrc ? 0 : "27px",
            height: logoSrc ? 58 : 54,
            color: "#FFFFFF",
            textDecoration: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="VisionCraft"
              width={415}
              height={225}
              priority
              draggable={false}
              style={{ height: 58, width: "auto" }}
            />
          ) : (
            <>
              <Box
                component="span"
                aria-hidden
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  bgcolor: "#393939",
                  flexShrink: 0,
                }}
              />
              <Typography
                component="span"
                sx={{
                  ...headerFont,
                  fontSize: 24,
                  lineHeight: "29px",
                  color: "#FFFFFF",
                }}
              >
                LOGO
              </Typography>
            </>
          )}
        </Box>

        <Box
          component="nav"
          aria-label="Primary"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: 0,
            gap: "20px",
            width: "auto",
            height: 54,
            flexShrink: 0,
          }}
        >
          {DESKTOP_NAV_LINKS.map((link) => {
            const href = withPrefix(link.hash);
            const labelText = navLabel(locale, link.hash);
            const linkSx = {
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              py: "16px",
              px: "20px",
              height: 54,
              boxSizing: "border-box",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover > span, &:focus-visible > span": { color: "#FFD866" },
            } as const;
            const label = (
              <Typography
                component="span"
                sx={{
                  ...headerFont,
                  fontSize: navFontSize,
                  lineHeight: navLineHeight,
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.92)",
                  textShadow: "0 1px 10px rgba(60, 0, 24, 0.55)",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s ease",
                }}
              >
                {labelText}
              </Typography>
            );
            if (link.hash === "#services") {
              return (
                <ServicesMenu
                  key={link.hash}
                  locale={locale}
                  href={withPrefix(SERVICES_MENU_HASH)}
                >
                  <Box
                    component="span"
                    role="button"
                    tabIndex={0}
                    aria-haspopup="true"
                    className="hover-grow-lg"
                    sx={{ ...linkSx, position: "relative" }}
                  >
                    {label}
                    <ServicesCaret />
                  </Box>
                </ServicesMenu>
              );
            }
            if (link.center) {
              return (
                <CenterHashLink
                  key={link.hash}
                  hash={link.hash}
                  href={href}
                  className="hover-grow-lg"
                  sx={linkSx}
                >
                  {label}
                </CenterHashLink>
              );
            }
            return (
              <Box
                key={link.hash}
                component="a"
                href={href}
                className="hover-grow-lg"
                sx={linkSx}
              >
                {label}
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <Box
            component="a"
            href={withPrefix("#contact")}
            className="hover-grow"
            sx={{
              boxSizing: "border-box",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 190,
              height: 52,
              px: 0,
              ...goldButtonSx,
              borderRadius: "9999px",
              textDecoration: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                p: 0,
                gap: "20px",
                width: 150,
                height: 40,
              }}
            >
              <Typography
                component="span"
                sx={{
                  ...headerFont,
                  width: 104,
                  height: 22,
                  flexShrink: 0,
                  textAlign: "center",
                  fontSize: ctaFontSize,
                  lineHeight: "22px",
                  fontWeight: 600,
                  color: GOLD_INK,
                  whiteSpace: "nowrap",
                }}
              >
                {copy.startProject}
              </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                p: "12px",
                width: 40,
                height: 40,
                flexShrink: 0,
                boxSizing: "border-box",
                background: GOLD_INK,
                borderRadius: "99px",
              }}
            >
              <ArrowRightIcon />
            </Box>
          </Box>
          </Box>
          <Box sx={{ ml: "40px", mr: "-40px" }}>
            <LanguageSwitch
              locale={locale}
              pathname={pathname}
              fontFamily={headerFont.fontFamily}
              fontSize={locale === "zh" ? navFontSize : 16}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
