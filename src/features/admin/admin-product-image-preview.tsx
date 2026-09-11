"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminProductImageDeleteButton } from "@/features/admin/admin-product-image-delete-button";
import { uploadAdminProductImage } from "@/features/admin/admin-product-image-upload";
import {
  getProductImageAdvisories,
  validateProductImageDimensions,
} from "@/lib/product-image-processing";
import { resolveProductImageUrl } from "@/lib/product-image-url";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

type ExistingImage = {
  storagePath: string;
  altText: string;
  width: number;
  height: number;
} | null;

type ImageDimensions = {
  width: number;
  height: number;
};

function isAllowedImageType(value: string): value is AllowedImageType {
  return ALLOWED_IMAGE_TYPES.some((type) => type === value);
}

function readImageDimensions(url: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        reject(new Error("Dimensioni immagine non valide."));
        return;
      }

      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      reject(new Error("Il file selezionato non è un’immagine valida."));
    };

    image.src = url;
  });
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Si è verificato un errore durante il caricamento dell’immagine.";
}

export function AdminProductImagePreview({
  productId,
  productName,
  image,
}: {
  productId: string;
  productName: string;
  image: ExistingImage;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] =
    useState<ImageDimensions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function clearPreview() {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setPreviewName(null);
    setPreviewDimensions(null);
    setError(null);
    resetInput();
  }

  async function selectFile(file: File | undefined) {
    setError(null);
    setSuccess(null);

    if (!file) return;

    if (!isAllowedImageType(file.type)) {
      setError("Formato non supportato. Usa JPG, JPEG, PNG oppure WebP.");
      resetInput();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L’immagine supera il limite massimo di 5 MB.");
      resetInput();
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    setPreviewName(file.name);
    setPreviewDimensions(null);

    try {
      const dimensions = await readImageDimensions(nextPreviewUrl);
      const dimensionError = validateProductImageDimensions(dimensions);

      if (dimensionError) {
        throw new Error(dimensionError);
      }

      setPreviewDimensions(dimensions);
    } catch (selectionError) {
      URL.revokeObjectURL(nextPreviewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      setPreviewName(null);
      setPreviewDimensions(null);
      setError(errorMessage(selectionError));
      resetInput();
    }
  }

  async function saveImage() {
    if (!selectedFile || !previewUrl || !previewDimensions) {
      setError("Seleziona un’immagine valida prima di salvarla.");
      return;
    }

    if (!isAllowedImageType(selectedFile.type)) {
      setError("Formato non supportato. Usa JPG, JPEG, PNG oppure WebP.");
      return;
    }

    const dimensionError = validateProductImageDimensions(previewDimensions);

    if (dimensionError) {
      setError(dimensionError);
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadAdminProductImage({
        productId,
        productName,
        file: selectedFile,
        width: previewDimensions.width,
        height: previewDimensions.height,
      });

      clearPreview();
      setSuccess("Immagine e thumbnail salvate correttamente.");
      router.refresh();
    } catch (uploadError) {
      setError(errorMessage(uploadError));
    } finally {
      setIsUploading(false);
    }
  }

  const displayedUrl =
    previewUrl ??
    (image
      ? resolveProductImageUrl(image.storagePath)
      : "/images/placeholder-bottle.svg");

  const displayedAlt = previewUrl
    ? `Anteprima nuova immagine di ${productName}`
    : image?.altText || `Immagine di ${productName}`;

  const advisories = previewDimensions
    ? getProductImageAdvisories(previewDimensions)
    : [];

  return (
    <section className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-white">
          Immagine prodotto
        </h2>

        <p className="text-sm leading-6 text-white/45">
          Visualizza l’immagine attuale oppure selezionane una nuova per
          controllarne l’anteprima prima del caricamento.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
          <div className="aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayedUrl}
              alt={displayedAlt}
              className="h-full w-full object-contain p-4"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-white">
              {previewUrl
                ? "Nuova immagine selezionata"
                : image
                  ? "Immagine attuale"
                  : "Nessuna immagine caricata"}
            </p>

            {previewName ? (
              <p className="mt-1 text-xs break-all text-white/40">
                {previewName}
              </p>
            ) : null}

            {previewDimensions ? (
              <p className="mt-1 text-xs text-white/35">
                {previewDimensions.width} × {previewDimensions.height} px
              </p>
            ) : image && !previewUrl ? (
              <p className="mt-1 text-xs text-white/35">
                {image.width} × {image.height} px
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border border-white/10 bg-[#111111] p-4">
            <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">
              Requisiti immagine
            </p>

            <ul className="mt-3 space-y-2 text-sm text-white/45">
              <li>• JPG, JPEG, PNG oppure WebP</li>
              <li>• Dimensione massima: 5 MB</li>
              <li>• Minimo consigliato: 800 × 1000 px</li>
              <li>• Consigliato: 1200 × 1500 px</li>
              <li>• Formato verticale consigliato: 4:5</li>
              <li>• Thumbnail WebP generata automaticamente</li>
            </ul>
          </div>

          {advisories.length > 0 ? (
            <div
              role="status"
              className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
            >
              <p className="font-medium">Controlla la qualità dell’immagine</p>
              <ul className="mt-2 space-y-1 text-amber-100/75">
                {advisories.map((advisory) => (
                  <li key={advisory}>• {advisory}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          ) : null}

          {success ? (
            <div
              role="status"
              className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
            >
              {success}
            </div>
          ) : null}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={isUploading}
            onChange={(event) => {
              void selectFile(event.target.files?.[0]);
            }}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {image || previewUrl
                ? "Seleziona nuova immagine"
                : "Seleziona immagine"}
            </button>

            {previewUrl ? (
              <>
                <button
                  type="button"
                  disabled={isUploading || !previewDimensions}
                  onClick={() => {
                    void saveImage();
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? "Caricamento in corso…" : "Salva immagine"}
                </button>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={clearPreview}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Annulla anteprima
                </button>
              </>
            ) : null}

            {image && !previewUrl ? (
              <AdminProductImageDeleteButton
                productId={productId}
                productName={productName}
              />
            ) : null}
          </div>

          {previewUrl ? (
            <p className="text-xs leading-5 text-orange-200/70">
              Questa è solo un’anteprima locale. L’immagine non è ancora stata
              salvata. Premi “Salva immagine” per completare il caricamento.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
