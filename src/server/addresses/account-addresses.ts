import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import type { Database } from "@/types/database.generated";
import type { Address, AddressInput } from "@/types/customer";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

const addressColumns = [
  "id",
  "label",
  "first_name",
  "last_name",
  "company",
  "street",
  "street_number",
  "line2",
  "postal_code",
  "city",
  "province",
  "country_code",
  "phone",
  "type",
  "is_default_shipping",
  "is_default_billing",
  "updated_at",
].join(",");

function mapAddress(row: AddressRow): Address {
  return {
    id: row.id,
    label: row.label,
    firstName: row.first_name,
    lastName: row.last_name,
    company: row.company ?? "",
    street: row.street,
    streetNumber: row.street_number,
    line2: row.line2 ?? "",
    postalCode: row.postal_code,
    city: row.city,
    province: row.province ?? "",
    countryCode: row.country_code,
    phone: row.phone,
    type: row.type,
    isDefaultShipping: row.is_default_shipping,
    isDefaultBilling: row.is_default_billing,
    updatedAt: row.updated_at,
  };
}

async function requireUserId(client: SupabaseClient<Database>) {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    throw new AuthHttpError(401, "Accesso richiesto.");
  }
  return data.user.id;
}

export async function listAccountAddresses(
  client: SupabaseClient<Database>,
): Promise<Address[]> {
  const userId = await requireUserId(client);
  const { data, error } = await client
    .from("addresses")
    .select(addressColumns)
    .eq("profile_id", userId)
    .is("deleted_at", null)
    .order("is_default_shipping", { ascending: false })
    .order("is_default_billing", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    throw new AuthHttpError(
      500,
      "Non è stato possibile caricare gli indirizzi.",
    );
  }
  return (data as unknown as AddressRow[]).map(mapAddress);
}

export async function loadCurrentAccountAddresses() {
  const client = await createSupabaseServerClient();
  return listAccountAddresses(client);
}

export async function saveAccountAddress(
  client: SupabaseClient<Database>,
  input: AddressInput,
  addressId: string | null,
) {
  await requireUserId(client);
  const { data, error } = await client.rpc("upsert_account_address", {
    label_value: input.label,
    first_name_value: input.firstName,
    last_name_value: input.lastName,
    company_value: input.company,
    street_value: input.street,
    street_number_value: input.streetNumber,
    line2_value: input.line2,
    postal_code_value: input.postalCode,
    city_value: input.city,
    province_value: input.province,
    country_code_value: input.countryCode,
    phone_value: input.phone,
    type_value: input.type,
    is_default_shipping_value: input.isDefaultShipping,
    is_default_billing_value: input.isDefaultBilling,
    ...(addressId ? { address_id_value: addressId } : {}),
  });
  if (error || !data) {
    throw new AuthHttpError(400, "Salvataggio dell’indirizzo non riuscito.");
  }
  return mapAddress(data);
}

export async function removeAccountAddress(
  client: SupabaseClient<Database>,
  addressId: string,
) {
  await requireUserId(client);
  const { data, error } = await client.rpc("delete_account_address", {
    address_id_value: addressId,
  });
  if (error || !data) {
    throw new AuthHttpError(404, "Indirizzo non disponibile.");
  }
}
