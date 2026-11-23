export const LOCALES = ["en", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_HEADER = "x-locale";
export const PATHNAME_HEADER = "x-pathname";
export const LOCALE_COOKIE = "locale";

const NAV = {
  en: {
    home: "HOME",
    services: "SERVICES/PROJECTS",
    solutions: "SOLUTIONS",
    whyUs: "WHY US",
    faq: "FAQ",
    startProject: "Start a Project",
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  zh: {
    home: "首页",
    services: "服务与项目",
    solutions: "解决方案",
    whyUs: "为什么选择我们",
    faq: "常见问题",
    startProject: "开启合作",
    language: "语言",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
  },
} as const;

type NavHashKey = "home" | "services" | "solutions" | "whyUs" | "faq";

const HASH_KEY: Record<string, NavHashKey> = {
  "#top": "home",
  "#services": "services",
  "#projects": "services",
  "#solutions": "solutions",
  "#why-us": "whyUs",
  "#faq": "faq",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "zh";
}

export function chromeCopy(locale: Locale) {
  return NAV[locale];
}

const HERO = {
  en: {
    lines: [
      { before: "Crafting ", accent: "Vision", after: "," },
      { before: "Empowering ", accent: "Creation", after: "" },
    ],
    body: "Empower your business with next-gen AI-powered tools, video creation, and design assets. From creative content to automated workflows, we craft your vision for commercial success.",
    cta: "Get a Free Consultation",
  },
  zh: {
    lines: [
      { before: "以创意构筑", accent: "远景", after: "，" },
      { before: "以科技创造", accent: "未来", after: "。" },
    ],
    body: "借助新一代 AI 智能工具、视频制作与创意设计解决方案，为您的业务注入全新动力。从创意内容制作到自动化运营，我们致力于将您的商业愿景转化为实际成果，助力品牌提升竞争力，实现业务增长。",
    cta: "立即咨询",
  },
} as const;

export function heroCopy(locale: Locale) {
  return HERO[locale];
}

export function navLabel(locale: Locale, hash: string): string {
  const key = HASH_KEY[hash];
  return key ? NAV[locale][key] : hash;
}

/** Chinese UI face. System faces cover the glyphs when the webfont is unavailable. */
export const CJK_FONT =
  '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

export function stripLocale(pathname: string): string {
  if (pathname === "/zh") return "/";
  if (pathname.startsWith("/zh/")) return pathname.slice(3) || "/";
  return pathname || "/";
}

export function withLocale(pathname: string, locale: Locale): string {
  const bare = stripLocale(pathname);
  if (locale === "en") return bare;
  return bare === "/" ? "/zh" : `/zh${bare}`;
}

/**
 * Prefix for links that jump to a home-page anchor.
 * Empty on the home page itself; `/` or `/zh` from any other page.
 */
export function homeHashPrefix(pathname: string): string {
  if (stripLocale(pathname) === "/") return "";
  return pathname === "/zh" || pathname.startsWith("/zh/") ? "/zh" : "/";
}
