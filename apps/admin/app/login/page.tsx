import { signIn } from "@/app/login/actions";
import AuthNoticeBanner from "@/components/AuthNoticeBanner";
import { noticeFromParam } from "@/lib/notices";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  const notice = noticeFromParam(params.notice);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <AuthNoticeBanner notice={notice} />
      <form action={signIn} className="w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Show Case Back Office
        </h1>

        <label className="block text-sm font-medium">
          Username
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-foreground dark:border-neutral-700"
          />
        </label>

        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-foreground dark:border-neutral-700"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
