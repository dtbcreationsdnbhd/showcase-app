import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE, LOCALE_HEADER, PATHNAME_HEADER } from "@/lib/locale";

function isChinesePath(pathname: string): boolean {
  return pathname === "/zh" || pathname.startsWith("/zh/");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const chinese = isChinesePath(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, chinese ? "zh" : "en");
  requestHeaders.set(PATHNAME_HEADER, pathname);

  const response = chinese
    ? NextResponse.rewrite(strippedUrl(request), { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  response.cookies.set(LOCALE_COOKIE, chinese ? "zh" : "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

function strippedUrl(request: NextRequest): URL {
  const url = request.nextUrl.clone();
  const next = url.pathname.replace(/^\/zh(?=\/|$)/, "");
  url.pathname = next === "" ? "/" : next;
  return url;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
