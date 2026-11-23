"use client";

import Box from "@mui/material/Box";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type LoadingControls = {
  begin: () => void;
  end: () => void;
};

const LocaleLoadingContext = createContext<LoadingControls>({
  begin: () => {},
  end: () => {},
});

export function useLocaleLoading() {
  return useContext(LocaleLoadingContext);
}

function isProjectPage(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === "/projects" || path === "/zh/projects";
}

function LocaleLoadingOverlay() {
  return (
    <Box
      data-locale-loading=""
      role="status"
      aria-live="polite"
      aria-label="Loading"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(18, 6, 16, 0.42)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <Box className="locale-loading-spin" aria-hidden />
    </Box>
  );
}

export default function LocaleLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const fromPath = useRef(pathname);

  const begin = useCallback(() => {
    fromPath.current = pathname;
    setPending(true);
  }, [pathname]);

  const end = useCallback(() => {
    setPending(false);
  }, []);

  useEffect(() => {
    if (!pending || pathname === fromPath.current) return;
    setPending(false);
  }, [pathname, pending]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || !isProjectPage(url.pathname)) return;
      if (isProjectPage(window.location.pathname)) return;
      event.preventDefault();
      begin();
      const next = `${url.pathname}${url.search}${url.hash}`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.location.assign(next);
        });
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [begin]);

  useEffect(() => {
    if (!pending) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => setPending(false), 8000);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [pending]);

  return (
    <LocaleLoadingContext.Provider value={{ begin, end }}>
      {children}
      {pending ? createPortal(<LocaleLoadingOverlay />, document.body) : null}
    </LocaleLoadingContext.Provider>
  );
}
