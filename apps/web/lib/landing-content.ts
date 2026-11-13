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
  "Branding Design",
  "Design System",
  "Product Design",
  "Website Design",
  "Other Services",
] as const;

export const FORM_BUDGET_TITLE = "Budget";

export const FORM_BUDGETS = [
  "$10.000 - $20.000",
  "$20.000 - $50.000",
  "$50.000 - $100.000",
  "> $100.000",
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

export const FORM_FIELDS = [
  { label: "Full Name", required: true },
  { label: "Email or Telegram", required: true },
  { label: "What are you looking to build?", required: true },
  { label: "Tell us more about your project", required: false },
] as const;

export const FORM_SUBMIT_LABEL = "Submit Inquiry";

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

export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    title: "General",
    items: [
      {
        question: "What is VisionCraft and what services do you provide?",
        answer:
          "VisionCraft is an AI-powered digital creation and marketing solution platform designed to streamline content production, boost online visibility, and drive commercial success. Our service suite includes:",
        points: [
          {
            label: "AI Tools",
            text: "Next-gen tools like TeleFlies (social content automation) and FindSEO (search optimization).",
          },
          {
            label: "AI Design & Video Production",
            text: "High-end visual solutions including AI Commercial Video, AI Digital Human / IP Video, AI Drama (with in-scene ad placement), and AI Music Videos.",
          },
          {
            label: "Platform Creation",
            text: "Full turnkey web platform development (such as streaming and niche entertainment sites) complete with built-in Ads Dashboards for instant monetization.",
          },
        ],
      },
      {
        question: "Who can benefit from using VisionCraft’s tools and solutions?",
        answer: "Our solutions are built for:",
        points: [
          {
            label: "Digital Marketers & Brands",
            text: "Looking to scale visual content quickly without traditional studio production budgets.",
          },
          {
            label: "Content Creators & Agencies",
            text: "Seeking automated workflows for social media, SEO analytics, and video editing.",
          },
          {
            label: "Platform Operators & Entrepreneurs",
            text: "Planning to launch, manage, and monetize content streaming platforms (like movie or entertainment sites) with integrated ad networks.",
          },
        ],
      },
    ],
  },
  {
    title: "AI Tools & SEO",
    items: [
      {
        question: "What is TeleFlies and how does it assist with content management?",
        answer:
          "TeleFlies is an AI-driven tool built for automated social content creation and workflow enhancement. It helps users draft engaging captions, structure campaign messaging, and schedule content publishing efficiently—reducing manual social media management effort while maintaining brand consistency across channels.",
      },
      {
        question: "How does FindSEO help improve my website’s search engine rankings?",
        answer:
          "FindSEO uses AI analytics to discover high-volume keywords, optimize on-page content structures, and analyze competitor strategies. It delivers actionable insights to increase organic search traffic, elevate domain authority, and secure higher rankings on search engine result pages.",
      },
    ],
  },
  {
    title: "AI Video & Design",
    items: [
      {
        question: "What is the difference between standard AI Video and AI IP Video creation?",
        points: [
          {
            label: "Standard AI Video",
            text: "Generates cinematic, general-purpose commercial visuals, promotional clips, and motion graphics based on text or visual prompts.",
          },
          {
            label: "AI IP Video",
            text: "Focuses on creating and animating a custom digital persona or brand mascot (Intellectual Property). This allows you to generate consistent human-like presenters or avatar-driven video series repeatedly without re-hiring actors or crew.",
          },
        ],
      },
      {
        question: "How does AI Drama work, and how are in-scene ads integrated?",
        answer:
          "AI Drama utilizes AI scriptwriting and scene rendering to produce narrative-driven short-form drama series rapidly. During production, we integrate In-Scene Ads by digitally placing brand product images, banner placements, or sponsored props seamlessly into the video environment itself—creating monetization opportunities without disrupting the viewer experience.",
      },
      {
        question: "Can I commission custom AI MV (Music Video) production for my brand?",
        answer:
          "Yes! Our AI MV service blends AI audio-visual sync with stylised animations and visual effects. Whether for a product launch soundtrack, brand anthem, or artistic promotional campaign, we can produce high-impact, custom music videos tailored to your brand identity.",
      },
    ],
  },
  {
    title: "Platform Creation & Ads Dashboard",
    items: [
      {
        question: "What is included in your Platform Creation service with the Ads Dashboard?",
        answer: "Our Platform Creation package offers an end-to-end web deployment solution:",
        points: [
          {
            label: "Custom Frontend & Backend Architecture",
            text: "Fully responsive, high-speed UI tailored to your niche.",
          },
          {
            label: "Integrated Media Streaming / Content Systems",
            text: "Optimized for low-latency playback.",
          },
          {
            label: "Ads Dashboard",
            text: "A centralized management hub that lets you insert banner ads, video pre-roll/post-roll ads, or pop-ups, track impression metrics, and monitor revenue payouts in real-time.",
          },
        ],
      },
      {
        question: "Can VisionCraft build custom streaming platforms like Niuniutv or niche entertainment sites?",
        answer:
          "Absolutely. We build scalable streaming architectures modeled after popular media platforms like Niuniutv as well as specialized niche entertainment portals. Each platform comes fully equipped with user management, category tagging, video hosting compatibility, and ad integration ready for immediate deployment.",
      },
      {
        question: "How do I get started with a project or request a free consultation?",
        answer:
          "You can get started by clicking the \"Start a Project\" or \"Get a Free Consultation\" button on our website navigation bar. Fill out the short inquiry form with your project scope, and our team will get back to you within 24 hours with a tailored strategy and custom price quote.",
      },
    ],
  },
];
