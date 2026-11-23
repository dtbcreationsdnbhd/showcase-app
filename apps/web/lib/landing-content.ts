/**
 * Copy shared between the desktop and mobile trees. The footer sets it as one
 * line; the mobile menu breaks it where the design does.
 */
export const COPYRIGHT_LINES = [
  "© Copyright 2026,",
  "All Rights Reserved by VisionCraft",
] as const;

export const COPYRIGHT_TEXT = COPYRIGHT_LINES.join(" ");

export const SOLUTIONS_TITLE_WORDS = ["Targeted", "Solutions"] as const;
export const SOLUTIONS_SUBTITLE = "for your business growth.";

/** Desktop runs the two sentences together; mobile breaks between them. */
export const SOLUTIONS_INTRO_SENTENCES = [
  "We provide precise, scalable digital services designed to solve your operational bottlenecks.",
  "Choose the tools you need to streamline your workflow and drive conversions.",
] as const;

export const SOLUTIONS_INTRO_TEXT = SOLUTIONS_INTRO_SENTENCES.join(" ");

export const SHOWCASE_TITLE = "Project Showcase";

/** Desktop keeps the title on one nowrap line; mobile stacks the two halves. */
export const CTA_TITLE_LINES = [
  "Ready to Scale?",
  "Connect with Our Team",
] as const;

export const CTA_TITLE = CTA_TITLE_LINES.join(" ");

/** Both trees break between the two halves. */
export const CTA_BODY_LINES = [
  "Whether you need to automate workflows, build custom systems, or launch high-converting digital assets,",
  "we are here to turn your bottlenecks into measurable revenue.",
] as const;

export const CTA_BUTTON_LABEL = "Get in touch with us";

export const FORM_SERVICES_TITLE = "Services";
export const FORM_SERVICES_HINT = "You may select multiple services";

export const FORM_SERVICES = [
  "AI IP Management (Lifestyle)",
  "AI IP Management (Script)",
  "AI Music Video",
  "AI Video 30s",
  "AI Drama Series",
  "Porn Site Setup",
  "Movie / TV Site Setup",
  "Other",
] as const;

export const FORM_BUDGET_TITLE = "Budget";

export const FORM_BUDGETS = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000+",
  "Monthly retainer",
] as const;

export const FORM_CYCLE_TITLE = "Project Cycle";

export const FORM_CYCLES = [
  "2-3 Months",
  "6-12 Months",
  "Ongoing Work",
  "Other",
] as const;

export const FORM_REACH_TITLE = "Reach out to us";
export const FORM_REACH_INTRO =
  "Fill up and submit the form below. We will respond to you within 12 hours.";

export const FORM_CONVO_TITLE = "Start a Conversation";
export const FORM_CONVO_INTRO =
  "Tell us what you need. We'll help you explore the right solution.";
export const FORM_CONVO_NAME = "Your Name";
export const FORM_CONVO_NAME_PLACEHOLDER = "Enter your name";
export const FORM_CONVO_TELEGRAM = "Telegram";
export const FORM_CONVO_TELEGRAM_PLACEHOLDER = "Enter your Telegram username";
export const FORM_CONVO_SERVICE = "What Service Are You Interested In?";
export const FORM_CONVO_SERVICE_PLACEHOLDER = "Enter a service";
export const FORM_CONVO_EXTRA = "Additional Details";
export const FORM_CONVO_OPTIONAL = "(Optional)";
export const FORM_CONVO_COMPANY = "Company / Brand Name";
export const FORM_CONVO_COMPANY_PLACEHOLDER = "Your business or brand name";
export const FORM_CONVO_MARKET = "Target Market / Region";
export const FORM_CONVO_MARKET_PLACEHOLDER = "Enter your target market";
export const FORM_CONVO_NEEDS = "Tell Us More About Your Needs";
export const FORM_CONVO_NEEDS_PLACEHOLDER =
  "Tell us about your business goals, ideas or questions...";
export const FORM_CONVO_SUBMIT = "Let's Talk Business";

export const FORM_FIELDS = [
  { label: "Full Name", required: true },
  { label: "Email or Telegram", required: true },
  { label: "What are you looking to build?", required: true },
  { label: "Tell us more about your project", required: false },
] as const;

export const FORM_SUBMIT_LABEL = "Submit Inquiry";

export const FORM_TALK_TITLE = "Let's Talk Business.";
export const FORM_TALK_INTRO =
  "Get the right digital solutions for your iGaming needs — from advertising to AI and automation.";
export const FORM_TALK_POINTS = [
  {
    title: "Fast Response",
    body: "We'll get back to you within 12 hours.",
  },
  {
    title: "Expert Support",
    body: "A dedicated team with iGaming experience.",
  },
  {
    title: "Tailored Solutions",
    body: "Built around your goals and business needs.",
  },
] as const;
export const FORM_TALK_CONNECT = "Connect With Us Directly";
export function formCopy(locale: "en" | "zh") {
  if (locale === "zh") {
    return {
      talkTitle: "让我们聊聊您的业务！",
      talkIntro:
        "寻找合适的广告与数字化解决方案？我们的团队随时准备了解您的需求。",
      points: [
        { title: "快速回应", body: "我们将在 12 小时内回复您的咨询。" },
        {
          title: "专业团队支持",
          body: "拥有 iGaming 行业经验的专业团队，为您提供专属支持。",
        },
        {
          title: "量身定制的解决方案",
          body: "根据您的业务目标与实际需求，量身打造合适的解决方案。",
        },
      ],
      connect: "直接联系我们",
      telegram: "Telegram",
      convoTitle: "开启商务对话",
      convoIntro: "告诉我们您的需求，让我们为您寻找合适的解决方案",
      name: "您的姓名",
      namePlaceholder: "请输入您的姓名",
      contact: "联系方式",
      contactPlaceholder: "请输入您的 Telegram 用户名",
      service: "您感兴趣的服务类型是？",
      servicePlaceholder: "暂时还不确定",
      extra: "补充信息",
      optional: "（选填）",
      company: "公司 / 品牌名称",
      companyPlaceholder: "请输入您的企业或品牌名称",
      market: "目标市场 / 地区",
      marketPlaceholder: "请选择您的目标市场",
      needs: "请进一步描述您的需求",
      needsPlaceholder: "请告诉我们您的业务目标、想法或任何疑问……",
      submit: "洽谈合作",
      submitting: "提交中…",
      submitted: "已提交。我们将在 12 小时内回复您。",
      required: "请填写必填项。",
    };
  }

  return {
    talkTitle: FORM_TALK_TITLE,
    talkIntro: FORM_TALK_INTRO,
    points: FORM_TALK_POINTS,
    connect: FORM_TALK_CONNECT,
    telegram: "Telegram",
    convoTitle: FORM_CONVO_TITLE,
    convoIntro: FORM_CONVO_INTRO,
    name: FORM_CONVO_NAME,
    namePlaceholder: FORM_CONVO_NAME_PLACEHOLDER,
    contact: FORM_CONVO_TELEGRAM,
    contactPlaceholder: FORM_CONVO_TELEGRAM_PLACEHOLDER,
    service: FORM_CONVO_SERVICE,
    servicePlaceholder: FORM_CONVO_SERVICE_PLACEHOLDER,
    extra: FORM_CONVO_EXTRA,
    optional: FORM_CONVO_OPTIONAL,
    company: FORM_CONVO_COMPANY,
    companyPlaceholder: FORM_CONVO_COMPANY_PLACEHOLDER,
    market: FORM_CONVO_MARKET,
    marketPlaceholder: FORM_CONVO_MARKET_PLACEHOLDER,
    needs: FORM_CONVO_NEEDS,
    needsPlaceholder: FORM_CONVO_NEEDS_PLACEHOLDER,
    submit: FORM_CONVO_SUBMIT,
    submitting: "Submitting...",
    submitted: "Submitted. We will respond within 12 hours.",
    required: "Please fill in the required fields.",
  };
}

export const FORM_TELEGRAM_LABEL = "Telegram";
/** Opens Telegram until a specific handle is set. */
export const FORM_TELEGRAM_URL = "https://t.me/";

/** Desktop has room for the long version; the mobile frame does not. */
export const PROCESS_TITLE = "Our Proven Delivery Process.";
export const PROCESS_TITLE_SHORT = "Our Process";

/** Desktop breaks between the two sentences; mobile lets them wrap. */
export const PROCESS_INTRO_SENTENCES = [
  "Transparency and efficiency at every stage.",
  "Here is how we turn your business bottlenecks into automated solutions.",
] as const;
export const PROCESS_INTRO_TEXT = PROCESS_INTRO_SENTENCES.join(" ");

export type ProcessStepImage = "step01" | "step02" | "step03" | "step04";

/** The artwork is a full card: number, illustration and title are all baked
 *  into the PNG, so `title` is only ever used as the accessible name. */
export const PROCESS_STEPS: {
  n: string;
  image: ProcessStepImage;
  title: string;
  description: string;
}[] = [
  {
    n: "01",
    image: "step01",
    title: "Discovery & Architecture",
    description:
      "We start by understanding your core objectives. We assess your digital needs and design a tailored technical blueprint that aligns perfectly with your business goals.",
  },
  {
    n: "02",
    image: "step02",
    title: "Agile Engineering",
    description:
      "We build your custom systems, bots, or apps using modern tech stacks. You get regular milestone updates so you are always in control—no surprises.",
  },
  {
    n: "03",
    image: "step03",
    title: "Stress-Testing & Launch",
    description:
      "Before going live, we rigorously test your system for security and performance. We handle cloud deployment to ensure a smooth, crash-free launch even under high traffic.",
  },
  {
    n: "04",
    image: "step04",
    title: "Tracking & Scaling",
    description:
      "Launching is just the beginning. We integrate your data tracking (GTM/Pixel) and hand over a fully-equipped system ready to capture leads and scale.",
  },
];

export const WHY_US_TITLE = "Why Us";

export const WHY_US_INTRO_SENTENCES = [
  "A focused team, a modern stack and years of shipping.",
  "Here is what you get when you build with us.",
] as const;

export type WhyUsImage = "why01" | "why02" | "why03";

/** Desktop Why Us cards: the illustration has no text, so number and title
 *  are drawn over it. */
export const WHY_US_ITEMS: {
  n: string;
  image: WhyUsImage;
  title: string;
  description: string;
}[] = [
  {
    n: "01",
    image: "why01",
    title: "Company Size",
    description:
      "A dedicated team of designers, engineers and strategists. Big enough to run several workstreams at once, small enough that you always talk to the people doing the work.",
  },
  {
    n: "02",
    image: "why02",
    title: "Technology",
    description:
      "Modern stacks, AI-powered workflows and cloud infrastructure. We pick proven tools that keep your product fast, secure and easy to scale.",
  },
  {
    n: "03",
    image: "why03",
    title: "Experience",
    description:
      "Years of shipping tools, platforms and AI content for clients across industries. We have solved most problems before, so your project moves without surprises.",
  },
];

export type ServiceIconKey = "ai" | "web" | "star" | "refresh";

export type ServiceCopy = {
  title: string;
  description: string;
};

/** One icon per page, two services under it. Desktop scrubs between the pages;
 *  mobile stacks them. */
export const SERVICE_ROWS: {
  icon: ServiceIconKey;
  alt: string;
  services: [ServiceCopy, ServiceCopy];
}[] = [
  {
    icon: "ai",
    alt: "AI",
    services: [
      {
        title: "Telegram Bot Integration",
        description:
          "Automate replies and capture leads instantly. Never miss a business opportunity.",
      },
      {
        title: "AI Chatbot & Automation",
        description:
          "Deploy 24/7 AI chatbots to answer queries and guide traffic straight to sales.",
      },
    ],
  },
  {
    icon: "web",
    alt: "Web",
    services: [
      {
        title: "Custom Landing Pages & Web",
        description:
          "Fast-loading landing pages designed with one goal: turning visitors into paying clients.",
      },
      {
        title: "Cloud Hosting & Domain Setup",
        description:
          "Reliable hosting to ensure your business stays fast, secure, and online during traffic spikes.",
      },
    ],
  },
  {
    icon: "star",
    alt: "Custom systems",
    services: [
      {
        title: "Custom Dashboard & System",
        description:
          "Secure, intuitive dashboards. Gain full control and visibility over your core operations.",
      },
      {
        title: "Custom Mobile Apps",
        description:
          "Seamless custom mobile apps. We handle everything from UI design to Play Store launch.",
      },
    ],
  },
  {
    icon: "refresh",
    alt: "Automation",
    services: [
      {
        title: "Data Tracking & Pixel Integration",
        description:
          "Stop guessing. We track every conversion perfectly so you can optimize your ad spend.",
      },
      {
        title: "Task Automation Scripting",
        description:
          "Replace manual and repetitive tasks with smart scripts. Streamline your operations, reduce human error, and save valuable time.",
      },
    ],
  },
];

export const FAQ_TITLE = "FAQ";
export const FAQ_SUBTITLE = "Answers to the questions we hear most.";

export type FaqItem = {
  question: string;
  /** Paragraph before the list, or the whole answer when there is no list. */
  answer?: string;
  /** Bulleted points; `label` is set in bold before the text. */
  points?: readonly { label: string; text: string }[];
};

export type FaqGroup = {
  title: string;
  items: readonly FaqItem[];
};

const FAQ_GROUPS_ZH: readonly FaqGroup[] = [
  {
    title: "综合",
    items: [
      {
        question: "VisionCraft 提供哪些服务？",
        answer:
          "VisionCraft 提供数字广告投放、AI 创意内容制作、营销自动化、SEO 搜索引擎优化及广告平台搭建等服务。我们致力于帮助企业提升品牌曝光、简化营销流程，并发掘更多业务增长机会。",
      },
      {
        question: "哪些企业适合使用 VisionCraft 的解决方案？",
        answer:
          "我们的服务适用于希望提升数字营销表现的企业、品牌商、广告主及平台运营商。我们尤其专注于娱乐及 iGaming 行业，同时也为其他行业提供数字营销与创意解决方案。",
      },
      {
        question: "VisionCraft 可以根据我的业务需求提供定制化方案吗？",
        answer:
          "可以。我们了解不同企业拥有不同的营销目标与业务需求，因此会根据您的项目要求，推荐合适的广告渠道、创意制作服务及数字化工具。",
      },
      {
        question: "VisionCraft 的服务收费是多少？",
        answer:
          "服务价格会根据所选择的项目、服务范围、广告投放位置及具体需求而有所不同。欢迎联系我们的团队，说明您的需求并获取专属报价。",
      },
      {
        question: "如何开始与 VisionCraft 合作？",
        answer:
          "您可以通过网站联系表单、Telegram 与我们联系。只需简单介绍您的业务目标及感兴趣的服务，我们的团队便会协助您了解合适的解决方案与后续合作流程。",
      },
    ],
  },
  {
    title: "广告投放",
    items: [
      {
        question: "VisionCraft 如何帮助我的品牌提升曝光度？",
        answer:
          "我们提供影视、流媒体及成人娱乐网站等不同渠道的广告投放机会，帮助品牌触达相关受众、扩大广告覆盖范围，并探索更多营销推广渠道。",
      },
      {
        question: "我可以查看广告投放的表现数据吗？",
        answer:
          "可以。对于支持数据追踪的广告位，我们提供可获取的流量、观看及用户互动数据，帮助您了解广告曝光情况，并为后续营销决策提供参考。",
      },
    ],
  },
  {
    title: "AI 创意",
    items: [
      {
        question: "VisionCraft 提供哪些 AI 创意制作服务？",
        answer:
          "我们提供 AI 宣传视频、品牌角色视频、AI 短剧、音乐视频及音频制作等服务，帮助企业打造更具吸引力的营销内容、传达品牌信息，并增强品牌辨识度。",
      },
    ],
  },
  {
    title: "TeleFlies 与 SEO",
    items: [
      {
        question: "TeleFlies 如何帮助企业管理 Telegram 营销？",
        answer:
          "TeleFlies 通过专属机器人、自动回复、定时群发及联系人管理，帮助企业简化 Telegram 日常运营。同时，平台提供可获取的互动数据，协助企业更有效地管理营销活动与受众互动。",
      },
      {
        question: "VisionCraft 的 SEO 服务如何帮助提升网站流量？",
        answer:
          "我们通过关键词研究、网站页面优化、内容创作及外链建设，帮助企业提升 Google 搜索曝光度，吸引更多相关自然流量。结合定制化策略、专业顾问咨询及每周数据报告，协助企业实现长期搜索增长，并逐步降低对付费广告的依赖。",
      },
    ],
  },
];

export function faqCopy(locale: "en" | "zh") {
  if (locale === "zh") {
    return {
      title: "FAQ",
      subtitle: "VISIONCRAFT · 常见问题",
      topicsLabel: "常见问题分类",
      groups: FAQ_GROUPS_ZH,
    };
  }
  return {
    title: FAQ_TITLE,
    subtitle: FAQ_SUBTITLE,
    topicsLabel: "FAQ topics",
    groups: FAQ_GROUPS,
  };
}

export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    title: "General",
    items: [
      {
        question: "What services does VisionCraft offer?",
        answer:
          "VisionCraft provides digital advertising, AI-powered content creation, marketing automation, SEO solutions, and advertising platform development. Our services help businesses increase brand visibility, streamline marketing operations, and explore new growth opportunities.",
      },
      {
        question: "Who can benefit from VisionCraft's solutions?",
        answer:
          "Our solutions are designed for businesses, brands, advertisers, and operators looking to improve their digital marketing performance. We have a particular focus on the entertainment and iGaming industries, while also supporting businesses across other sectors.",
      },
      {
        question: "Can VisionCraft customize solutions for my business?",
        answer:
          "Yes. We understand that every business has different objectives and marketing needs. Our team can recommend suitable advertising channels, creative services, and digital tools based on your goals and project requirements.",
      },
      {
        question: "How much do VisionCraft's services cost?",
        answer:
          "Pricing depends on the selected services, project scope, advertising placements, and specific requirements. Contact our team to discuss your needs and receive a tailored quotation.",
      },
      {
        question: "How do I get started with VisionCraft?",
        answer:
          "Simply submit an inquiry through our contact form or reach out via Telegram. Share your business goals and the services you're interested in, and our team will help you explore suitable solutions and the next steps.",
      },
    ],
  },
  {
    title: "Advertising",
    items: [
      {
        question: "How can VisionCraft help increase my brand's visibility?",
        answer:
          "We offer advertising placements across entertainment and niche-content websites, including movie, streaming, and adult entertainment platforms. These channels help brands reach relevant audiences, expand their advertising exposure, and discover new marketing opportunities.",
      },
      {
        question: "Can I track the performance of my advertising campaigns?",
        answer:
          "Yes. For supported advertising placements, we provide access to available traffic, viewing, and engagement insights. These insights help you better understand your campaign's visibility and make more informed marketing decisions.",
      },
    ],
  },
  {
    title: "AI Creative",
    items: [
      {
        question: "What AI creative services does VisionCraft provide?",
        answer:
          "We offer AI-assisted promotional videos, branded character videos, short dramas, music videos, and audio production. These services help businesses create engaging marketing content, communicate brand messages, and strengthen brand recognition.",
      },
    ],
  },
  {
    title: "TeleFlies & SEO",
    items: [
      {
        question: "How can TeleFlies improve my Telegram marketing?",
        answer:
          "TeleFlies helps businesses manage Telegram marketing through customized bots, automated replies, scheduled broadcasts, and contact management. It simplifies daily operations and provides available interaction insights to support better audience engagement.",
      },
      {
        question: "How can VisionCraft's SEO services help grow my website traffic?",
        answer:
          "Our SEO services help improve your Google visibility and attract relevant organic traffic through keyword research, on-page optimization, content creation, and backlink building. With tailored strategies, expert consultation, and weekly reports, we support long-term search growth and help reduce reliance on paid advertising.",
      },
    ],
  },
];
