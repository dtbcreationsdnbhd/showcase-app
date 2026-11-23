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

const SHEET = {
  en: {
    productName: "Product Name",
    keyFeatures: "Key Features",
    whyYouNeedIt: "Why You Need It",
    howWeHelp: "How We Help",
  },
  zh: {
    productName: "产品名称",
    keyFeatures: "核心功能",
    whyYouNeedIt: "为什么您需要它",
    howWeHelp: "我们如何帮助您",
  },
} as const;

export function sheetCopy(locale: Locale) {
  return SHEET[locale];
}

const WHY = {
  en: {
    eyebrow: "WHY CHOOSE",
    title: "VISIONCRAFT?",
    partner: "Your Partner in Digital Advertising, AI & Business Growth.",
    promise: "Smart Solutions. Creative Thinking. Real Opportunities.",
    stats: [
      ["30+", "Professionals"],
      ["100+", "Projects Delivered"],
      ["6+", "Years of Industry Experience"],
    ],
    rows: [
      {
        title: "All-in-One Solutions",
        kicker: "One Partner. Multiple Growth Opportunities.",
        body: "From digital advertising and content production to AI tools, automation, and SEO, we provide integrated solutions that work together to grow your business.",
        tags: ["Advertising & Content", "Tools & Automation"],
      },
      {
        title: "AI-Powered Efficiency",
        kicker: "Work Smarter. Create Faster. Grow Further.",
        body: "Leverage AI to create high-quality content, automate daily operations, and optimize your marketing performance for scalable growth.",
        tags: ["AI Content Creation", "Workflow Automation"],
      },
      {
        title: "Industry-Focused Expertise",
        kicker: "Solutions Built Around Your Industry.",
        body: "With deep understanding of entertainment and iGaming, we deliver targeted marketing, user engagement, and operational solutions that drive real results.",
        tags: ["iGaming & Entertainment", "Market Insights & Growth Strategy"],
      },
    ],
  },
  zh: {
    eyebrow: "为什么选择",
    title: "VISIONCRAFT？",
    partner: "您在数字广告、AI 创新与业务增长领域的可靠合作伙伴。",
    promise: "智能解决方案 · 创新思维 · 商业新机遇",
    stats: [
      ["30+", "专业团队成员"],
      ["100+", "成功交付项目"],
      ["6+", "年行业经验"],
    ],
    rows: [
      {
        title: "一站式整合解决方案",
        kicker: "一个合作伙伴，多元业务增长机遇。",
        body: "从数字广告、创意内容制作，到 AI 智能工具、自动化运营及 SEO 搜索引擎优化，我们提供一站式整合解决方案，协助企业简化运营流程、提升营销效率，并推动业务持续增长。",
        tags: ["广告营销与内容制作", "智能工具与自动化"],
      },
      {
        title: "运用智能AI提升效率",
        kicker: "智能化运营，高效创作，加速增长。",
        body: "运用 AI 技术高效制作优质内容、自动化处理日常运营流程，并优化营销表现，帮助企业降低重复性工作、提升整体效率，为业务规模化发展奠定基础。",
        tags: ["AI 创意内容制作", "工作流程自动化"],
      },
      {
        title: "精准解决需求",
        kicker: "深入了解行业，打造专属解决方案。",
        body: "凭借对娱乐及 iGaming 行业的深入了解，我们根据不同企业的业务需求，提供更具针对性的广告营销、用户互动及运营解决方案，帮助品牌精准触达目标受众、提升用户参与度，并实现更具价值的商业成果。",
        tags: ["iGaming 与娱乐行业", "市场洞察与增长策略"],
      },
    ],
  },
} as const;

export function whyCopy(locale: Locale) {
  return WHY[locale];
}

export function navLabel(locale: Locale, hash: string): string {
  const key = HASH_KEY[hash];
  return key ? NAV[locale][key] : hash;
}

/** Chinese UI face. System faces cover the glyphs when the webfont is unavailable. */
export const CJK_FONT =
  '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

export function viewProjectLabel(locale: Locale): string {
  return locale === "zh" ? "查看项目" : "View Project";
}

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
