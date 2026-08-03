import type { Metadata } from "next";

import { SettingsPanel } from "@/features/account/settings-panel";

export const metadata: Metadata = { title: "Impostazioni" };

export default function AccountSettingsPage() {
  return <SettingsPanel />;
}
