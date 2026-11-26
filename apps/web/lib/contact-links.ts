import { createClient } from "@supabase/supabase-js";

import { FORM_CONNECT_LINKS } from "@/lib/landing-content";

export type ContactLinkId = (typeof FORM_CONNECT_LINKS)[number]["id"];

export type ContactLink = {
  id: ContactLinkId;
  label: string;
  href: string;
};

type ContactRow = {
  whatsapp: string | null;
  telegram: string | null;
  facebook: string | null;
  instagram: string | null;
};

function contactTable(): "staging_contact_links" | "production_contact_links" {
  return process.env.NEXT_PUBLIC_PROJECT_TABLE === "production_projects"
    ? "production_contact_links"
    : "staging_contact_links";
}

function linksFromRow(row: ContactRow): ContactLink[] {
  return FORM_CONNECT_LINKS.map((link) => ({
    id: link.id,
    label: link.label,
    href: (row[link.id] ?? "").trim(),
  }));
}

/** Saved links, or the built-in ones when the settings table is not there yet. */
export async function listContactLinks(): Promise<ContactLink[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [...FORM_CONNECT_LINKS];

  const supabase = createClient(url, key, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });

  const { data, error } = await supabase
    .from(contactTable())
    .select("whatsapp, telegram, facebook, instagram")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return [...FORM_CONNECT_LINKS];
  return linksFromRow(data);
}
