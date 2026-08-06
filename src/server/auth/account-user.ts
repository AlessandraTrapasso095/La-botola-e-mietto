import "server-only";

import { cache } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { z } from "zod";

import { createSupabaseServerClient } from "@/server/supabase";
import type {
  AccountConsentHistoryEntry,
  AccountUser,
} from "@/services/auth/auth-service";
import type { Database } from "@/types/database.generated";

const profileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable(),
  birth_date: z.string().nullable(),
  marketing_consent: z.boolean(),
  email_updates: z.boolean(),
});

export async function loadAccountUser(
  client: SupabaseClient<Database>,
  authUser: User,
): Promise<AccountUser> {
  const response = await client
    .from("profiles")
    .select(
      "first_name, last_name, phone, birth_date, marketing_consent, email_updates",
    )
    .eq("id", authUser.id)
    .is("deleted_at", null)
    .single();
  if (response.error) throw new Error("Profilo non disponibile.");
  const profile = profileSchema.parse(response.data);

  return {
    id: authUser.id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: authUser.email ?? "",
    phone: profile.phone ?? "",
    birthDate: profile.birth_date ?? "",
    marketingConsent: profile.marketing_consent,
    emailUpdates: profile.email_updates,
  };
}

export const getServerAccountUser = cache(async () => {
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return loadAccountUser(client, data.user);
});

export const getServerConsentHistory = cache(async () => {
  const client = await createSupabaseServerClient();
  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError || !authData.user) return [];

  const response = await client
    .from("consent_records")
    .select("id, type, granted, created_at")
    .eq("profile_id", authData.user.id)
    .in("type", ["privacy", "marketing", "age_confirmation"])
    .order("created_at", { ascending: false })
    .limit(10);
  if (response.error) throw new Error("Cronologia consensi non disponibile.");

  return response.data.map(
    (entry): AccountConsentHistoryEntry => ({
      id: entry.id,
      type: entry.type as AccountConsentHistoryEntry["type"],
      granted: entry.granted,
      createdAt: entry.created_at,
    }),
  );
});
