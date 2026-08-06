import type { Metadata } from "next";

import { SettingsPanel } from "@/features/account/settings-panel";
import { getServerConsentHistory } from "@/server/auth/account-user";
import { getServerEnvironment } from "@/server/env";

export const metadata: Metadata = { title: "Impostazioni" };

export default async function AccountSettingsPage() {
  const consentHistory =
    getServerEnvironment().AUTH_SERVICE === "supabase"
      ? await getServerConsentHistory()
      : [];
  return <SettingsPanel consentHistory={consentHistory} />;
}
