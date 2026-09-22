import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import CenterHashLink from "@/components/landing/CenterHashLink";

const NAV_LINKS = [
  { label: "HOME", hash: "#top", center: false },
  { label: "SERVICES", hash: "#services", center: true },
  { label: "HOW WE WORK", hash: "#how-we-work", center: true },
  { label: "PROJECTS", hash: "#projects", center: true },
] as const;

const headerFont = {
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
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

export default function Navbar({
  logoSrc,
  hrefPrefix = "",
}: {
  logoSrc: string | null;
  hrefPrefix?: string;
}) {
  const withPrefix = (hash: string) => `${hrefPrefix}${hash}`;

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
        ...headerFont,
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
          width: 1370,
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
            py: "6px",
            px: "13px",
            gap: "27px",
            width: 146,
            height: 54,
            boxSizing: "border-box",
            color: "#FFFFFF",
            textDecoration: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt=""
              width={42}
              height={42}
              style={{ width: 42, height: 42, borderRadius: "50%" }}
            />
          ) : (
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
          )}
          <Typography
            component="span"
            sx={{
              ...headerFont,
              width: 51,
              height: 29,
              fontSize: 24,
              lineHeight: "29px",
              color: "#FFFFFF",
            }}
          >
            LOGO
          </Typography>
        </Box>

        <Box
          component="nav"
          aria-label="Primary"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: 0,
            gap: "36px",
            width: 491,
            height: 54,
            flexShrink: 0,
          }}
        >
          {NAV_LINKS.map((link) => {
            const href = withPrefix(link.hash);
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
            } as const;
            const label = (
              <Typography
                component="span"
                sx={{
                  ...headerFont,
                  fontSize: 18,
                  lineHeight: "22px",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.5)",
                  whiteSpace: "nowrap",
                }}
              >
                {link.label}
              </Typography>
            );
            if (link.center) {
              return (
                <CenterHashLink key={link.label} hash={link.hash} href={href} sx={linkSx}>
                  {label}
                </CenterHashLink>
              );
            }
            return (
              <Box
                key={link.label}
                component="a"
                href={href}
                sx={linkSx}
              >
                {label}
              </Box>
            );
          })}
        </Box>

        <Box
          component="a"
          href={withPrefix("#contact")}
          sx={{
            boxSizing: "border-box",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 190,
            height: 52,
            background: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
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
                fontSize: 18,
                lineHeight: "22px",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              Start a Project
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
                boxSizing: "border-box",
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "99px",
                flexShrink: 0,
              }}
            >
              <ArrowRightIcon />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
