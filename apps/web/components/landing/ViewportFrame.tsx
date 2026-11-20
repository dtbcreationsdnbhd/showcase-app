"use client";

import { useEffect, useState, type ReactNode } from "react";

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

  return isMobile ? mobile : desktop;
}
