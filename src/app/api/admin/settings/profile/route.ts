import { type NextRequest } from "next/server";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const schema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),

  phone: z.string().trim().max(50),

  birthDate: z.string().trim().max(20),

  notifyNewOrders: z.boolean(),
  notifyCancellations: z.boolean(),
  notifyPayments: z.boolean(),
  notifyShipping: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const adminUser = await getServerAdminUser();

    if (!adminUser) {
      throw new AuthHttpError(403, "Accesso amministratore richiesto.");
    }

    const input = await parseAuthInput(request, schema);

    const admin = createSupabaseAdminClient();

    const response = await admin
      .from("profiles")
      .update({
        first_name: input.firstName,
        last_name: input.lastName,

        phone: input.phone.length > 0 ? input.phone : null,

        birth_date: input.birthDate.length > 0 ? input.birthDate : null,

        admin_notify_new_orders: input.notifyNewOrders,

        admin_notify_cancellations: input.notifyCancellations,

        admin_notify_payments: input.notifyPayments,

        admin_notify_shipping: input.notifyShipping,

        updated_at: new Date().toISOString(),
      })
      .eq("id", adminUser.id)
      .eq("role", "admin")
      .select("id")
      .single();

    if (response.error || !response.data) {
      throw new AuthHttpError(500, "Aggiornamento profilo non riuscito.");
    }

    return authJson({
      updated: true,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
