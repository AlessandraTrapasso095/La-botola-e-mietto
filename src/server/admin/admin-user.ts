import "server-only";

import { createSupabaseServerClient } from "@/server/supabase";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export async function getServerAdminUser(): Promise<AdminUser | null> {
  try {
    const client = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id, email, first_name, last_name, role")
      .eq("id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (profileError || !profile || profile.role !== "admin") {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
    };
  } catch (error) {
    console.error("[admin-auth] Impossibile verificare la sessione admin.", error);
    return null;
  }
}
