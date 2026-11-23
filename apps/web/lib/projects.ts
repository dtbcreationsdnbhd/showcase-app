import { createClient } from "@supabase/supabase-js";
import type { HeroSlide } from "@/components/landing/HeroCarousel";
import type { Locale } from "@/lib/locale";
import {
  HERO_CATEGORY_ORDER,
  isProjectCategory,
  projectCategoryLabel,
  type ProjectCategory,
} from "@/lib/project-categories";
import { isVideoUrl } from "@/lib/project-media";
import { parseProjectFeatures, type ProjectFeature } from "@/lib/project-sheet";

const PROJECT_TABLES = ["staging_projects", "production_projects"] as const;

type ProjectTable = (typeof PROJECT_TABLES)[number];

export type ShowcaseProject = {
  id: string;
  name: string;
  nameZh: string;
  category: ProjectCategory | "";
  tags: string[];
  subtitle: string;
  subtitleZh: string;
  features: ProjectFeature[];
  whyIt: string;
  whyItZh: string;
  howWeHelp: string;
  howWeHelpZh: string;
  ctaText: string;
  ctaTextZh: string;
  footerText: string;
  footerTextZh: string;
  challenge: string;
  solution: string;
  mainImageUrl: string;
  detailImageUrls: string[];
  updatedAt: string;
};

type ProjectRow = {
  id: string;
  name: string;
  name_zh?: string | null;
  category: string | null;
  tags: string[] | null;
  subtitle?: string | null;
  subtitle_zh?: string | null;
  features?: unknown;
  why_it?: string | null;
  why_it_zh?: string | null;
  how_we_help?: string | null;
  how_we_help_zh?: string | null;
  cta_text?: string | null;
  cta_text_zh?: string | null;
  footer_text?: string | null;
  footer_text_zh?: string | null;
  challenge: string;
  solution: string;
  main_image_url: string;
  detail_image_urls: string[] | null;
  updated_at: string;
};

function projectTable(): ProjectTable {
  const name = process.env.NEXT_PUBLIC_PROJECT_TABLE;
  if (name === "staging_projects" || name === "production_projects") {
    return name;
  }

  throw new Error(
    "NEXT_PUBLIC_PROJECT_TABLE must be staging_projects or production_projects.",
  );
}

export function projectTagLine(tags: readonly string[]) {
  return tags.join(" • ");
}

/** Random subset, kept in the original list order. */
export function pickRandomProjects<T>(projects: readonly T[], count = 3): T[] {
  if (projects.length <= count) return [...projects];

  const indexes = projects.map((_, index) => index);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  return indexes
    .slice(0, count)
    .sort((a, b) => a - b)
    .map((index) => projects[index]);
}

/**
 * Hero picks: one project per top category (when available), then fill
 * from the rest so we still get up to `count` cards.
 */
export function pickHeroProjects(
  projects: readonly ShowcaseProject[],
  count = 3,
): ShowcaseProject[] {
  if (projects.length === 0) return [];

  const picked: ShowcaseProject[] = [];
  const used = new Set<string>();

  for (const category of HERO_CATEGORY_ORDER) {
    if (picked.length >= count) break;
    const hit = projects.find(
      (project) => project.category === category && !used.has(project.id),
    );
    if (!hit) continue;
    picked.push(hit);
    used.add(hit.id);
  }

  for (const project of projects) {
    if (picked.length >= count) break;
    if (used.has(project.id)) continue;
    picked.push(project);
    used.add(project.id);
  }

  return picked;
}

function pickZh(zh: string, en: string) {
  const text = zh.trim();
  return text || en;
}

/** Chinese page uses zh fields when they are filled, and the English field otherwise. */
export function localizeProject(
  project: ShowcaseProject,
  locale: Locale,
): ShowcaseProject {
  if (locale !== "zh") return project;
  return {
    ...project,
    name: pickZh(project.nameZh, project.name),
    subtitle: pickZh(project.subtitleZh, project.subtitle),
    whyIt: pickZh(project.whyItZh, project.whyIt),
    howWeHelp: pickZh(project.howWeHelpZh, project.howWeHelp),
    ctaText: pickZh(project.ctaTextZh, project.ctaText),
    footerText: pickZh(project.footerTextZh, project.footerText),
    features: project.features.map((feature) => ({
      ...feature,
      label: pickZh(feature.labelZh ?? "", feature.label),
    })),
  };
}

export function localizeProjects(
  projects: readonly ShowcaseProject[],
  locale: Locale,
): ShowcaseProject[] {
  return locale === "zh" ? projects.map((project) => localizeProject(project, locale)) : [...projects];
}

export function projectToHeroSlide(
  project: ShowcaseProject,
  locale: Locale = "en",
): HeroSlide {
  return {
    key: project.id,
    category: project.category
      ? projectCategoryLabel(project.category, locale)
      : locale === "zh"
        ? "项目"
        : "Project",
    title: project.name,
    href: locale === "zh" ? "/zh/projects" : "/projects",
    details: locale === "zh" ? "查看详情 ↗" : "View Details ↗",
    src: project.mainImageUrl || null,
    isVideo: Boolean(project.mainImageUrl && isVideoUrl(project.mainImageUrl)),
  };
}

/**
 * Detail popup gallery: main first, then optional details.
 * One frame — auto-slides when there is more than one item.
 */
export function projectGalleryMedia(project: ShowcaseProject): {
  media: string[];
} {
  const media = [project.mainImageUrl, ...project.detailImageUrls].filter(
    (url, index, list) => Boolean(url) && list.indexOf(url) === index,
  );

  return { media };
}

export async function listProjects(): Promise<ShowcaseProject[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Check apps/web/.env.",
    );
  }

  const supabase = createClient(url, key, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });

  const baseColumns =
    "id, name, category, tags, challenge, solution, main_image_url, detail_image_urls, updated_at";
  const sheetColumns =
    "subtitle, features, why_it, how_we_help, cta_text, footer_text";
  const zhColumns =
    "name_zh, subtitle_zh, why_it_zh, how_we_help_zh, cta_text_zh, footer_text_zh";
  const table = projectTable();
  const listed = await supabase
    .from(table)
    .select(`${baseColumns}, ${sheetColumns}, ${zhColumns}`)
    .order("created_at", { ascending: true });
  const withoutZh = listed.error
    ? await supabase
        .from(table)
        .select(`${baseColumns}, ${sheetColumns}`)
        .order("created_at", { ascending: true })
    : null;
  const fallback =
    listed.error && withoutZh?.error
      ? await supabase.from(table).select(baseColumns).order("created_at", { ascending: true })
      : null;
  const data = listed.error
    ? withoutZh?.error
      ? fallback?.data
      : withoutZh?.data
    : listed.data;
  const error = listed.error ? (withoutZh?.error ? fallback?.error : null) : null;

  if (error || !data) return [];

  return (data as ProjectRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    nameZh: row.name_zh ?? "",
    category:
      row.category && isProjectCategory(row.category) ? row.category : "",
    tags: row.tags ?? [],
    subtitle: row.subtitle ?? "",
    subtitleZh: row.subtitle_zh ?? "",
    features: parseProjectFeatures(row.features),
    whyIt: row.why_it ?? "",
    whyItZh: row.why_it_zh ?? "",
    howWeHelp: row.how_we_help ?? "",
    howWeHelpZh: row.how_we_help_zh ?? "",
    ctaText: row.cta_text ?? "",
    ctaTextZh: row.cta_text_zh ?? "",
    footerText: row.footer_text ?? "",
    footerTextZh: row.footer_text_zh ?? "",
    challenge: row.challenge,
    solution: row.solution,
    mainImageUrl: row.main_image_url,
    detailImageUrls: row.detail_image_urls ?? [],
    updatedAt: row.updated_at,
  }));
}
