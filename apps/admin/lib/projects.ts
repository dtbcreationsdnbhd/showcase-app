import { createClient } from "@/lib/supabase/server";

import {
  PROJECT_PAGE_SIZE,
  isPageSize,
} from "@/lib/project-filters";

export {
  PROJECT_PAGE_SIZE,
  PROJECT_PAGE_SIZES,
  isPageSize,
  projectPageHref,
} from "@/lib/project-filters";

const PROJECT_TABLES = ["staging_projects", "production_projects"] as const;

export type ProjectTable = (typeof PROJECT_TABLES)[number];

export type ShowcaseProject = {
  id: string;
  name: string;
  tags: string[];
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
  tags: string[] | null;
  challenge: string;
  solution: string;
  main_image_url: string;
  detail_image_urls: string[] | null;
  created_at: string;
  updated_at: string;
};

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
  const { data, error } = await supabase
    .from(table)
    .select(
      "id, name, tags, challenge, solution, main_image_url, detail_image_urls, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

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

function toProject(row: ProjectRow): ShowcaseProject {
  return {
    id: row.id,
    name: row.name,
    tags: row.tags ?? [],
    challenge: row.challenge,
    solution: row.solution,
    mainImageUrl: row.main_image_url,
    detailImageUrls: row.detail_image_urls ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function projectSearchText(row: ShowcaseProject) {
  return [row.name, row.tags.join(" "), row.challenge, row.solution]
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
