"use client";

import { useEffect, useState, type ReactNode } from "react";
import { FORCE_DESKTOP_STAGE } from "@/lib/landing-layout-mobile";

/** Desktop HTML first, so a wide window never mounts the mobile tree. */
export default function ViewportFrame({
  desktop,
  mobile,
}: {
  desktop: ReactNode;
  mobile: ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  if (FORCE_DESKTOP_STAGE) return desktop;
  return isMobile ? mobile : desktop;
}
