"use client";

import { createProductImageThumbnail } from "@/lib/product-image-processing";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  discardAdminProductImageUpload,
  prepareAdminProductImageUpload,
  registerAdminProductImage,
} from "@/server/admin/admin-product-images";

type UploadAdminProductImageInput = {
  productId: string;
  productName: string;
  file: File;
  width: number;
  height: number;
};

export async function uploadAdminProductImage({
  productId,
  productName,
  file,
  width,
  height,
}: UploadAdminProductImageInput) {
  let preparedUpload: Awaited<
    ReturnType<typeof prepareAdminProductImageUpload>
  > | null = null;

  try {
    const thumbnailSourceUrl = URL.createObjectURL(file);

    let thumbnail: Awaited<ReturnType<typeof createProductImageThumbnail>>;

    try {
      thumbnail = await createProductImageThumbnail({
        sourceUrl: thumbnailSourceUrl,
        width,
        height,
      });
    } finally {
      URL.revokeObjectURL(thumbnailSourceUrl);
    }

    preparedUpload = await prepareAdminProductImageUpload({
      productId,
      contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
      size: file.size,
    });

    const supabase = createSupabaseBrowserClient();
    const storage = supabase.storage.from("product-images");

    const { error: originalUploadError } = await storage.uploadToSignedUrl(
      preparedUpload.storagePath,
      preparedUpload.token,
      file,
      {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      },
    );

    if (originalUploadError) {
      throw new Error(
        `Impossibile caricare l’immagine: ${originalUploadError.message}`,
      );
    }

    const { error: thumbnailUploadError } = await storage.uploadToSignedUrl(
      preparedUpload.thumbnailStoragePath,
      preparedUpload.thumbnailToken,
      thumbnail.file,
      {
        cacheControl: "31536000",
        contentType: "image/webp",
        upsert: false,
      },
    );

    if (thumbnailUploadError) {
      throw new Error(
        `Impossibile caricare la thumbnail: ${thumbnailUploadError.message}`,
      );
    }

    return await registerAdminProductImage({
      productId,
      storagePath: preparedUpload.storagePath,
      thumbnailStoragePath: preparedUpload.thumbnailStoragePath,
      altText: `Immagine di ${productName}`,
      width,
      height,
    });
  } catch (uploadError) {
    if (preparedUpload) {
      try {
        await discardAdminProductImageUpload({
          productId,
          storagePath: preparedUpload.storagePath,
          thumbnailStoragePath: preparedUpload.thumbnailStoragePath,
        });
      } catch (cleanupError) {
        console.error(
          "[admin-product-image] Pulizia upload incompleto fallita.",
          cleanupError,
        );
      }
    }

    throw uploadError;
  }
}
