/** Mobile menu links — SERVICES/PROJECTS jumps to the project showcase. */
export const NAV_LINKS = [
  { label: "HOME", hash: "#top", center: false },
  { label: "SERVICES/PROJECTS", hash: "#projects", center: true },
  { label: "WHY US", hash: "#why-us", center: true },
  { label: "FAQ", hash: "#faq", center: true },
] as const;

/** Desktop navbar links: projects live in the SERVICES dropdown instead. */
export const DESKTOP_NAV_LINKS = [
  { label: "HOME", hash: "#top", center: false },
  { label: "SERVICES/PROJECTS", hash: "#services", center: true },
  { label: "SOLUTIONS", hash: "#solutions", center: true },
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

type Localized = { en: string; zh?: string };

export type ServiceGroup = {
  id: string;
  title: Localized;
  accent: "pink" | "service" | "gradient" | "orange";
  badge?: Localized;
  items: {
    id: string;
    label: Localized;
    tag?: Localized;
    desc: Localized;
    icon: ServiceIcon;
  }[];
};

/** Desktop SERVICES dropdown. Every item scrolls to the project cards under the hero.*/
export const SERVICES_MENU_HASH = "#hero-cards";
export const SERVICES_MENU: ServiceGroup[] = [
  {
    id: "digital-tools",
    title: { en: "Digital Tools", zh: "数字化工具" },
    accent: "pink",
    items: [
      {
        id: "teleflies",
        label: { en: "TeleFlies" },
        desc: {
          en: "Telegram marketing automation",
          zh: "营销自动化",
        },
        icon: "send",
      },
    ],
  },
  {
    id: "service",
    title: { en: "Service", zh: "服务" },
    accent: "service",
    items: [
      {
        id: "seo",
        label: { en: "SEO", zh: "搜索引擎优化" },
        desc: {
          en: "SEO audits and keyword insights",
          zh: "网站分析与关键词洞察",
        },
        icon: "search",
      },
    ],
  },
  {
    id: "website-designs",
    title: { en: "Website Designs", zh: "网站设计" },
    accent: "gradient",
    items: [
      {
        id: "ai-video",
        label: { en: "AI Video", zh: "视频制作" },
        desc: {
          en: "Brand videos generated with AI",
          zh: "运用 AI 技术制作品牌宣传视频",
        },
        icon: "video",
      },
      {
        id: "ai-ip-video",
        label: { en: "AI IP Video", zh: "形象视频" },
        desc: {
          en: "Bring your characters and IP to life",
          zh: "让您的品牌角色与原创 IP 生动呈现",
        },
        icon: "character",
      },
      {
        id: "ai-drama",
        label: { en: "AI Drama", zh: "短剧制作" },
        desc: {
          en: "AI-produced short drama series",
          zh: "运用 AI 技术制作系列短剧",
        },
        icon: "drama",
      },
      {
        id: "ai-mv",
        label: { en: "AI MV", zh: "音乐视频制作" },
        desc: {
          en: "Music videos powered by AI",
          zh: "运用 AI 技术制作音乐视频",
        },
        icon: "music",
      },
    ],
  },
  {
    id: "platform-creation",
    title: { en: "Platform Creation", zh: "平台搭建" },
    accent: "orange",
    badge: { en: "with Ads Dashboard", zh: "配备广告数据管理后台" },
    items: [
      {
        id: "movie-site",
        label: { en: "Movie Site", zh: "影视平台" },
        tag: { en: "Niuniutv", zh: "Niuniutv" },
        desc: {
          en: "Streaming platform with ad monetization",
          zh: "支持广告变现的在线影视播放平台",
        },
        icon: "screen",
      },
      {
        id: "porn-site",
        label: { en: "Porn Site", zh: "成人平台" },
        desc: {
          en: "Adult content platform with ad monetization",
          zh: "支持广告变现的成人平台",
        },
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
