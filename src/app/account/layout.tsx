import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AccountShell } from "@/features/account/account-shell";
import { getServerAccountUser } from "@/server/auth/account-user";
import { getServerEnvironment } from "@/server/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Area personale", template: "%s | Area personale" },
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (
    getServerEnvironment().AUTH_SERVICE === "supabase" &&
    !(await getServerAccountUser())
  ) {
    redirect("/accedi");
  }
  return <AccountShell>{children}</AccountShell>;
}
