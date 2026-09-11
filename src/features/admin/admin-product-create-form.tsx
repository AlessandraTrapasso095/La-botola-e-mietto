"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import {
  AdminProductCreateImageField,
  type AdminProductCreateImageSelection,
} from "@/features/admin/admin-product-create-image-field";
import { uploadAdminProductImage } from "@/features/admin/admin-product-image-upload";
import {
  createAdminProduct,
  type AdminProductCreateInput,
} from "@/server/admin/admin-product-create";
import type { AdminProductEditOptions } from "@/server/admin/admin-products";

type FormState = {
  code: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  tastingNotes: string;
  serviceNotes: string;
  origin: string;
  producer: string;
  country: string;
  capacityMl: string;
  capacityLabel: string;
  packQuantity: string;
  alcoholPercentage: string;
  isNew: boolean;
  isLimited: boolean;
  netAmount: string;
  vatPercentage: string;
};

function makeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseOptionalInteger(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const parsed = Number.parseInt(trimmed, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Inserisci un numero intero maggiore di zero.");
  }

  return parsed;
}

function parseRequiredInteger(value: string, label: string) {
  const parsed = Number.parseInt(value.trim(), 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${label}: inserisci un numero intero maggiore di zero.`);
  }

  return parsed;
}

function parseOptionalNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const parsed = Number(trimmed.replace(",", "."));

  if (!Number.isFinite(parsed)) {
    throw new Error("Inserisci un valore numerico valido.");
  }

  return parsed;
}

function parseMoneyMinor(value: string) {
  const parsed = Number(value.trim().replace(",", "."));

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Inserisci un prezzo valido.");
  }

  return Math.round(parsed * 100);
}

function parseVatBasisPoints(value: string) {
  const parsed = Number(value.trim().replace(",", "."));

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error("Inserisci un’aliquota IVA valida.");
  }

  return Math.round(parsed * 100);
}

export function AdminProductCreateForm({
  options,
}: {
  options: AdminProductEditOptions;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<FormState>({
    code: "",
    name: "",
    slug: "",
    brandId: "",
    categoryId: options.categories[0]?.id ?? "",
    subcategoryId: "",
    description: "",
    tastingNotes: "",
    serviceNotes: "",
    origin: "",
    producer: "",
    country: "",
    capacityMl: "",
    capacityLabel: "",
    packQuantity: "1",
    alcoholPercentage: "",
    isNew: false,
    isLimited: false,
    netAmount: "",
    vatPercentage: "22",
  });

  const [slugTouched, setSlugTouched] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] =
    useState<AdminProductCreateImageSelection | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const availableSubcategories = useMemo(
    () =>
      options.subcategories.filter((item) => item.parentId === form.categoryId),
    [form.categoryId, options.subcategories],
  );

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setError(null);
  }

  function buildInput(): AdminProductCreateInput {
    if (!form.code.trim()) {
      throw new Error("Il codice prodotto è obbligatorio.");
    }

    if (!form.name.trim()) {
      throw new Error("Il nome prodotto è obbligatorio.");
    }

    if (!form.slug.trim()) {
      throw new Error("Lo slug è obbligatorio.");
    }

    if (!form.categoryId) {
      throw new Error("La categoria è obbligatoria.");
    }

    if (!form.capacityLabel.trim()) {
      throw new Error("Il formato è obbligatorio.");
    }

    const alcoholPercentage = parseOptionalNumber(form.alcoholPercentage);

    if (
      alcoholPercentage !== null &&
      (alcoholPercentage < 0 || alcoholPercentage > 100)
    ) {
      throw new Error("La gradazione deve essere compresa tra 0 e 100.");
    }

    return {
      code: form.code.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      brandId: form.brandId || null,
      categoryId: form.categoryId,
      subcategoryId: form.subcategoryId || null,
      description: form.description,
      tastingNotes: form.tastingNotes,
      serviceNotes: form.serviceNotes,
      origin: form.origin,
      producer: form.producer,
      country: form.country,
      capacityMl: parseOptionalInteger(form.capacityMl),
      capacityLabel: form.capacityLabel.trim(),
      packQuantity: parseRequiredInteger(
        form.packQuantity,
        "Quantità confezione",
      ),
      alcoholPercentage,
      isNew: form.isNew,
      isLimited: form.isLimited,
      netAmountMinor: parseMoneyMinor(form.netAmount),
      vatRateBasisPoints: parseVatBasisPoints(form.vatPercentage),
    };
  }

  function requestCreate() {
    try {
      buildInput();
      setError(null);
      setDialogOpen(true);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Controlla i dati inseriti.",
      );
    }
  }

  function confirmCreate() {
    let input: AdminProductCreateInput;

    try {
      input = buildInput();
    } catch (caught) {
      setDialogOpen(false);
      setError(
        caught instanceof Error ? caught.message : "Controlla i dati inseriti.",
      );
      return;
    }

    startTransition(async () => {
      let productId: string | null = null;

      try {
        productId = await createAdminProduct(input);

        if (selectedImage) {
          await uploadAdminProductImage({
            productId,
            productName: input.name,
            file: selectedImage.file,
            width: selectedImage.width,
            height: selectedImage.height,
          });
        }

        setDialogOpen(false);
        router.push(`/admin/prodotti/${productId}`);
        router.refresh();
      } catch (caught) {
        if (productId) {
          const message =
            caught instanceof Error
              ? caught.message
              : "errore non identificato durante il caricamento";

          setDialogOpen(false);
          setCreatedProductId(productId);
          setError(
            `Il prodotto è stato creato come Bozza, ma non è stato possibile caricare l’immagine: ${message}`,
          );
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Impossibile creare il prodotto.",
        );
      }
    });
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-lg border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm leading-6 text-orange-200">
          Il nuovo prodotto verrà creato inizialmente come{" "}
          <strong>Bozza</strong>. Puoi selezionare subito l’immagine: verrà
          caricata automaticamente insieme alla relativa thumbnail.
        </div>

        {error && !dialogOpen ? (
          <div
            role="alert"
            className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        ) : null}

        <Section title="Anagrafica prodotto">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Codice prodotto *">
              <input
                value={form.code}
                onChange={(event) => setField("code", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Nome prodotto *">
              <input
                value={form.name}
                onChange={(event) => {
                  const value = event.target.value;
                  setField("name", value);

                  if (!slugTouched) {
                    setField("slug", makeSlug(value));
                  }
                }}
                className={inputClass}
              />
            </Field>

            <Field label="Slug *">
              <input
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setField("slug", event.target.value);
                }}
                className={inputClass}
              />
            </Field>

            <Field label="Marchio">
              <select
                value={form.brandId}
                onChange={(event) => setField("brandId", event.target.value)}
                className={inputClass}
              >
                <option value="">Nessun marchio</option>

                {options.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Categoria *">
              <select
                value={form.categoryId}
                onChange={(event) => {
                  setField("categoryId", event.target.value);
                  setField("subcategoryId", "");
                }}
                className={inputClass}
              >
                {options.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sottocategoria">
              <select
                value={form.subcategoryId}
                onChange={(event) =>
                  setField("subcategoryId", event.target.value)
                }
                className={inputClass}
              >
                <option value="">Nessuna sottocategoria</option>

                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Produttore">
              <input
                value={form.producer}
                onChange={(event) => setField("producer", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Paese">
              <input
                value={form.country}
                onChange={(event) => setField("country", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Origine">
              <input
                value={form.origin}
                onChange={(event) => setField("origin", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section title="Caratteristiche">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Formato *">
              <input
                value={form.capacityLabel}
                onChange={(event) =>
                  setField("capacityLabel", event.target.value)
                }
                placeholder="Es. 70 cl"
                className={inputClass}
              />
            </Field>

            <Field label="Capacità ml">
              <input
                inputMode="numeric"
                value={form.capacityMl}
                onChange={(event) => setField("capacityMl", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Quantità confezione *">
              <input
                inputMode="numeric"
                value={form.packQuantity}
                onChange={(event) =>
                  setField("packQuantity", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Gradazione %">
              <input
                inputMode="decimal"
                value={form.alcoholPercentage}
                onChange={(event) =>
                  setField("alcoholPercentage", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap gap-6">
            <Checkbox
              checked={form.isNew}
              label="Novità"
              onChange={(checked) => setField("isNew", checked)}
            />

            <Checkbox
              checked={form.isLimited}
              label="Edizione limitata"
              onChange={(checked) => setField("isLimited", checked)}
            />
          </div>
        </Section>

        <Section title="Contenuti">
          <div className="grid gap-5">
            <Field label="Descrizione">
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                className={textareaClass}
              />
            </Field>

            <Field label="Note degustazione">
              <textarea
                rows={4}
                value={form.tastingNotes}
                onChange={(event) =>
                  setField("tastingNotes", event.target.value)
                }
                className={textareaClass}
              />
            </Field>

            <Field label="Note di servizio">
              <textarea
                rows={4}
                value={form.serviceNotes}
                onChange={(event) =>
                  setField("serviceNotes", event.target.value)
                }
                className={textareaClass}
              />
            </Field>
          </div>
        </Section>

        <Section title="Prezzo">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Prezzo netto € *">
              <input
                inputMode="decimal"
                value={form.netAmount}
                onChange={(event) => setField("netAmount", event.target.value)}
                placeholder="0,00"
                className={inputClass}
              />
            </Field>

            <Field label="IVA % *">
              <input
                inputMode="decimal"
                value={form.vatPercentage}
                onChange={(event) =>
                  setField("vatPercentage", event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <AdminProductCreateImageField
          productName={form.name}
          disabled={isPending || Boolean(createdProductId)}
          onSelectionChange={setSelectedImage}
        />

        <div className="flex flex-wrap gap-3">
          {createdProductId ? (
            <button
              type="button"
              onClick={() => router.push(`/admin/prodotti/${createdProductId}`)}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              Apri prodotto creato
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={requestCreate}
                disabled={isPending}
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending
                  ? selectedImage
                    ? "Creazione e caricamento…"
                    : "Creazione…"
                  : "Crea prodotto"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/prodotti")}
                disabled={isPending}
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/10 px-6 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                Annulla
              </button>
            </>
          )}
        </div>
      </div>

      <AdminConfirmDialog
        open={dialogOpen}
        eyebrow="Nuovo prodotto"
        title="Creare questo prodotto?"
        description={
          selectedImage
            ? "Il prodotto verrà salvato come Bozza insieme all’immagine selezionata e alla relativa thumbnail."
            : "Il prodotto verrà salvato come Bozza. Potrai aggiungere l’immagine anche successivamente."
        }
        confirmLabel={
          selectedImage ? "Sì, crea e carica immagine" : "Sì, crea prodotto"
        }
        pendingLabel={selectedImage ? "Creazione e caricamento…" : "Creazione…"}
        pending={isPending}
        error={dialogOpen ? error : null}
        onConfirm={confirmCreate}
        onCancel={() => {
          if (isPending) return;
          setDialogOpen(false);
          setError(null);
        }}
      />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-white/50">{label}</span>

      {children}
    </label>
  );
}

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-white/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />

      {label}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/60";

const textareaClass =
  "w-full rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm leading-6 text-white outline-none transition focus:border-orange-400/60";
