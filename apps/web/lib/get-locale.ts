import { headers } from "next/headers";
import {
  isLocale,
  LOCALE_HEADER,
  PATHNAME_HEADER,
  type Locale,
} from "@/lib/locale";

export async function getLocale(): Promise<Locale> {
  const headerList = await headers();
  const value = headerList.get(LOCALE_HEADER);
  return isLocale(value) ? value : "en";
}

/** Browser path, including a `/zh` prefix. Proxy sets this on each request. */
export async function getRequestPathname(): Promise<string> {
  const headerList = await headers();
  const value = headerList.get(PATHNAME_HEADER);
  if (!value || !value.startsWith("/")) return "/";
  return value;
}
