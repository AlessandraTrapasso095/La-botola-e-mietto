import { type NextRequest } from "next/server";

import { addressInputSchema } from "@/lib/validation/address";
import {
  listAccountAddresses,
  saveAccountAddress,
} from "@/server/addresses/account-addresses";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";

export async function GET() {
  try {
    requireSupabaseAuthMode();
    const client = await createSupabaseServerClient();
    return authJson(await listAccountAddresses(client));
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const input = await parseAuthInput(request, addressInputSchema);
    const client = await createSupabaseServerClient();
    return authJson(await saveAccountAddress(client, input, null), 201);
  } catch (error) {
    return authErrorResponse(error);
  }
}
