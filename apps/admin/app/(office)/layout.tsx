import { redirect } from "next/navigation";

import OfficeShell from "@/components/office/OfficeShell";
import { createClient } from "@/lib/supabase/server";

export default async function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <OfficeShell>{children}</OfficeShell>;
}
