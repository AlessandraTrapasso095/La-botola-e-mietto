"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const PRODUCT_IMAGE_BUCKET = "product-images";
const STORAGE_PRODUCT_PREFIX = "products/";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const contentTypeSchema = z.enum(["image/jpeg", "image/png", "image/webp"]);

const prepareUploadSchema = z.object({
  productId: z.string().uuid(),
  contentType: contentTypeSchema,
  size: z.number().int().positive().max(MAX_IMAGE_SIZE),
});

const registerImageSchema = z.object({
  productId: z.string().uuid(),
  storagePath: z.string().min(1).max(1000),
  thumbnailStoragePath: z.string().min(1).max(1000),
  altText: z.string().trim().max(500),
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
});

const discardUploadSchema = z.object({
  productId: z.string().uuid(),
  storagePath: z.string().min(1).max(1000),
  thumbnailStoragePath: z.string().min(1).max(1000),
});

const deleteImageSchema = z.object({
  productId: z.string().uuid(),
});

const extensionByContentType: Record<
  z.infer<typeof contentTypeSchema>,
  string
> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type ReplaceImageRow = {
  image_id: string;
  previous_storage_path: string | null;
  previous_thumbnail_path: string | null;
};

type DeleteImageRow = {
  image_id: string;
  storage_path: string;
  thumbnail_path: string | null;
};

export type AdminProductImageUploadInput = z.infer<typeof prepareUploadSchema>;

export type AdminProductImageRegisterInput = z.infer<
  typeof registerImageSchema
>;

async function requireAdminUser() {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  return adminUser;
}

async function removeStorageObject(storagePath: string | null) {
  if (!storagePath?.startsWith(STORAGE_PRODUCT_PREFIX)) {
    return;
  }

  try {
    const admin = createSupabaseAdminClient();

    const { error } = await admin.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error(
        "[admin-product-image] Impossibile rimuovere il file dallo Storage.",
        error,
      );
    }
  } catch (error) {
    console.error(
      "[admin-product-image] Rimozione del file dallo Storage fallita.",
      error,
    );
  }
}

async function removePreparedUpload(
  storagePath: string,
  thumbnailStoragePath: string,
) {
  await Promise.all([
    removeStorageObject(storagePath),
    removeStorageObject(thumbnailStoragePath),
  ]);
}

function revalidateProductPaths(productId: string, productSlug: string) {
  revalidatePath(`/admin/prodotti/${productId}`);
  revalidatePath("/admin/prodotti");
  revalidatePath("/prodotti");
  revalidatePath(`/prodotto/${productSlug}`);
}

function pathsBelongToProduct({
  productId,
  storagePath,
  thumbnailStoragePath,
}: {
  productId: string;
  storagePath: string;
  thumbnailStoragePath: string;
}) {
  const expectedPrefix = `products/${productId}/`;

  return (
    storagePath.startsWith(expectedPrefix) &&
    /[.](jpg|png|webp)$/.test(storagePath) &&
    thumbnailStoragePath.startsWith(expectedPrefix) &&
    /-thumbnail[.]webp$/.test(thumbnailStoragePath)
  );
}

export async function prepareAdminProductImageUpload(
  input: AdminProductImageUploadInput,
) {
  await requireAdminUser();

  const data = prepareUploadSchema.parse(input);
  const admin = createSupabaseAdminClient();

  const { data: product, error: productError } = await admin
    .from("products")
    .select("id")
    .eq("id", data.productId)
    .is("deleted_at", null)
    .maybeSingle();

  if (productError) {
    throw new Error(
      `Impossibile verificare il prodotto: ${productError.message}`,
    );
  }

  if (!product) {
    throw new Error("Prodotto non trovato.");
  }

  const extension = extensionByContentType[data.contentType];
  const uploadId = crypto.randomUUID();
  const storagePath = `products/${data.productId}/${uploadId}.${extension}`;
  const thumbnailStoragePath = `products/${data.productId}/${uploadId}-thumbnail.webp`;

  const [originalUpload, thumbnailUpload] = await Promise.all([
    admin.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .createSignedUploadUrl(storagePath, {
        upsert: false,
      }),
    admin.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .createSignedUploadUrl(thumbnailStoragePath, {
        upsert: false,
      }),
  ]);

  if (
    originalUpload.error ||
    thumbnailUpload.error ||
    !originalUpload.data?.token ||
    !thumbnailUpload.data?.token
  ) {
    throw new Error(
      `Impossibile preparare il caricamento dell’immagine: ${
        originalUpload.error?.message ??
        thumbnailUpload.error?.message ??
        "autorizzazione temporanea non disponibile"
      }`,
    );
  }

  return {
    storagePath,
    token: originalUpload.data.token,
    thumbnailStoragePath,
    thumbnailToken: thumbnailUpload.data.token,
  };
}

export async function discardAdminProductImageUpload(input: {
  productId: string;
  storagePath: string;
  thumbnailStoragePath: string;
}) {
  await requireAdminUser();

  const data = discardUploadSchema.parse(input);

  if (!pathsBelongToProduct(data)) {
    throw new Error("I percorsi dell’upload non sono validi.");
  }

  await removePreparedUpload(data.storagePath, data.thumbnailStoragePath);
}

export async function registerAdminProductImage(
  input: AdminProductImageRegisterInput,
) {
  await requireAdminUser();

  const data = registerImageSchema.parse(input);

  if (!pathsBelongToProduct(data)) {
    await removePreparedUpload(data.storagePath, data.thumbnailStoragePath);
    throw new Error("I percorsi dell’immagine non sono validi.");
  }

  const admin = createSupabaseAdminClient();

  const { data: product, error: productError } = await admin
    .from("products")
    .select("slug")
    .eq("id", data.productId)
    .is("deleted_at", null)
    .maybeSingle();

  if (productError || !product) {
    await removePreparedUpload(data.storagePath, data.thumbnailStoragePath);

    throw new Error(
      productError
        ? `Impossibile verificare il prodotto: ${productError.message}`
        : "Prodotto non trovato.",
    );
  }

  const { data: replacementData, error } = await admin.rpc(
    "admin_replace_product_image_with_thumbnail" as never,
    {
      p_product_id: data.productId,
      p_storage_path: data.storagePath,
      p_thumbnail_path: data.thumbnailStoragePath,
      p_alt_text: data.altText,
      p_width: data.width,
      p_height: data.height,
    } as never,
  );

  if (error) {
    await removePreparedUpload(data.storagePath, data.thumbnailStoragePath);

    if (
      error.message.includes("PRODUCT_IMAGE_OBJECT_MISSING") ||
      error.message.includes("PRODUCT_IMAGE_THUMBNAIL_OBJECT_MISSING")
    ) {
      throw new Error(
        "Il caricamento dell’immagine non risulta completato. Riprova.",
      );
    }

    throw new Error(
      `Impossibile registrare l’immagine prodotto: ${error.message}`,
    );
  }

  const replacement = Array.isArray(replacementData)
    ? (replacementData[0] as ReplaceImageRow | undefined)
    : undefined;

  if (!replacement?.image_id) {
    await removePreparedUpload(data.storagePath, data.thumbnailStoragePath);

    throw new Error(
      "L’immagine è stata caricata ma non è stato possibile registrarne l’identificativo.",
    );
  }

  await Promise.all([
    removeStorageObject(replacement.previous_storage_path),
    removeStorageObject(replacement.previous_thumbnail_path),
  ]);

  revalidateProductPaths(data.productId, product.slug);

  return {
    imageId: replacement.image_id,
    storagePath: data.storagePath,
    thumbnailStoragePath: data.thumbnailStoragePath,
  };
}

export async function deleteAdminProductImage(input: { productId: string }) {
  await requireAdminUser();

  const data = deleteImageSchema.parse(input);
  const admin = createSupabaseAdminClient();

  const { data: product, error: productError } = await admin
    .from("products")
    .select("slug")
    .eq("id", data.productId)
    .is("deleted_at", null)
    .maybeSingle();

  if (productError || !product) {
    throw new Error(
      productError
        ? `Impossibile verificare il prodotto: ${productError.message}`
        : "Prodotto non trovato.",
    );
  }

  const { data: deletionData, error } = await admin.rpc(
    "admin_delete_product_image" as never,
    {
      p_product_id: data.productId,
    } as never,
  );

  if (error) {
    if (error.message.includes("PRODUCT_IMAGE_NOT_FOUND")) {
      throw new Error("Il prodotto non possiede un’immagine da eliminare.");
    }

    throw new Error(`Impossibile eliminare l’immagine: ${error.message}`);
  }

  const deletion = Array.isArray(deletionData)
    ? (deletionData[0] as DeleteImageRow | undefined)
    : undefined;

  if (!deletion?.image_id) {
    throw new Error(
      "L’immagine è stata eliminata ma non è stato possibile recuperarne i dati.",
    );
  }

  await Promise.all([
    removeStorageObject(deletion.storage_path),
    removeStorageObject(deletion.thumbnail_path),
  ]);

  revalidateProductPaths(data.productId, product.slug);

  return {
    imageId: deletion.image_id,
  };
}
