"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/login/actions";

const links = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/inquiries", label: "Form", icon: FormIcon },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[76px] shrink-0 flex-col items-center justify-between rounded-[28px] bg-[#7B61FF] py-4">
      <nav className="flex flex-col gap-2" aria-label="Back office">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              aria-current={active ? "page" : undefined}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                active
                  ? "bg-white text-[#7B61FF]"
                  : "text-white hover:bg-white/15"
              }`}
            >
              <Icon />
            </Link>
          );
        })}
      </nav>

      <form action={signOut}>
        <button
          type="submit"
          aria-label="Sign out"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <LogoutIcon />
        </button>
      </form>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M9 12h6" />
      <path d="M9 15.5h6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 7V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-2" />
      <path d="M4 12h9" />
      <path d="m10 9 3 3-3 3" />
    </svg>
  );
}
