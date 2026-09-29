import { redirect } from "next/navigation";

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") search.set(key, value);
  }

  const query = search.toString();
  redirect(query ? `/?${query}` : "/");
}
