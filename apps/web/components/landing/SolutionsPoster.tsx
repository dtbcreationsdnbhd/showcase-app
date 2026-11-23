import Box from "@mui/material/Box";
import { getLocale } from "@/lib/get-locale";
import { SOLUTIONS_DESKTOP_HEIGHT } from "@/lib/landing-layout";

/** Sits at the top of the solutions section and scrolls away with it. */
export default async function SolutionsPoster() {
  const locale = await getLocale();
  const src =
    locale === "zh" ? "/landing/solutions-bg-cn.png" : "/landing/solutions-bg.webp";

  return (
    <Box
      component="img"
      src={src}
      alt={
        locale === "zh"
          ? "精准的解决方案，助力企业实现更智慧的业务增长"
          : "Smart solutions for smarter business growth"
      }
      sx={{
        display: "block",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: SOLUTIONS_DESKTOP_HEIGHT,
        objectFit: "cover",
        objectPosition: "center",
        visibility: "hidden",
      }}
    />
  );
}
