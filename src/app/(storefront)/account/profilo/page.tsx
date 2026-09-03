import type { Metadata } from "next";

import { ProfileForm } from "@/features/account/profile-form";

export const metadata: Metadata = { title: "Profilo" };

export default function AccountProfilePage() {
  return <ProfileForm />;
}
