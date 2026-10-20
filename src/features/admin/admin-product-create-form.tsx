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

function parseOptionalInteger(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;

  if (!/^\d+$/.test(trimmed)) {
    throw new Error(`${label}: inserisci solo un numero intero, senza lettere o simboli.`);
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${label}: inserisci un numero intero maggiore di zero.`);
  }

  return parsed;
}

function parseRequiredInteger(value: string, label: string) {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    throw new Error(`${label}: inserisci solo un numero intero, senza lettere o simboli.`);
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${label}: inserisci un numero intero maggiore di zero.`);
  }

  return parsed;
}

function parseOptionalNumber(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const normalized = trimmed.replace(",", ".");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      `${label}: inserisci solo il numero, ad esempio 40 oppure 40,5.`,
    );
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

  const grossPricePreview = useMemo(() => {
    const net = Number(form.netAmount.trim().replace(",", "."));
    const vat = Number(form.vatPercentage.trim().replace(",", "."));

    if (
      !Number.isFinite(net) ||
      !Number.isFinite(vat) ||
      net < 0 ||
      vat < 0 ||
      vat > 100
    ) {
      return null;
    }

    return net * (1 + vat / 100);
  }, [form.netAmount, form.vatPercentage]);

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

    const alcoholPercentage = parseOptionalNumber(
      form.alcoholPercentage,
      "Gradazione",
    );

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
      capacityMl: parseOptionalInteger(form.capacityMl, "Capacità"),
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
        const result = await createAdminProduct(input);

        if (!result.ok) {
          setDialogOpen(false);
          setError(result.error);
          return;
        }

        productId = result.productId;

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
        <div className="overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/15 via-orange-400/[0.06] to-transparent">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold tracking-[0.18em] text-orange-300 uppercase">
                  Nuovo prodotto
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                  Inserisci il prodotto passo dopo passo
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  Compila prima i dati essenziali. Tutto ciò che è indicato come
                  facoltativo può essere aggiunto anche dopo.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/55">
                <strong className="text-white">Non preoccuparti dello slug.</strong>
                <br />
                L’indirizzo della pagina viene creato automaticamente dal nome.
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <GuideStep number="1" label="Inserisci i dati" />
              <GuideStep number="2" label="Controlla il riepilogo" />
              <GuideStep number="3" label="Crea come bozza" />
            </div>
          </div>
        </div>

        {error && !dialogOpen ? (
          <div
            role="alert"
            className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        ) : null}

        <Section
          step="1"
          title="Dati principali"
          description="Qui inserisci le informazioni che identificano il prodotto nel catalogo."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Codice prodotto *">
              <input
                value={form.code}
                onChange={(event) => setField("code", event.target.value)}
                placeholder="Es. AB1234"
                className={inputClass}
              />
            </Field>

            <Field label="Nome prodotto *">
              <input
                value={form.name}
                placeholder="Es. Barolo DOCG 2021"
                onChange={(event) => {
                  const value = event.target.value;
                  setField("name", value);

                  setField("slug", makeSlug(value));
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

        <Section
          step="2"
          title="Formato e caratteristiche"
          description="Indica formato, capacità e gradazione. I campi facoltativi possono essere lasciati vuoti."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Formato commerciale *">
              <input
                value={form.capacityLabel}
                onChange={(event) =>
                  setField("capacityLabel", event.target.value)
                }
                placeholder="Es. 70 cl, 75 cl oppure 1 L"
                className={inputClass}
              />
            </Field>

            <Field label="Capacità in ml (facoltativa)">
              <input
                inputMode="numeric"
                value={form.capacityMl}
                onChange={(event) => setField("capacityMl", event.target.value)}
                placeholder="Es. 700"
                className={inputClass}
              />
            </Field>

            <Field label="Pezzi nella confezione *">
              <input
                inputMode="numeric"
                value={form.packQuantity}
                onChange={(event) =>
                  setField("packQuantity", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Gradazione alcolica % (facoltativa)">
              <input
                inputMode="decimal"
                value={form.alcoholPercentage}
                onChange={(event) =>
                  setField("alcoholPercentage", event.target.value)
                }
                placeholder="Es. 40 oppure 40,5"
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

        <Section
          step="3"
          title="Descrizione e note"
          description="Questa parte è facoltativa: serve a raccontare meglio il prodotto nello store."
        >
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

        <Section
          step="4"
          title="Prezzo"
          description="Inserisci il prezzo netto. Il prezzo finale IVA inclusa viene calcolato automaticamente."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Prezzo netto (€) *">
              <input
                inputMode="decimal"
                value={form.netAmount}
                onChange={(event) => setField("netAmount", event.target.value)}
                placeholder="Es. 39,90"
                className={inputClass}
              />
            </Field>

            <Field label="IVA % * (normalmente 22)">
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

          <div className="mt-5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-xs font-medium text-emerald-200/70">
                Prezzo che vedrà il cliente
              </p>
              <p className="mt-1 text-xs leading-5 text-white/35">
                Calcolato automaticamente aggiungendo l’IVA al prezzo netto.
              </p>
            </div>

            <p className="mt-3 text-2xl font-semibold text-emerald-300 sm:mt-0">
              {grossPricePreview === null
                ? "—"
                : new Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(grossPricePreview)}
            </p>
          </div>
        </Section>

        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-black">
              5
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">
                Immagine prodotto
              </h2>
              <p className="mt-0.5 text-xs text-white/40">
                Facoltativa. Puoi inserirla ora oppure aggiungerla più tardi.
              </p>
            </div>
          </div>

          <AdminProductCreateImageField
          productName={form.name}
          disabled={isPending || Boolean(createdProductId)}
            onSelectionChange={setSelectedImage}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm font-semibold text-white">
              Tutto pronto?
            </p>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Il prodotto sarà creato come bozza. Potrai controllarlo e
              pubblicarlo dalla sua scheda.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
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
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isPending
                  ? selectedImage
                    ? "Sto creando il prodotto e caricando l’immagine…"
                    : "Sto creando il prodotto…"
                  : "Crea prodotto"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/prodotti")}
                disabled={isPending}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 px-6 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white sm:w-auto"
              >
                Annulla
              </button>
            </>
          )}
          </div>
        </div>
      </div>

      <AdminConfirmDialog
        open={dialogOpen}
        eyebrow="Nuovo prodotto"
        title="Confermi la creazione?"
        description={
          selectedImage
            ? "Controlla i dati un’ultima volta. Il prodotto verrà creato come Bozza e verrà caricata anche l’immagine selezionata."
            : "Controlla i dati un’ultima volta. Il prodotto verrà creato come Bozza e potrai aggiungere l’immagine anche successivamente."
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
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#171717]">
      <div className="border-b border-white/10 bg-white/[0.02] px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-black">
            {step}
          </span>

          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-white/40">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function GuideStep({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
        {number}
      </span>
      <span className="text-xs font-medium text-white/60">{label}</span>
    </div>
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
