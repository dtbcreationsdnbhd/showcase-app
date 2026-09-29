import { createClient } from "@supabase/supabase-js";

const PROJECT_TABLES = ["staging_projects", "production_projects"] as const;

type ProjectTable = (typeof PROJECT_TABLES)[number];

export type ShowcaseProject = {
  id: string;
  name: string;
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
      "id, name, tags, challenge, solution, main_image_url, detail_image_urls, updated_at",
    )
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return (data as ProjectRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    tags: row.tags ?? [],
    challenge: row.challenge,
    solution: row.solution,
    mainImageUrl: row.main_image_url,
    detailImageUrls: row.detail_image_urls ?? [],
    updatedAt: row.updated_at,
  }));
}
