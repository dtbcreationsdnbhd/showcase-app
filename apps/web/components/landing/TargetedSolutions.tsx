import Box from "@mui/material/Box";
import { getLocale } from "@/lib/get-locale";
import {
  SOLUTIONS_VIEWPORT_PAGES,
  STAGE_VIEWPORT_PAGE_HEIGHT_CSS,
} from "@/lib/landing-layout";

/** Navbar height on the 1920 stage, so the artwork sits below it. */
const NAV_CLEARANCE = 102;
/**
 * English artwork is drawn smaller inside the same canvas as the Chinese one.
 * Scale it so the title and cards read at the same size.
 */
const EN_CONTENT_SCALE = 1.18;
/** Nudge the English artwork up so the title sits closer to the navbar. */
const EN_SHIFT_UP = 48;

export default async function TargetedSolutions() {
  const locale = await getLocale();
  const zh = locale === "zh";
  const src = zh
    ? "/landing/solution-content-cn.png"
    : "/landing/solution-content-en.png";
  const alt = zh
    ? "精准的解决方案，助力企业实现更智慧的业务增长"
    : "Smart solutions for smarter business growth";

  return (
    <Box
      component="section"
      id="solutions"
      sx={{
        position: "relative",
        width: "100%",
        height: `calc(${SOLUTIONS_VIEWPORT_PAGES} * ${STAGE_VIEWPORT_PAGE_HEIGHT_CSS})`,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: NAV_CLEARANCE,
          bottom: 24,
          width: "100%",
          height: `calc(100% - ${NAV_CLEARANCE + 24}px)`,
          objectFit: "contain",
          objectPosition: "center",
          transform: zh
            ? "none"
            : `translateY(-${EN_SHIFT_UP}px) scale(${EN_CONTENT_SCALE})`,
          transformOrigin: "center center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </Box>
  );
}
