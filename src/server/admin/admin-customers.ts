"use server";

import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const adminCustomerIdSchema = z.string().uuid();

export type AdminCustomerMarketingFilter =
  | "all"
  | "consented"
  | "not_consented";

export type AdminCustomerListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  paidOrderCount: number;
  paidGrossAmountMinor: number;
  lastOrderAt: string | null;
};

export type AdminCustomersResult = {
  customers: AdminCustomerListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: {
    totalCustomers: number;
    marketingConsentedCount: number;
    customersWithOrdersCount: number;
    paidCustomersCount: number;
    paidGrossAmountMinor: number;
  };
};

export type GetAdminCustomersInput = {
  query?: string;
  marketing?: AdminCustomerMarketingFilter;
  page?: number;
  pageSize?: number;
};

export type AdminCustomerAddress = {
  id: string;
  type: "shipping" | "billing";
  label: string;
  firstName: string;
  lastName: string;
  company: string | null;
  street: string;
  streetNumber: string;
  line2: string | null;
  postalCode: string;
  city: string;
  province: string | null;
  countryCode: string;
  phone: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type AdminCustomerOrderItem = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "received" | "preparing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "authorized" | "paid" | "failed" | "refunded";
  paymentMethod: "stripe" | "bank_transfer" | "satispay";
  totalGrossAmountMinor: number;
};

export type AdminCustomerDetail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  addresses: AdminCustomerAddress[];
  orders: AdminCustomerOrderItem[];
  orderCount: number;
  paidOrderCount: number;
  paidGrossAmountMinor: number;
  lastOrderAt: string | null;
};

async function requireAdmin() {
  const admin = await getServerAdminUser();

  if (!admin) {
    throw new Error("Accesso amministratore richiesto.");
  }

  return admin;
}

function throwAdminCustomersError(
  operation: string,
  userMessage: string,
  error: { code?: string },
): never {
  console.error(`[admin-customers] ${operation}`, {
    code: error.code,
  });

  throw new Error(userMessage);
}

function escapePostgrestSearch(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_")
    .replaceAll(",", "\\,")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function normalizePage(value: number | undefined) {
  if (!Number.isSafeInteger(value) || !value || value < 1) {
    return 1;
  }

  return value;
}

function normalizePageSize(value: number | undefined) {
  if (!Number.isSafeInteger(value) || !value || value < 1) {
    return 25;
  }

  return Math.min(value, 100);
}

export async function getAdminCustomers(
  input: GetAdminCustomersInput = {},
): Promise<AdminCustomersResult> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();
  const query = input.query?.trim() ?? "";
  const marketing = input.marketing ?? "all";
  const page = normalizePage(input.page);
  const pageSize = normalizePageSize(input.pageSize);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let customersQuery = admin
    .from("profiles")
    .select(
      `
        id,
        first_name,
        last_name,
        email,
        phone,
        birth_date,
        marketing_consent,
        created_at,
        updated_at
      `,
      { count: "exact" },
    )
    .eq("role", "customer")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (query) {
    const searchValue = escapePostgrestSearch(query);

    customersQuery = customersQuery.or(
      [
        `first_name.ilike.%${searchValue}%`,
        `last_name.ilike.%${searchValue}%`,
        `email.ilike.%${searchValue}%`,
        `phone.ilike.%${searchValue}%`,
      ].join(","),
    );
  }

  if (marketing === "consented") {
    customersQuery = customersQuery.eq("marketing_consent", true);
  } else if (marketing === "not_consented") {
    customersQuery = customersQuery.eq("marketing_consent", false);
  }

  const customersResponse = await customersQuery.range(from, to);

  if (customersResponse.error) {
    throwAdminCustomersError(
      "caricamento clienti fallito",
      "Impossibile caricare i clienti. Riprova.",
      customersResponse.error,
    );
  }

  const rows = customersResponse.data ?? [];
  const profileIds = rows.map((profile) => profile.id);

  const orderCountByProfile = new Map<string, number>();
  const paidOrderCountByProfile = new Map<string, number>();
  const paidGrossByProfile = new Map<string, number>();
  const lastOrderAtByProfile = new Map<string, string>();

  if (profileIds.length > 0) {
    const ordersResponse = await admin
      .from("orders")
      .select(
        "profile_id,status,payment_status,total_gross_amount_minor,created_at",
      )
      .in("profile_id", profileIds)
      .order("created_at", { ascending: false });

    if (ordersResponse.error) {
      throwAdminCustomersError(
        "caricamento statistiche ordini clienti fallito",
        "Impossibile caricare le statistiche dei clienti. Riprova.",
        ordersResponse.error,
      );
    }

    for (const order of ordersResponse.data ?? []) {
      const profileId = order.profile_id;

      orderCountByProfile.set(
        profileId,
        (orderCountByProfile.get(profileId) ?? 0) + 1,
      );

      if (!lastOrderAtByProfile.has(profileId)) {
        lastOrderAtByProfile.set(profileId, order.created_at);
      }

      if (order.status !== "cancelled" && order.payment_status === "paid") {
        paidOrderCountByProfile.set(
          profileId,
          (paidOrderCountByProfile.get(profileId) ?? 0) + 1,
        );

        paidGrossByProfile.set(
          profileId,
          (paidGrossByProfile.get(profileId) ?? 0) +
            Number(order.total_gross_amount_minor),
        );
      }
    }
  }

  const summaryProfilesResponse = await admin
    .from("profiles")
    .select("id,marketing_consent")
    .eq("role", "customer")
    .is("deleted_at", null);

  if (summaryProfilesResponse.error) {
    throwAdminCustomersError(
      "caricamento riepilogo clienti fallito",
      "Impossibile caricare il riepilogo clienti. Riprova.",
      summaryProfilesResponse.error,
    );
  }

  const allCustomerIds = (summaryProfilesResponse.data ?? []).map(
    (profile) => profile.id,
  );

  let customersWithOrdersCount = 0;
  let paidCustomersCount = 0;
  let totalPaidGrossAmountMinor = 0;

  if (allCustomerIds.length > 0) {
    const summaryOrdersResponse = await admin
      .from("orders")
      .select("profile_id,status,payment_status,total_gross_amount_minor")
      .in("profile_id", allCustomerIds);

    if (summaryOrdersResponse.error) {
      throwAdminCustomersError(
        "caricamento riepilogo ordini clienti fallito",
        "Impossibile caricare il riepilogo clienti. Riprova.",
        summaryOrdersResponse.error,
      );
    }

    const customersWithOrders = new Set<string>();
    const paidCustomers = new Set<string>();

    for (const order of summaryOrdersResponse.data ?? []) {
      customersWithOrders.add(order.profile_id);

      if (order.status !== "cancelled" && order.payment_status === "paid") {
        paidCustomers.add(order.profile_id);
        totalPaidGrossAmountMinor += Number(order.total_gross_amount_minor);
      }
    }

    customersWithOrdersCount = customersWithOrders.size;
    paidCustomersCount = paidCustomers.size;
  }

  const totalCount = customersResponse.count ?? 0;

  return {
    customers: rows.map((profile) => ({
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      birthDate: profile.birth_date,
      marketingConsent: profile.marketing_consent,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      orderCount: orderCountByProfile.get(profile.id) ?? 0,
      paidOrderCount: paidOrderCountByProfile.get(profile.id) ?? 0,
      paidGrossAmountMinor: paidGrossByProfile.get(profile.id) ?? 0,
      lastOrderAt: lastOrderAtByProfile.get(profile.id) ?? null,
    })),
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    summary: {
      totalCustomers: summaryProfilesResponse.data?.length ?? 0,
      marketingConsentedCount: (summaryProfilesResponse.data ?? []).filter(
        (profile) => profile.marketing_consent,
      ).length,
      customersWithOrdersCount,
      paidCustomersCount,
      paidGrossAmountMinor: totalPaidGrossAmountMinor,
    },
  };
}

export async function getAdminCustomerById(
  customerId: string,
): Promise<AdminCustomerDetail | null> {
  await requireAdmin();

  const parsedCustomerId = adminCustomerIdSchema.safeParse(customerId.trim());

  if (!parsedCustomerId.success) {
    return null;
  }

  const normalizedCustomerId = parsedCustomerId.data;

  const admin = createSupabaseAdminClient();

  const profileResponse = await admin
    .from("profiles")
    .select(
      `
        id,
        first_name,
        last_name,
        email,
        phone,
        birth_date,
        marketing_consent,
        created_at,
        updated_at
      `,
    )
    .eq("id", normalizedCustomerId)
    .eq("role", "customer")
    .is("deleted_at", null)
    .maybeSingle();

  if (profileResponse.error) {
    throwAdminCustomersError(
      "caricamento dettaglio cliente fallito",
      "Impossibile caricare il cliente. Riprova.",
      profileResponse.error,
    );
  }

  if (!profileResponse.data) {
    return null;
  }

  const [addressesResponse, ordersResponse] = await Promise.all([
    admin
      .from("addresses")
      .select(
        `
          id,
          type,
          label,
          first_name,
          last_name,
          company,
          street,
          street_number,
          line2,
          postal_code,
          city,
          province,
          country_code,
          phone,
          is_default_shipping,
          is_default_billing
        `,
      )
      .eq("profile_id", normalizedCustomerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),

    admin
      .from("orders")
      .select(
        `
          id,
          order_number,
          created_at,
          status,
          payment_status,
          payment_method,
          total_gross_amount_minor
        `,
      )
      .eq("profile_id", normalizedCustomerId)
      .order("created_at", { ascending: false }),
  ]);

  if (addressesResponse.error) {
    throwAdminCustomersError(
      "caricamento indirizzi cliente fallito",
      "Impossibile caricare gli indirizzi del cliente. Riprova.",
      addressesResponse.error,
    );
  }

  if (ordersResponse.error) {
    throwAdminCustomersError(
      "caricamento ordini cliente fallito",
      "Impossibile caricare gli ordini del cliente. Riprova.",
      ordersResponse.error,
    );
  }

  const orders = (ordersResponse.data ?? []).map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.created_at,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    totalGrossAmountMinor: Number(order.total_gross_amount_minor),
  }));

  const paidOrders = orders.filter(
    (order) => order.status !== "cancelled" && order.paymentStatus === "paid",
  );

  return {
    id: profileResponse.data.id,
    firstName: profileResponse.data.first_name,
    lastName: profileResponse.data.last_name,
    email: profileResponse.data.email,
    phone: profileResponse.data.phone,
    birthDate: profileResponse.data.birth_date,
    marketingConsent: profileResponse.data.marketing_consent,
    createdAt: profileResponse.data.created_at,
    updatedAt: profileResponse.data.updated_at,
    addresses: (addressesResponse.data ?? []).map((address) => ({
      id: address.id,
      type: address.type,
      label: address.label,
      firstName: address.first_name,
      lastName: address.last_name,
      company: address.company,
      street: address.street,
      streetNumber: address.street_number,
      line2: address.line2,
      postalCode: address.postal_code,
      city: address.city,
      province: address.province,
      countryCode: address.country_code,
      phone: address.phone,
      isDefaultShipping: address.is_default_shipping,
      isDefaultBilling: address.is_default_billing,
    })),
    orders,
    orderCount: orders.length,
    paidOrderCount: paidOrders.length,
    paidGrossAmountMinor: paidOrders.reduce(
      (total, order) => total + order.totalGrossAmountMinor,
      0,
    ),
    lastOrderAt: orders[0]?.createdAt ?? null,
  };
}
