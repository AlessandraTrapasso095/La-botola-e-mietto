import { z } from "zod";

import { addressInputSchema, addressSchema } from "@/lib/validation/address";
import type { Address, AddressInput } from "@/types/customer";

const addressListSchema = z.array(addressSchema);
const genericError = "Non è stato possibile completare l’operazione.";

async function readResponse<T>(
  response: Response,
  parse: (value: unknown) => T,
): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : genericError;
    throw new Error(message);
  }
  try {
    return parse(body);
  } catch {
    throw new Error(genericError);
  }
}

async function writeAddress(
  path: string,
  method: "POST" | "PATCH",
  input: AddressInput,
) {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(addressInputSchema.parse(input)),
  });
  return readResponse(response, (value) => addressSchema.parse(value));
}

export const supabaseAddressService = {
  async list(): Promise<Address[]> {
    const response = await fetch("/api/account/addresses", {
      credentials: "same-origin",
      cache: "no-store",
    });
    return readResponse(response, (value) => addressListSchema.parse(value));
  },
  create(input: AddressInput) {
    return writeAddress("/api/account/addresses", "POST", input);
  },
  update(id: string, input: AddressInput) {
    return writeAddress(`/api/account/addresses/${id}`, "PATCH", input);
  },
  async remove(id: string) {
    const response = await fetch(`/api/account/addresses/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
      cache: "no-store",
    });
    await readResponse(response, () => undefined);
  },
};
