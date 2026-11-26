import { createClient } from "@/lib/supabase/server";

export const CONTACT_LINKS = [
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/601112172475" },
  { id: "telegram", label: "Telegram", href: "https://t.me/visioncraftofficial" },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61595156267766",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/visioncraftt.cn/",
  },
] as const;

export type ContactLinkId = (typeof CONTACT_LINKS)[number]["id"];

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

function contactTable() {
  return process.env.NEXT_PUBLIC_PROJECT_TABLE === "production_projects"
    ? "production_contact_links"
    : "staging_contact_links";
}

function linksFromRow(row: ContactRow): ContactLink[] {
  return CONTACT_LINKS.map((link) => ({
    id: link.id,
    label: link.label,
    href: (row[link.id] ?? "").trim(),
  }));
}

export function defaultContactLinks(): ContactLink[] {
  return CONTACT_LINKS.map((link) => ({ ...link }));
}

const MISSING_TABLE =
  "Contact settings are not in the database yet. Run apps/web/supabase/schema.sql in the Supabase SQL editor, then reload this page.";

export async function getContactLinks(): Promise<
  { ok: true; links: ContactLink[] } | { ok: false; message: string; links: ContactLink[] }
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(contactTable())
    .select("whatsapp, telegram, facebook, instagram")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return { ok: false, message: MISSING_TABLE, links: defaultContactLinks() };
  }

  if (!data) return { ok: true, links: defaultContactLinks() };
  return { ok: true, links: linksFromRow(data) };
}

export function contactLinksTable() {
  return contactTable();
}

export function cleanContactUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}
