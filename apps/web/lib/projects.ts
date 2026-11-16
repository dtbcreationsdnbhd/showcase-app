import { createClient } from "@supabase/supabase-js";
import type { HeroSlide } from "@/components/landing/HeroCarousel";
import {
  HERO_CATEGORY_ORDER,
  isProjectCategory,
  projectCategoryLabel,
  type ProjectCategory,
} from "@/lib/project-categories";
import { isVideoUrl } from "@/lib/project-media";

const PROJECT_TABLES = ["staging_projects", "production_projects"] as const;

type ProjectTable = (typeof PROJECT_TABLES)[number];

export type ShowcaseProject = {
  id: string;
  name: string;
  category: ProjectCategory | "";
  tags: string[];
  challenge: string;
  solution: string;
  mainImageUrl: string;
  detailImageUrls: string[];
  updatedAt: string;
};

type ProjectRow = {
  id: string;
  name: string;
  category: string | null;
  tags: string[] | null;
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

export function projectToHeroSlide(project: ShowcaseProject): HeroSlide {
  return {
    key: project.id,
    category: project.category
      ? projectCategoryLabel(project.category)
      : "Project",
    title: project.name,
    href: "/projects",
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

  const { data, error } = await supabase
    .from(projectTable())
    .select(
      "id, name, category, tags, challenge, solution, main_image_url, detail_image_urls, updated_at",
    )
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return (data as ProjectRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    category:
      row.category && isProjectCategory(row.category) ? row.category : "",
    tags: row.tags ?? [],
    challenge: row.challenge,
    solution: row.solution,
    mainImageUrl: row.main_image_url,
    detailImageUrls: row.detail_image_urls ?? [],
    updatedAt: row.updated_at,
  }));
}
