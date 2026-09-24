/**
 * Copy shared between the desktop and mobile trees. The footer sets it as one
 * line; the mobile menu breaks it where the design does.
 */
export const COPYRIGHT_LINES = [
  "© Copyright 2026,",
  "All Rights Reserved by Apex Digital Solutions",
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

export const PROJECTS = [
  {
    title: "Teleflies",
    description: "SaaS Platform • Telegram Bot • Automation",
  },
  {
    title: "TrackSpend",
    description: "Custom Dashboard • AdTech & Marketing • Data...",
  },
  {
    title: "Ad Spend Markup Generator",
    description: "Desktop Utility • White-Label Reporting • Agen...",
  },
] as const;

export type ProjectDetail = {
  name: string;
  tags: string[];
  challenge: string;
  solution: string;
};

const SHARED_CHALLENGE =
  "Getting users to register is only half the battle. Without constant engagement, they forget your brand, and you lose repeat business.";
const SHARED_SOLUTION =
  "Teleflies automates user engagement. With targeted mass broadcasting and real-time alerts, it brings dormant users back to your platform.";

/** Keyed by the card title. A trailing "..." marks a tag the desktop layout
 *  pushes onto its own row. */
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  Teleflies: {
    name: "Teleflies: Telegram Automation Ecosystem",
    tags: ["SaaS Platform", "Telegram Bot", "Automation"],
    challenge: SHARED_CHALLENGE,
    solution: SHARED_SOLUTION,
  },
  TrackSpend: {
    name: "TrackSpend",
    tags: ["Custom Dashboard", "AdTech & Marketing", "Data..."],
    challenge: SHARED_CHALLENGE,
    solution: SHARED_SOLUTION,
  },
  "Ad Spend Markup Generator": {
    name: "Ad Spend Markup Generator",
    tags: ["Desktop Utility", "White-Label Reporting", "Agen..."],
    challenge: SHARED_CHALLENGE,
    solution: SHARED_SOLUTION,
  },
};

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
