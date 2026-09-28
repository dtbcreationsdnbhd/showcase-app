import { redirect } from "next/navigation";

import { signOut } from "@/app/login/actions";
import AuthNoticeBanner from "@/components/AuthNoticeBanner";
import { emailToUsername } from "@/lib/auth";
import { noticeFromParam } from "@/lib/notices";
import { createClient } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  const notice = noticeFromParam(params.notice);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const username = emailToUsername(user.email) ?? user.email;

  return (
    <main className="flex flex-1 flex-col px-6 py-16">
      <AuthNoticeBanner notice={notice} />
      <div className="mx-auto w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Show Case Back Office
        </h1>
        <p>Signed in as {username}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
