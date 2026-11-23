import { createClient } from "@/lib/supabase/server";

import {
  isProjectCategory,
  type ProjectCategory,
} from "@/lib/project-categories";
import {
  PROJECT_PAGE_SIZE,
  isPageSize,
} from "@/lib/project-filters";
import {
  parseProjectFeatures,
  type ProjectFeature,
} from "@/lib/project-sheet";

export {
  PROJECT_PAGE_SIZE,
  PROJECT_PAGE_SIZES,
  isPageSize,
  projectPageHref,
} from "@/lib/project-filters";

export {
  PROJECT_CATEGORIES,
  isProjectCategory,
  projectCategoryLabel,
  type ProjectCategory,
} from "@/lib/project-categories";

const PROJECT_TABLES = ["staging_projects", "production_projects"] as const;

export type ProjectTable = (typeof PROJECT_TABLES)[number];

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
  createdAt: string;
  updatedAt: string;
};

export type ProjectList =
  | {
      ok: true;
      rows: ShowcaseProject[];
      total: number;
      page: number;
      pageSize: number;
    }
  | { ok: false; message: string };

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
  created_at: string;
  updated_at: string;
};

const PROJECT_COLUMNS =
  "id, name, category, tags, challenge, solution, main_image_url, detail_image_urls, created_at, updated_at";

const SHEET_COLUMNS =
  "subtitle, features, why_it, how_we_help, cta_text, footer_text";

const ZH_COLUMNS =
  "name_zh, subtitle_zh, why_it_zh, how_we_help_zh, cta_text_zh, footer_text_zh";

export function projectTable(): ProjectTable {
  const name = process.env.NEXT_PUBLIC_PROJECT_TABLE;
  if (name === "staging_projects" || name === "production_projects") {
    return name;
  }

  throw new Error(
    "NEXT_PUBLIC_PROJECT_TABLE must be staging_projects or production_projects.",
  );
}

export async function listProjects({
  query,
  page,
  pageSize = PROJECT_PAGE_SIZE,
}: {
  query: string;
  page: number;
  pageSize?: number;
}): Promise<ProjectList> {
  let table: ProjectTable;
  try {
    table = projectTable();
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Missing project table setting.",
    };
  }

  const supabase = await createClient();
  const listed = await supabase
    .from(table)
    .select(`${PROJECT_COLUMNS}, ${SHEET_COLUMNS}, ${ZH_COLUMNS}`)
    .order("created_at", { ascending: false });
  const withoutZh = listed.error
    ? await supabase
        .from(table)
        .select(`${PROJECT_COLUMNS}, ${SHEET_COLUMNS}`)
        .order("created_at", { ascending: false })
    : null;
  const fallback =
    listed.error && withoutZh?.error
      ? await supabase
          .from(table)
          .select(PROJECT_COLUMNS)
          .order("created_at", { ascending: false })
      : null;
  const data = listed.error
    ? withoutZh?.error
      ? fallback?.data
      : withoutZh?.data
    : listed.data;
  const error = listed.error
    ? withoutZh?.error
      ? fallback?.error
      : null
    : null;

  if (error) {
    return {
      ok: false,
      message: `Could not load projects. ${error.message}`,
    };
  }

  const needle = query.trim().toLowerCase();
  const matched = ((data ?? []) as ProjectRow[])
    .map(toProject)
    .filter((row) => {
      if (needle && !projectSearchText(row).includes(needle)) return false;
      return true;
    });
  const size = isPageSize(pageSize) ? pageSize : PROJECT_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(matched.length / size));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * size;

  return {
    ok: true,
    rows: matched.slice(start, start + size),
    total: matched.length,
    page: safePage,
    pageSize: size,
  };
}

const PROJECT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getProject(
  id: string,
): Promise<
  | { ok: true; project: ShowcaseProject }
  | { ok: false; message: string }
> {
  if (!PROJECT_ID.test(id)) {
    return { ok: false, message: "Project not found." };
  }

  let table: ProjectTable;
  try {
    table = projectTable();
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Missing project table setting.",
    };
  }

  const supabase = await createClient();
  const loaded = await supabase
    .from(table)
    .select(`${PROJECT_COLUMNS}, ${SHEET_COLUMNS}, ${ZH_COLUMNS}`)
    .eq("id", id)
    .maybeSingle();
  const withoutZh = loaded.error
    ? await supabase
        .from(table)
        .select(`${PROJECT_COLUMNS}, ${SHEET_COLUMNS}`)
        .eq("id", id)
        .maybeSingle()
    : null;
  const fallback =
    loaded.error && withoutZh?.error
      ? await supabase.from(table).select(PROJECT_COLUMNS).eq("id", id).maybeSingle()
      : null;
  const data = loaded.error
    ? withoutZh?.error
      ? fallback?.data
      : withoutZh?.data
    : loaded.data;
  const error = loaded.error
    ? withoutZh?.error
      ? fallback?.error
      : null
    : null;

  if (error) {
    return { ok: false, message: `Could not load the project. ${error.message}` };
  }

  if (!data) {
    return { ok: false, message: "Project not found." };
  }

  return { ok: true, project: toProject(data as ProjectRow) };
}

function toProject(row: ProjectRow): ShowcaseProject {
  return {
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function projectSearchText(row: ShowcaseProject) {
  return [
    row.name,
    row.nameZh,
    row.category,
    row.tags.join(" "),
    row.subtitle,
    row.subtitleZh,
    row.features.map((feature) => `${feature.label} ${feature.labelZh ?? ""}`).join(" "),
    row.whyIt,
    row.whyItZh,
    row.howWeHelp,
    row.howWeHelpZh,
    row.ctaText,
    row.ctaTextZh,
    row.footerText,
    row.footerTextZh,
    row.challenge,
    row.solution,
  ]
    .join(" ")
    .toLowerCase();
}

export function formatProjectDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(date);
}
