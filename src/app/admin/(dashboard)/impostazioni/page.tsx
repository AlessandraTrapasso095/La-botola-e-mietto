import type { Metadata } from "next";

import { AdminSettingsPanel } from "@/features/admin/admin-settings-panel";
import { getServerAdminSettings } from "@/server/admin/settings";

export const metadata: Metadata = {
  title: "Impostazioni",
};

export default async function AdminSettingsPage() {
  const settings = await getServerAdminSettings();

  return (
    <div className="min-w-0">
      <div>
        <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
          Account
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Impostazioni
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Gestisci profilo, credenziali e preferenze dell’account
          amministratore.
        </p>
      </div>

      <AdminSettingsPanel initialSettings={settings} />
    </div>
  );
}
