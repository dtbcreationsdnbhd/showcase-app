/** Mobile menu links. */
export const NAV_LINKS = [
  { label: "HOME", hash: "#top", center: false },
  { label: "SERVICES", hash: "#services", center: true },
  { label: "HOW WE WORK", hash: "#how-we-work", center: true },
  { label: "PROJECTS", hash: "#projects", center: true },
] as const;

/** Desktop navbar links: projects live in the SERVICES dropdown instead. */
export const DESKTOP_NAV_LINKS = [
  { label: "HOME", hash: "#top", center: false },
  { label: "SERVICES/PROJECTS", hash: "#services", center: true },
  { label: "WHY US", hash: "#why-us", center: true },
  { label: "FAQ", hash: "#faq", center: true },
] as const;

export type ServiceIcon =
  | "send"
  | "search"
  | "video"
  | "character"
  | "drama"
  | "music"
  | "screen"
  | "adult";

export type ServiceGroup = {
  title: string;
  accent: "pink" | "gradient" | "purple";
  badge?: string;
  items: { label: string; tag?: string; desc: string; icon: ServiceIcon }[];
};

/** Desktop SERVICES dropdown. Items are display-only until they get links. */
export const SERVICES_MENU: ServiceGroup[] = [
  {
    title: "Tools",
    accent: "pink",
    items: [
      { label: "TeleFlies", desc: "Telegram marketing automation", icon: "send" },
      { label: "FindSEO", desc: "SEO audits and keyword insights", icon: "search" },
    ],
  },
  {
    title: "Designs",
    accent: "gradient",
    items: [
      { label: "AI Video", desc: "Brand videos generated with AI", icon: "video" },
      { label: "AI IP Video", desc: "Bring your characters and IP to life", icon: "character" },
      { label: "AI Drama", desc: "AI-produced short drama series", icon: "drama" },
      { label: "AI MV", desc: "Music videos powered by AI", icon: "music" },
    ],
  },
  {
    title: "Platform Creation",
    accent: "purple",
    badge: "with Ads Dashboard",
    items: [
      {
        label: "Movie Site",
        tag: "Niuniutv",
        desc: "Streaming platform with ad monetization",
        icon: "screen",
      },
      {
        label: "Porn Site",
        desc: "Adult content platform with ad monetization",
        icon: "adult",
      },
    ],
  },
];

/** True while a navbar/hash scroll is in flight — How We Work scrubs 1:1 (fast-forward). */
let landingNavDepth = 0;

export function isLandingNav(): boolean {
  return landingNavDepth > 0;
}

function releaseLandingNav() {
  landingNavDepth = Math.max(0, landingNavDepth - 1);
  if (landingNavDepth === 0) {
    window.dispatchEvent(new Event("scroll"));
  }
}

/** Smooth-scroll to a hash target. How We Work fast-forwards with the trip. */
export function scrollLandingBy(delta: number): void {
  landingNavDepth += 1;
  window.scrollBy({ top: delta, behavior: "smooth" });
  const onEnd = () => {
    window.removeEventListener("scrollend", onEnd);
    window.clearTimeout(timeout);
    requestAnimationFrame(() => requestAnimationFrame(releaseLandingNav));
  };
  window.addEventListener("scrollend", onEnd);
  const timeout = window.setTimeout(onEnd, 2000);
}
