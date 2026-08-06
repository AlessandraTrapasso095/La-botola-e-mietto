import { type NextRequest } from "next/server";

import { addressIdSchema, addressInputSchema } from "@/lib/validation/address";
import {
  removeAccountAddress,
  saveAccountAddress,
} from "@/server/addresses/account-addresses";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";

type RouteContext = { params: Promise<{ id: string }> };

async function readAddressId(context: RouteContext) {
  const result = addressIdSchema.safeParse((await context.params).id);
  if (!result.success) {
    throw new AuthHttpError(400, "Indirizzo non valido.");
  }
  return result.data;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const [addressId, input] = await Promise.all([
      readAddressId(context),
      parseAuthInput(request, addressInputSchema),
    ]);
    const client = await createSupabaseServerClient();
    return authJson(await saveAccountAddress(client, input, addressId));
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const addressId = await readAddressId(context);
    const client = await createSupabaseServerClient();
    await removeAccountAddress(client, addressId);
    return authJson({ success: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
