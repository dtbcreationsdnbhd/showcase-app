const PROJECT_TABLES = ["staging_projects", "production_projects"] as const;

export type ProjectTable = (typeof PROJECT_TABLES)[number];

export function projectTable(): ProjectTable {
  const name = process.env.NEXT_PUBLIC_PROJECT_TABLE;
  if (name === "staging_projects" || name === "production_projects") {
    return name;
  }

  throw new Error(
    "NEXT_PUBLIC_PROJECT_TABLE must be staging_projects or production_projects.",
  );
}
