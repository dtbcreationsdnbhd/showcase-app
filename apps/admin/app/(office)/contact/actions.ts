"use server";

import { CONTACT_LINKS, cleanContactUrl, contactLinksTable } from "@/lib/contact-links";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; message: string };

export async function saveContactLinks(formData: FormData): Promise<ActionResult> {
  const row: Record<string, string | number> = { id: 1, updated_at: new Date().toISOString() };

  for (const link of CONTACT_LINKS) {
    const href = cleanContactUrl(String(formData.get(link.id) ?? ""));
    if (href === null) {
      return { ok: false, message: `${link.label} needs a full https link, or leave it blank.` };
    }
    row[link.id] = href;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Sign in to save contact links." };

  const { error } = await supabase.from(contactLinksTable()).upsert(row);
  if (error) {
    return {
      ok: false,
      message:
        "Could not save. Run apps/web/supabase/schema.sql in the Supabase SQL editor, then try again.",
    };
  }

  return { ok: true };
}
