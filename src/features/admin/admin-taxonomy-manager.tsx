"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import {
  deleteAdminBrand,
  deleteAdminCategory,
  upsertAdminBrand,
  upsertAdminCategory,
} from "@/server/admin/admin-taxonomy";
import type {
  AdminTaxonomyBrand,
  AdminTaxonomyCategory,
  AdminTaxonomyData,
} from "@/server/admin/admin-products";

type Status = "draft" | "active" | "archived";
type TaxonomyKind = "brands" | "categories" | "subcategories";

type ConfirmState =
  | {
      type: "save";
      title: string;
      description: string;
      action: () => Promise<void>;
    }
  | {
      type: "back";
      title: string;
      description: string;
      action: () => void;
    }
  | {
      type: "delete";
      title: string;
      description: string;
      action: () => Promise<void>;
    }
  | null;

type BrowserState = {
  kind: TaxonomyKind;
  mode: "list" | "edit";
  editId: string | null;
} | null;

function makeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminTaxonomyManager({ data }: { data: AdminTaxonomyData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [browser, setBrowser] = useState<BrowserState>(null);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function openBrowser(kind: TaxonomyKind) {
    setSearch("");
    setError(null);
    setBrowser({
      kind,
      mode: "list",
      editId: null,
    });
  }

  function closeBrowser() {
    if (isPending) return;

    setBrowser(null);
    setSearch("");
    setError(null);
  }

  function requestSave(
    title: string,
    description: string,
    action: () => Promise<void>,
  ) {
    setError(null);
    setConfirm({
      type: "save",
      title,
      description,
      action,
    });
  }

  function requestBackToList() {
    if (!browser || browser.mode !== "edit") return;

    setConfirm({
      type: "back",
      title: "Tornare all’elenco?",
      description:
        "Sei sicuro di voler tornare indietro? Le modifiche non salvate andranno perse.",
      action: () => {
        setBrowser({
          ...browser,
          mode: "list",
          editId: null,
        });
        setError(null);
      },
    });
  }

  function confirmAction() {
    if (!confirm || isPending) return;

    if (confirm.type === "back") {
      confirm.action();
      setConfirm(null);
      return;
    }

    const actionType = confirm.type;

    startTransition(async () => {
      try {
        await confirm.action();

        setConfirm(null);
        setSuccess(
          actionType === "delete"
            ? "Elemento eliminato correttamente."
            : "Modifica salvata correttamente.",
        );

        if (browser?.mode === "edit") {
          setBrowser({
            ...browser,
            mode: "list",
            editId: null,
          });
        }

        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Impossibile salvare la modifica.",
        );
      }
    });
  }

  return (
    <>
      <div className="space-y-8">
        {success ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
          >
            {success}
          </div>
        ) : null}

        <ManagementCard
          title="Marchi"
          description="Aggiungi un nuovo marchio al catalogo."
          browserLabel="Visualizza tutti i marchi"
          onBrowse={() => openBrowser("brands")}
        >
          <BrandForm
            item={null}
            onSave={(input) =>
              requestSave(
                "Conferma nuovo marchio",
                `Vuoi aggiungere il marchio "${input.name}"?`,
                () => upsertAdminBrand(input),
              )
            }
          />
        </ManagementCard>

        <ManagementCard
          title="Categorie"
          description="Aggiungi una nuova categoria principale."
          browserLabel="Visualizza tutte le categorie"
          onBrowse={() => openBrowser("categories")}
        >
          <CategoryForm
            item={null}
            parentId={null}
            onSave={(input) =>
              requestSave(
                "Conferma nuova categoria",
                `Vuoi aggiungere la categoria "${input.name}"?`,
                () => upsertAdminCategory(input),
              )
            }
          />
        </ManagementCard>

        <ManagementCard
          title="Sottocategorie"
          description="Aggiungi una sottocategoria e collegala alla categoria principale."
          browserLabel="Visualizza tutte le sottocategorie"
          onBrowse={() => openBrowser("subcategories")}
        >
          <SubcategoryForm
            item={null}
            categories={data.categories}
            onSave={(input) =>
              requestSave(
                "Conferma nuova sottocategoria",
                `Vuoi aggiungere la sottocategoria "${input.name}"?`,
                () => upsertAdminCategory(input),
              )
            }
          />
        </ManagementCard>
      </div>

      {browser ? (
        <TaxonomyBrowser
          browser={browser}
          data={data}
          search={search}
          onSearchChange={setSearch}
          onClose={closeBrowser}
          onEdit={(id) =>
            setBrowser({
              ...browser,
              mode: "edit",
              editId: id,
            })
          }
          onBack={requestBackToList}
          onSaveBrand={(input) =>
            requestSave(
              "Conferma modifica marchio",
              `Vuoi salvare le modifiche a "${input.name}"?`,
              () => upsertAdminBrand(input),
            )
          }
          onSaveCategory={(input) =>
            requestSave(
              browser.kind === "subcategories"
                ? "Conferma modifica sottocategoria"
                : "Conferma modifica categoria",
              `Vuoi salvare le modifiche a "${input.name}"?`,
              () => upsertAdminCategory(input),
            )
          }
          onDelete={(id, name) => {
            setConfirm({
              type: "delete",
              title: `Eliminare "${name}"?`,
              description:
                "Questa operazione rimuoverà l’elemento dal catalogo. Sei sicuro di voler continuare?",
              action: () =>
                browser.kind === "brands"
                  ? deleteAdminBrand(id)
                  : deleteAdminCategory(id),
            });
          }}
          error={error}
        />
      ) : null}

      <AdminConfirmDialog
        open={Boolean(confirm)}
        eyebrow="Catalogo"
        title={confirm?.title ?? ""}
        description={confirm?.description ?? ""}
        confirmLabel={
          confirm?.type === "back"
            ? "Sì, torna indietro"
            : confirm?.type === "delete"
              ? "Sì, elimina"
              : "Conferma"
        }
        pendingLabel="Salvataggio…"
        pending={isPending}
        error={
          confirm?.type === "save" || confirm?.type === "delete" ? error : null
        }
        onConfirm={confirmAction}
        onCancel={() => {
          if (isPending) return;
          setConfirm(null);
          setError(null);
        }}
      />
    </>
  );
}

function TaxonomyBrowser({
  browser,
  data,
  search,
  onSearchChange,
  onClose,
  onEdit,
  onBack,
  onSaveBrand,
  onSaveCategory,
  onDelete,
  error,
}: {
  browser: NonNullable<BrowserState>;
  data: AdminTaxonomyData;
  search: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onEdit: (id: string) => void;
  onBack: () => void;
  onSaveBrand: (input: Parameters<typeof upsertAdminBrand>[0]) => void;
  onSaveCategory: (input: Parameters<typeof upsertAdminCategory>[0]) => void;
  onDelete: (id: string, name: string) => void;
  error: string | null;
}) {
  const title =
    browser.kind === "brands"
      ? "Tutti i marchi"
      : browser.kind === "categories"
        ? "Tutte le categorie"
        : "Tutte le sottocategorie";

  const categoryById = useMemo(
    () =>
      new Map(data.categories.map((category) => [category.id, category.name])),
    [data.categories],
  );

  const normalizedSearch = search.trim().toLowerCase();

  const rows = useMemo(() => {
    if (browser.kind === "brands") {
      return data.brands.filter((item) => {
        if (!normalizedSearch) return true;

        return [item.name, item.slug, item.country ?? ""].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );
      });
    }

    const source =
      browser.kind === "categories" ? data.categories : data.subcategories;

    return source.filter((item) => {
      if (!normalizedSearch) return true;

      const parentName =
        browser.kind === "subcategories"
          ? (categoryById.get(item.parentId ?? "") ?? "")
          : "";

      return [item.name, item.slug, parentName].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [
    browser.kind,
    categoryById,
    data.brands,
    data.categories,
    data.subcategories,
    normalizedSearch,
  ]);

  const editItem =
    browser.mode === "edit" && browser.editId
      ? browser.kind === "brands"
        ? data.brands.find((item) => item.id === browser.editId)
        : browser.kind === "categories"
          ? data.categories.find((item) => item.id === browser.editId)
          : data.subcategories.find((item) => item.id === browser.editId)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171717] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {browser.mode === "edit" ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Torna all’elenco"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                ←
              </button>
            ) : null}

            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
                Catalogo
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                {browser.mode === "edit" ? "Modifica" : title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          {browser.mode === "list" ? (
            <>
              <div className="sticky top-0 z-10 bg-[#171717] pb-5">
                <label className="block">
                  <span className="sr-only">Cerca</span>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={`Cerca in ${title.toLowerCase()}…`}
                    className="h-12 w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-4 text-sm text-white transition outline-none placeholder:text-white/25 focus:border-orange-400/60"
                  />
                </label>

                <p className="mt-2 text-xs text-white/35">
                  {rows.length} risultati
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10">
                {rows.length ? (
                  rows.map((item) => {
                    const subtitle =
                      browser.kind === "brands"
                        ? item.slug
                        : browser.kind === "subcategories"
                          ? `${
                              categoryById.get(
                                (item as AdminTaxonomyCategory).parentId ?? "",
                              ) ?? "Categoria"
                            } · ${item.slug}`
                          : item.slug;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {item.name}
                          </p>

                          <p className="mt-1 truncate text-xs text-white/35">
                            {subtitle}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <StatusBadge status={item.status} />

                          <button
                            type="button"
                            onClick={() => onEdit(item.id)}
                            className="rounded-md border border-orange-400/30 px-3 py-2 text-sm font-medium text-orange-300 transition hover:bg-orange-400/10 hover:text-orange-200"
                          >
                            Modifica
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(item.id, item.name)}
                            className="rounded-md border border-red-400/30 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10 hover:text-red-200"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-12 text-center text-sm text-white/40">
                    Nessun risultato trovato.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              {error ? (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              ) : null}

              {browser.kind === "brands" && editItem ? (
                <BrandForm
                  key={editItem.id}
                  item={editItem as AdminTaxonomyBrand}
                  onSave={onSaveBrand}
                  editMode
                />
              ) : null}

              {browser.kind === "categories" && editItem ? (
                <CategoryForm
                  key={editItem.id}
                  item={editItem as AdminTaxonomyCategory}
                  parentId={null}
                  onSave={onSaveCategory}
                  editMode
                />
              ) : null}

              {browser.kind === "subcategories" && editItem ? (
                <SubcategoryForm
                  key={editItem.id}
                  item={editItem as AdminTaxonomyCategory}
                  categories={data.categories}
                  onSave={onSaveCategory}
                  editMode
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ManagementCard({
  title,
  description,
  browserLabel,
  onBrowse,
  children,
}: {
  title: string;
  description: string;
  browserLabel: string;
  onBrowse: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>

          <p className="mt-1 text-sm text-white/45">{description}</p>
        </div>

        <button
          type="button"
          onClick={onBrowse}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
        >
          {browserLabel}
        </button>
      </div>

      <div className="pt-5">{children}</div>
    </section>
  );
}

function BrandForm({
  item,
  onSave,
  editMode = false,
}: {
  item: AdminTaxonomyBrand | null;
  onSave: (input: Parameters<typeof upsertAdminBrand>[0]) => void;
  editMode?: boolean;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [country, setCountry] = useState(item?.country ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [status, setStatus] = useState<Status>(
    (item?.status as Status) ?? "active",
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Nome">
        <input
          value={name}
          onChange={(event) => {
            const value = event.target.value;
            setName(value);

            if (!item) {
              setSlug(makeSlug(value));
            }
          }}
          className={inputClass}
        />
      </Field>

      <Field label="Slug">
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Paese">
        <input
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Stato">
        <StatusSelect value={status} onChange={setStatus} />
      </Field>

      <div className="md:col-span-2">
        <Field label="Descrizione">
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={textareaClass}
          />
        </Field>
      </div>

      <FormSaveButton
        editMode={editMode}
        onClick={() =>
          onSave({
            id: item?.id ?? null,
            name,
            slug,
            country,
            description,
            status,
          })
        }
      />
    </div>
  );
}

function CategoryForm({
  item,
  parentId,
  onSave,
  editMode = false,
}: {
  item: AdminTaxonomyCategory | null;
  parentId: string | null;
  onSave: (input: Parameters<typeof upsertAdminCategory>[0]) => void;
  editMode?: boolean;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const [status, setStatus] = useState<Status>(
    (item?.status as Status) ?? "active",
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Nome">
        <input
          value={name}
          onChange={(event) => {
            const value = event.target.value;
            setName(value);

            if (!item) {
              setSlug(makeSlug(value));
            }
          }}
          className={inputClass}
        />
      </Field>

      <Field label="Slug">
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Ordine">
        <input
          inputMode="numeric"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Stato">
        <StatusSelect value={status} onChange={setStatus} />
      </Field>

      <div className="md:col-span-2">
        <Field label="Descrizione">
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={textareaClass}
          />
        </Field>
      </div>

      <FormSaveButton
        editMode={editMode}
        onClick={() =>
          onSave({
            id: item?.id ?? null,
            parentId,
            name,
            slug,
            description,
            sortOrder: Number.parseInt(sortOrder, 10) || 0,
            status,
          })
        }
      />
    </div>
  );
}

function SubcategoryForm({
  item,
  categories,
  onSave,
  editMode = false,
}: {
  item: AdminTaxonomyCategory | null;
  categories: AdminTaxonomyCategory[];
  onSave: (input: Parameters<typeof upsertAdminCategory>[0]) => void;
  editMode?: boolean;
}) {
  const initialParent = item?.parentId ?? categories[0]?.id ?? "";

  const [parentId, setParentId] = useState(initialParent);
  const [name, setName] = useState(item?.name ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const [status, setStatus] = useState<Status>(
    (item?.status as Status) ?? "active",
  );

  function generateSlug(categoryId: string, subcategoryName: string) {
    const category = categories.find(
      (candidate) => candidate.id === categoryId,
    );

    if (!category || !subcategoryName.trim()) {
      return "";
    }

    return `${category.slug}--${makeSlug(subcategoryName)}`;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Categoria principale">
        <select
          value={parentId}
          onChange={(event) => {
            const value = event.target.value;
            setParentId(value);

            if (!item) {
              setSlug(generateSlug(value, name));
            }
          }}
          className={inputClass}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Nome">
        <input
          value={name}
          onChange={(event) => {
            const value = event.target.value;
            setName(value);

            if (!item) {
              setSlug(generateSlug(parentId, value));
            }
          }}
          className={inputClass}
        />
      </Field>

      <Field label="Slug">
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Ordine">
        <input
          inputMode="numeric"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Stato">
        <StatusSelect value={status} onChange={setStatus} />
      </Field>

      <div className="md:col-span-2">
        <Field label="Descrizione">
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={textareaClass}
          />
        </Field>
      </div>

      <FormSaveButton
        editMode={editMode}
        onClick={() =>
          onSave({
            id: item?.id ?? null,
            parentId: parentId || null,
            name,
            slug,
            description,
            sortOrder: Number.parseInt(sortOrder, 10) || 0,
            status,
          })
        }
      />
    </div>
  );
}

function FormSaveButton({
  editMode,
  onClick,
}: {
  editMode: boolean;
  onClick: () => void;
}) {
  return (
    <div className="md:col-span-2">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400"
      >
        {editMode ? "Salva modifiche" : "Aggiungi"}
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label =
    status === "active"
      ? "Attivo"
      : status === "archived"
        ? "Archiviato"
        : "Bozza";

  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/65">
      {label}
    </span>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: Status;
  onChange: (value: Status) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as Status)}
      className={inputClass}
    >
      <option value="active">Attivo</option>
      <option value="draft">Bozza</option>
      <option value="archived">Archiviato</option>
    </select>
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
  "h-11 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 text-sm text-white outline-none transition focus:border-orange-400/60";

const textareaClass =
  "w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-3 text-sm leading-6 text-white outline-none transition focus:border-orange-400/60";
