"use server";

import { redirect } from "next/navigation";

import { usernameToEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const email = usernameToEmail(username);

  if (!email || password.length === 0) {
    redirect("/login?notice=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?notice=invalid");
  }

  redirect("/?notice=signed-in");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?notice=signed-out");
}
