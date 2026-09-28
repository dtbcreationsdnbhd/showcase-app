"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import NoticeSnackbar, { type AuthNotice } from "@/components/NoticeSnackbar";

export default function AuthNoticeBanner({
  notice,
}: {
  notice: AuthNotice | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [current, setCurrent] = useState(notice);

  useEffect(() => {
    setCurrent(notice);
  }, [notice]);

  return (
    <NoticeSnackbar
      notice={current}
      onClose={() => {
        setCurrent(null);
        router.replace(pathname);
      }}
    />
  );
}
