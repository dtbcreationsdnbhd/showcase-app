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
