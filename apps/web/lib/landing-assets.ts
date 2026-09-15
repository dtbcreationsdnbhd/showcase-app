import { existsSync } from "node:fs";
import { join } from "node:path";

function publicUrl(relativeFromPublic: string): string | null {
  const abs = join(process.cwd(), "public", relativeFromPublic);
  if (!existsSync(abs)) {
    return null;
  }
  return `/${relativeFromPublic.replaceAll("\\", "/")}`;
}

/** Drop `logo.svg` or `logo.png` into `apps/web/public/landing/`. */
export function getLandingLogoSrc(): string | null {
  return publicUrl("landing/logo.svg") ?? publicUrl("landing/logo.png");
}

/** Drop `hero.png` (or `.jpg` / `.webp`) into `apps/web/public/landing/`. */
export function getLandingHeroSrc(): string | null {
  return (
    publicUrl("landing/hero.png") ??
    publicUrl("landing/hero.jpg") ??
    publicUrl("landing/hero.webp")
  );
}

export type LandingServiceIcon = "ai" | "web" | "star" | "refresh";

/** Drop `ai.png` / `web.png` / `star.png` / `refresh.png` into `apps/web/public/landing/`. */
export function getLandingServiceIconSrc(
  key: LandingServiceIcon,
): string | null {
  return (
    publicUrl(`landing/${key}.png`) ??
    publicUrl(`landing/${key}.jpg`) ??
    publicUrl(`landing/${key}.webp`)
  );
}
