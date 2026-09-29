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
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-[#F4F1FB] px-6 py-16 text-[#171717]">
      <AuthNoticeBanner notice={notice} />
      <form
        action={signIn}
        className="w-full max-w-sm rounded-[28px] bg-white px-8 py-8 shadow-[0_8px_30px_rgba(80,60,140,0.06)]"
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Show Case Back Office
        </h1>
        <p className="mt-2 text-sm text-[#6B6578]">Sign in to continue</p>

        <label className="mt-6 block text-sm font-medium">
          Username
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            className="mt-2 h-11 w-full rounded-full bg-[#F4F1FB] px-4 text-sm text-[#171717] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B61FF]"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 h-11 w-full rounded-full bg-[#F4F1FB] px-4 text-sm text-[#171717] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B61FF]"
          />
        </label>

        <button
          type="submit"
          className="mt-6 h-11 w-full cursor-pointer rounded-full bg-[#7B61FF] px-4 text-sm font-medium text-white hover:bg-[#6A52F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B61FF]"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
