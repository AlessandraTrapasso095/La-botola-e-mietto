import "server-only";

import { cache } from "react";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type AdminSettingsView = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  notifyNewOrders: boolean;
  notifyCancellations: boolean;
  notifyPayments: boolean;
  notifyShipping: boolean;
};

export const getServerAdminSettings = cache(
  async (): Promise<AdminSettingsView> => {
    const adminUser = await getServerAdminUser();

    if (!adminUser) {
      throw new Error("Accesso amministratore richiesto.");
    }

    const admin = createSupabaseAdminClient();

    const response = await admin
      .from("profiles")
      .select(
        `
        id,
        email,
        first_name,
        last_name,
        phone,
        birth_date,
        admin_notify_new_orders,
        admin_notify_cancellations,
        admin_notify_payments,
        admin_notify_shipping
      `,
      )
      .eq("id", adminUser.id)
      .eq("role", "admin")
      .single();

    if (response.error || !response.data) {
      throw new Error("Impostazioni amministratore non disponibili.");
    }

    const profile = response.data;

    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone ?? "",
      birthDate: profile.birth_date ?? "",
      notifyNewOrders: profile.admin_notify_new_orders,
      notifyCancellations: profile.admin_notify_cancellations,
      notifyPayments: profile.admin_notify_payments,
      notifyShipping: profile.admin_notify_shipping,
    };
  },
);
