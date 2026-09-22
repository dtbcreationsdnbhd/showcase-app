"use client";

import { useCallback, type MouseEvent, type ReactNode } from "react";
import Box from "@mui/material/Box";

/** Smooth-scroll a hash target so its box is vertically centered in the viewport. */
export default function CenterHashLink({
  hash,
  href,
  children,
  sx,
  ...rest
}: {
  hash: string;
  href: string;
  children: ReactNode;
  sx?: object;
} & Omit<React.ComponentProps<typeof Box>, "component" | "href" | "onClick" | "sx">) {
  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const id = hash.replace(/^#/, "");
      if (!id || id === "top") return; // let browser handle home
      const el = document.getElementById(id);
      if (!el) return;
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2;
      window.scrollBy({ top: delta, behavior: "smooth" });
      history.pushState(null, "", href.includes("#") ? href : `#${id}`);
    },
    [hash, href],
  );

  return (
    <Box component="a" href={href} onClick={onClick} sx={sx} {...rest}>
      {children}
    </Box>
  );
}
