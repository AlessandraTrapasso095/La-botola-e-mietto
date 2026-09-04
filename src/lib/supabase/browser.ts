"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnvironment } from "@/config/public-env";

export function createSupabaseBrowserClient() {
  const environment = getPublicEnvironment();

  if (
    !environment.NEXT_PUBLIC_SUPABASE_URL ||
    !environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new Error("La configurazione pubblica Supabase non è disponibile.");
  }

  return createBrowserClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
