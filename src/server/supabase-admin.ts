import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getPublicEnvironment } from "@/config/public-env";
import { getServerEnvironment } from "@/server/env";
import type { Database } from "@/types/database.generated";

export function createSupabaseAdminClient() {
  const publicEnvironment = getPublicEnvironment();
  const serverEnvironment = getServerEnvironment();
  if (
    !publicEnvironment.NEXT_PUBLIC_SUPABASE_URL ||
    !serverEnvironment.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "La configurazione amministrativa Supabase non è disponibile.",
    );
  }

  return createClient<Database>(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    serverEnvironment.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
}
