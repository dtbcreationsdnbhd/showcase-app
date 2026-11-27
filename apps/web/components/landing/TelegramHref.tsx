"use client";

import { createContext, useContext, type ReactNode } from "react";
import { FALLBACK_TELEGRAM_HREF } from "@/lib/contact-links";

const TelegramHrefContext = createContext(FALLBACK_TELEGRAM_HREF);

export function TelegramHrefProvider({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return <TelegramHrefContext.Provider value={href}>{children}</TelegramHrefContext.Provider>;
}

export function useTelegramHref() {
  return useContext(TelegramHrefContext);
}
