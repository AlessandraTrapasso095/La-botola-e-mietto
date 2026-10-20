"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const PRODUCT_IMAGE_BUCKET = "product-images";
const STORAGE_PRODUCT_PREFIX = "products/";

const deleteProductSchema = z.object({
  productId: z.string().uuid(),
});

type DeleteProductRow = {
  product_id: string;
  product_slug: string;
  storage_path: string | null;
  thumbnail_path: string | null;
};

export type AdminProductDeleteResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    };

async function removeStorageObjects(paths: Array<string | null>) {
  const validPaths = paths.filter(
    (path): path is string =>
      Boolean(path) && path!.startsWith(STORAGE_PRODUCT_PREFIX),
  );

  if (validPaths.length === 0) {
    return;
  }

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove(validPaths);

    if (error) {
      console.error(
        "[admin-product-delete] pulizia file prodotto dallo Storage fallita",
      );
    }
  } catch {
    console.error(
      "[admin-product-delete] pulizia file prodotto dallo Storage fallita",
    );
  }
}

export async function deleteAdminProduct(
  productId: string,
): Promise<AdminProductDeleteResult> {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    return {
      ok: false,
      error: "La sessione amministratore non è più valida. Accedi di nuovo.",
    };
  }

  const parsed = deleteProductSchema.safeParse({ productId });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Prodotto non valido.",
    };
  }

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.rpc(
    "admin_delete_product" as never,
    {
      p_product_id: parsed.data.productId,
    } as never,
  );

  if (error) {
    if (error.message.includes("PRODUCT_NOT_FOUND")) {
      return {
        ok: false,
        error: "Il prodotto non esiste più oppure è già stato eliminato.",
      };
    }

    if (error.message.includes("PRODUCT_HAS_ORDER_HISTORY")) {
      return {
        ok: false,
        error:
          "Questo prodotto non può essere eliminato definitivamente perché è già collegato a uno o più ordini. Puoi archiviarlo.",
      };
    }

    if (error.message.includes("PRODUCT_HAS_INVENTORY_HISTORY")) {
      return {
        ok: false,
        error:
          "Questo prodotto non può essere eliminato definitivamente perché possiede uno storico di magazzino. Puoi archiviarlo.",
      };
    }

    console.error("[admin-product-delete] eliminazione prodotto fallita", {
      productId: parsed.data.productId,
      code: error.code,
    });

    return {
      ok: false,
      error: "Non è stato possibile eliminare il prodotto. Riprova.",
    };
  }

  const deletion = Array.isArray(data)
    ? (data[0] as DeleteProductRow | undefined)
    : undefined;

  if (!deletion?.product_id) {
    return {
      ok: false,
      error:
        "Il prodotto potrebbe essere stato eliminato, ma non è stato possibile confermare l’operazione. Torna all’elenco prodotti prima di riprovare.",
    };
  }

  await removeStorageObjects([
    deletion.storage_path,
    deletion.thumbnail_path,
  ]);

  revalidatePath("/admin/prodotti");
  revalidatePath("/");
  revalidatePath("/prodotti");
  revalidatePath(`/prodotto/${deletion.product_slug}`);

  return {
    ok: true,
  };
}
