"use client";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cornerRadius } from "@/lib/ui";

const links = [
  { href: "/", label: "Dashboard", icon: DashboardOutlinedIcon },
  { href: "/projects", label: "Showcase Project", icon: CollectionsOutlinedIcon },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Stack
      component="aside"
      sx={{
        width: 76,
        flexShrink: 0,
        alignItems: "center",
        borderRadius: cornerRadius,
        bgcolor: "primary.main",
        py: 2,
      }}
    >
      <Stack component="nav" aria-label="Back office" spacing={1}>
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <IconButton
              key={link.href}
              component={Link}
              href={link.href}
              aria-label={link.label}
              aria-current={active ? "page" : undefined}
              sx={{
                width: 44,
                height: 44,
                borderRadius: cornerRadius,
                color: active ? "primary.main" : "#fff",
                bgcolor: active ? "#fff" : "transparent",
                "&:hover": {
                  bgcolor: active ? "#fff" : "rgba(255,255,255,0.15)",
                },
                "&.Mui-focusVisible": {
                  outline: "2px solid #fff",
                  outlineOffset: 2,
                },
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </IconButton>
          );
        })}
      </Stack>
    </Stack>
  );
}
