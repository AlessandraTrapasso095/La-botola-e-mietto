"use client";

import { useEffect, useRef, useState } from "react";

import {
  getProductImageAdvisories,
  validateProductImageDimensions,
} from "@/lib/product-image-processing";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

type ImageDimensions = {
  width: number;
  height: number;
};

export type AdminProductCreateImageSelection = {
  file: File;
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
    : "Non è stato possibile leggere l’immagine selezionata.";
}

export function AdminProductCreateImageField({
  productName,
  disabled,
  onSelectionChange,
}: {
  productName: string;
  disabled: boolean;
  onSelectionChange: (
    selection: AdminProductCreateImageSelection | null,
  ) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] =
    useState<ImageDimensions | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  function clearSelection() {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPreviewName(null);
    setPreviewDimensions(null);
    setError(null);
    onSelectionChange(null);
    resetInput();
  }

  async function selectFile(file: File | undefined) {
    setError(null);
    onSelectionChange(null);

    if (!file) {
      return;
    }

    if (!isAllowedImageType(file.type)) {
      setError("Formato non supportato. Usa JPG, JPEG, PNG oppure WebP.");
      resetInput();
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("L’immagine supera il limite massimo di 5 MB.");
      resetInput();
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);

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
      onSelectionChange({
        file,
        width: dimensions.width,
        height: dimensions.height,
      });
    } catch (selectionError) {
      URL.revokeObjectURL(nextPreviewUrl);
      setPreviewUrl(null);
      setPreviewName(null);
      setPreviewDimensions(null);
      setError(errorMessage(selectionError));
      resetInput();
    }
  }

  const advisories = previewDimensions
    ? getProductImageAdvisories(previewDimensions)
    : [];

  const safeProductName = productName.trim() || "nuovo prodotto";

  return (
    <section className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-white">
          Immagine prodotto
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/45">
          Puoi aggiungere subito l’immagine oppure farlo successivamente dal
          dettaglio prodotto. Il prodotto verrà comunque creato come Bozza.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
          <div className="aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl ?? "/images/placeholder-bottle.svg"}
              alt={
                previewUrl
                  ? `Anteprima immagine di ${safeProductName}`
                  : "Immagine prodotto non ancora selezionata"
              }
              className="h-full w-full object-contain p-4"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-white">
              {previewUrl
                ? "Immagine pronta per il caricamento"
                : "Nessuna immagine selezionata"}
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

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={disabled}
            onChange={(event) => {
              void selectFile(event.target.files?.[0]);
            }}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {previewUrl ? "Sostituisci immagine" : "Seleziona immagine"}
            </button>

            {previewUrl ? (
              <button
                type="button"
                disabled={disabled}
                onClick={clearSelection}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Rimuovi immagine
              </button>
            ) : null}
          </div>

          {previewUrl ? (
            <p className="text-xs leading-5 text-orange-200/70">
              L’immagine verrà caricata insieme al nuovo prodotto dopo la
              conferma.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
