"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import {
  updateAdminProduct,
  type AdminProductEditInput,
} from "@/server/admin/admin-product-edit";
import type {
  AdminProductDetail,
  AdminProductEditOptions,
} from "@/server/admin/admin-products";

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

function moneyFromMinor(amountMinor: number | null) {
  if (amountMinor === null) return "";

  return (amountMinor / 100).toFixed(2).replace(".", ",");
}

function vatFromBasisPoints(value: number | null) {
  if (value === null) return "";

  return String(value / 100).replace(".", ",");
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

export function AdminProductEditForm({
  product,
  options,
}: {
  product: AdminProductDetail;
  options: AdminProductEditOptions;
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    code: product.code,
    name: product.name,
    slug: product.slug,
    brandId: product.brandId ?? "",
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId ?? "",
    description: product.description ?? "",
    tastingNotes: product.tastingNotes ?? "",
    serviceNotes: product.serviceNotes ?? "",
    origin: product.origin ?? "",
    producer: product.producer ?? "",
    country: product.country ?? "",
    capacityMl: product.capacityMl === null ? "" : String(product.capacityMl),
    capacityLabel: product.capacityLabel,
    packQuantity:
      product.packQuantity === null ? "" : String(product.packQuantity),
    alcoholPercentage:
      product.alcoholPercentage === null
        ? ""
        : String(product.alcoholPercentage).replace(".", ","),
    isNew: product.isNew,
    isLimited: product.isLimited,
    netAmount: moneyFromMinor(product.netAmountMinor),
    vatPercentage: vatFromBasisPoints(product.vatRateBasisPoints),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableSubcategories = useMemo(
    () =>
      options.subcategories.filter(
        (subcategory) => subcategory.parentId === form.categoryId,
      ),
    [options.subcategories, form.categoryId],
  );

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSuccess(null);
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function buildInput(): AdminProductEditInput {
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
      productId: product.id,
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
      packQuantity: parseOptionalInteger(form.packQuantity),
      alcoholPercentage,
      isNew: form.isNew,
      isLimited: form.isLimited,
      netAmountMinor: parseMoneyMinor(form.netAmount),
      vatRateBasisPoints: parseVatBasisPoints(form.vatPercentage),
    };
  }

  function requestSave() {
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

  function cancelDialog() {
    if (isPending) return;

    setDialogOpen(false);
  }

  function confirmSave() {
    let input: AdminProductEditInput;

    try {
      input = buildInput();
    } catch (caught) {
      setDialogOpen(false);
      setError(
        caught instanceof Error ? caught.message : "Controlla i dati inseriti.",
      );
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        await updateAdminProduct(input);

        setDialogOpen(false);
        setSuccess("Modifiche salvate correttamente.");
        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Impossibile aggiornare il prodotto.",
        );
      }
    });
  }

  return (
    <>
      <div className="space-y-6">
        {success ? (
          <div
            role="status"
            className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
          >
            {success}
          </div>
        ) : null}

        {error && !dialogOpen ? (
          <div
            role="alert"
            className="rounded-md border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        ) : null}

        <section className="rounded-lg border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-white">
            Anagrafica prodotto
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Codice prodotto">
              <input
                value={form.code}
                onChange={(event) => setField("code", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Nome prodotto">
              <input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Slug">
              <input
                value={form.slug}
                onChange={(event) => setField("slug", event.target.value)}
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

            <Field label="Categoria">
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
        </section>

        <section className="rounded-lg border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-white">
            Caratteristiche
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Formato">
              <input
                value={form.capacityLabel}
                onChange={(event) =>
                  setField("capacityLabel", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Capacità (ml)">
              <input
                inputMode="numeric"
                value={form.capacityMl}
                onChange={(event) => setField("capacityMl", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Quantità confezione">
              <input
                inputMode="numeric"
                value={form.packQuantity}
                onChange={(event) =>
                  setField("packQuantity", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Gradazione % Vol.">
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

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <label className="flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(event) => setField("isNew", event.target.checked)}
                className="size-4 rounded border-white/20 bg-[#111111]"
              />
              Nuovo
            </label>

            <label className="flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.isLimited}
                onChange={(event) =>
                  setField("isLimited", event.target.checked)
                }
                className="size-4 rounded border-white/20 bg-[#111111]"
              />
              Edizione limitata
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-white">
            Contenuti prodotto
          </h2>

          <div className="mt-5 space-y-5">
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

            <Field label="Note di degustazione">
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
        </section>

        <section className="rounded-lg border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-white">Prezzo</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Prezzo netto (€)">
              <input
                inputMode="decimal"
                value={form.netAmount}
                onChange={(event) => setField("netAmount", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="IVA (%)">
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

          <p className="mt-4 text-xs leading-5 text-white/30">
            Lo storico prezzi viene mantenuto automaticamente.
          </p>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={requestSave}
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-50"
          >
            Salva modifiche
          </button>
        </div>
      </div>

      <AdminConfirmDialog
        open={dialogOpen}
        eyebrow="Prodotto"
        title="Conferma modifiche"
        description={
          <>
            Stai per aggiornare i dati di{" "}
            <strong className="font-semibold text-white">
              {form.name || product.name}
            </strong>
            .
            <br />
            <br />
            Le modifiche saranno applicate anche allo store.
          </>
        }
        confirmLabel="Salva modifiche"
        pendingLabel="Salvataggio…"
        pending={isPending}
        error={error}
        onConfirm={confirmSave}
        onCancel={cancelDialog}
      />
    </>
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
      <span className="text-xs font-medium text-white/45">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none transition focus:border-orange-400/60";

const textareaClass =
  "w-full rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm leading-6 text-white outline-none transition focus:border-orange-400/60";
