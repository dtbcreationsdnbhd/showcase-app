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

/** Drop `hero-mobile.png` (or `.jpg` / `.webp`) into `apps/web/public/landing/`. */
export function getLandingHeroMobileSrc(): string | null {
  return (
    publicUrl("landing/hero-mobile.png") ??
    publicUrl("landing/hero-mobile.jpg") ??
    publicUrl("landing/hero-mobile.webp")
  );
}

export type LandingProcessStep = "step01" | "step02" | "step03" | "step04";

export type LandingServiceIcon = "ai" | "web" | "star" | "refresh";

/** Drop `step01.png`–`step04.png` into `apps/web/public/landing/`. */
export function getLandingProcessStepSrc(
  key: LandingProcessStep,
): string | null {
  return (
    publicUrl(`landing/${key}.png`) ??
    publicUrl(`landing/${key}.jpg`) ??
    publicUrl(`landing/${key}.webp`)
  );
}

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

/** Combined morph animation for the sticky service icons. */
export function getLandingServiceMorphSrc(): string | null {
  return publicUrl("landing/services-morph.json");
}

/** Drop `project-showcase.png` (or `.jpg` / `.webp`) into `apps/web/public/landing/`. */
export function getLandingProjectShowcaseSrc(): string | null {
  return (
    publicUrl("landing/project-showcase.png") ??
    publicUrl("landing/project-showcase.jpg") ??
    publicUrl("landing/project-showcase.webp")
  );
}

/** Drop `project.png` (or `.jpg` / `.webp`) into `apps/web/public/landing/`. Shared by all project detail slots. */
export function getLandingProjectDetailSrc(): string | null {
  return (
    publicUrl("landing/project.png") ??
    publicUrl("landing/project.jpg") ??
    publicUrl("landing/project.webp")
  );
}

/** Drop `contact-wave.png` (or `.jpg` / `.webp`) into `apps/web/public/landing/`. */
export function getLandingContactWaveSrc(): string | null {
  return (
    publicUrl("landing/contact-wave.png") ??
    publicUrl("landing/contact-wave.jpg") ??
    publicUrl("landing/contact-wave.webp")
  );
}
