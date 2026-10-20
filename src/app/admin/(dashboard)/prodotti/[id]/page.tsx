import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminProductActions } from "@/features/admin/admin-product-actions";
import { AdminProductEditForm } from "@/features/admin/admin-product-edit-form";
import { AdminProductImagePreview } from "@/features/admin/admin-product-image-preview";
import { AdminProductInventoryHistory } from "@/features/admin/admin-product-inventory-history";
import { AdminProductOfferControl } from "@/features/admin/admin-product-offer-control";
import { AdminProductStatusControl } from "@/features/admin/admin-product-status-control";
import { AdminProductStockControl } from "@/features/admin/admin-product-stock-control";
import {
  getAdminProductDetail,
  getAdminProductInventoryMovements,
  getAdminProductEditOptions,
  getAdminProductOffer,
} from "@/server/admin/admin-products";

function formatMoney(amountMinor: number | null, currency = "EUR") {
  if (amountMinor === null) return "—";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

function calculateGrossMinor(
  netAmountMinor: number | null,
  vatRateBasisPoints: number | null,
) {
  if (netAmountMinor === null || vatRateBasisPoints === null) {
    return null;
  }

  return Math.round(netAmountMinor * (1 + vatRateBasisPoints / 10_000));
}

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, editOptions, inventoryMovements, offer] = await Promise.all([
    getAdminProductDetail(id),
    getAdminProductEditOptions(),
    getAdminProductInventoryMovements(id),
    getAdminProductOffer(id),
  ]);

  if (!product) {
    notFound();
  }

  const grossAmountMinor = calculateGrossMinor(
    product.netAmountMinor,
    product.vatRateBasisPoints,
  );

  const vatPercentage =
    product.vatRateBasisPoints === null
      ? null
      : product.vatRateBasisPoints / 100;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <Link
          href="/admin/prodotti"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/45 transition hover:text-white"
        >
          ← Torna a tutti i prodotti
        </Link>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 via-[#171717] to-[#111111]">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
                  Scheda prodotto
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight break-words text-white sm:text-3xl">
                  {product.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-xs text-white/55">
                    {product.code}
                  </span>

                  <StatusBadge status={product.status} />

                  {product.isNew ? <Badge>Nuovo</Badge> : null}

                  {product.isLimited ? <Badge>Edizione limitata</Badge> : null}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
                {product.status === "active" ? (
                  <Link
                    href={`/prodotto/${product.slug}`}
                    target="_blank"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.07] hover:text-white sm:w-auto"
                  >
                    Vedi nello store ↗
                  </Link>
                ) : (
                  <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] px-4 py-3">
                    <p className="text-xs font-semibold text-amber-200">
                      Non visibile nello store
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-white/40">
                      {product.status === "archived"
                        ? "Il prodotto è archiviato. Puoi riattivarlo dalla sezione Gestione."
                        : "Il prodotto è ancora in bozza. Impostalo su Attivo quando è pronto."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Prezzo cliente"
                value={formatMoney(
                  grossAmountMinor,
                  product.currency ?? "EUR",
                )}
                helper={
                  vatPercentage === null
                    ? "IVA non disponibile"
                    : `IVA ${vatPercentage}% inclusa`
                }
                accent="green"
              />

              <SummaryCard
                label="Disponibili"
                value={String(product.availableQuantity)}
                helper={`${product.stockQuantity} totali · ${product.reservedQuantity} riservati`}
                accent={product.availableQuantity > 0 ? "green" : "red"}
              />

              <SummaryCard
                label="Categoria"
                value={product.categoryName || "—"}
                helper={product.subcategoryName || "Nessuna sottocategoria"}
              />

              <SummaryCard
                label="Formato"
                value={product.capacityLabel || "—"}
                helper={
                  product.alcoholPercentage === null
                    ? "Gradazione non indicata"
                    : `${product.alcoholPercentage}% Vol.`
                }
              />
            </div>
          </div>
        </div>
      </div>

      <AdminProductImagePreview
        productId={product.id}
        productName={product.name}
        image={product.primaryImage}
      />

      <AdminProductEditForm product={product} options={editOptions} />

      <div className="space-y-6">
        <Section
          title="Identità e classificazione"
          description="Le informazioni principali con cui il prodotto viene riconosciuto nel catalogo."
        >
          <DataGrid>
            <DataItem label="Codice" value={product.code} />
            <DataItem label="Slug" value={product.slug} />
            <DataItem label="Marchio" value={product.brandName} />
            <DataItem label="Categoria" value={product.categoryName} />
            <DataItem label="Sottocategoria" value={product.subcategoryName} />
            <DataItem label="Produttore" value={product.producer} />
            <DataItem label="Paese" value={product.country} />
            <DataItem label="Origine" value={product.origin} />
          </DataGrid>
        </Section>

        <Section
          title="Formato e caratteristiche"
          description="Formato commerciale, capacità, confezione e gradazione."
        >
          <DataGrid>
            <DataItem label="Formato" value={product.capacityLabel} />

            <DataItem
              label="Capacità"
              value={product.capacityMl ? `${product.capacityMl} ml` : null}
            />

            <DataItem
              label="Quantità confezione"
              value={product.packQuantity ? String(product.packQuantity) : null}
            />

            <DataItem
              label="Gradazione"
              value={
                product.alcoholPercentage === null
                  ? null
                  : `${product.alcoholPercentage}% Vol.`
              }
            />
          </DataGrid>
        </Section>

        <Section
          title="Descrizione e note"
          description="I testi che descrivono il prodotto e aiutano il cliente a conoscerlo."
        >
          <TextItem label="Descrizione" value={product.description} />

          <TextItem label="Note di degustazione" value={product.tastingNotes} />

          <TextItem label="Note di servizio" value={product.serviceNotes} />
        </Section>

        <Section
          title="Prezzo"
          description="Prezzo base del prodotto e calcolo dell’importo finale IVA inclusa."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <DataItem
              label="Prezzo netto"
              value={formatMoney(
                product.netAmountMinor,
                product.currency ?? "EUR",
              )}
            />

            <DataItem
              label="IVA"
              value={vatPercentage === null ? null : `${vatPercentage}%`}
            />

            <div>
              <p className="text-xs text-white/40">Prezzo lordo</p>

              <p className="mt-1.5 text-2xl font-semibold text-white">
                {formatMoney(grossAmountMinor, product.currency ?? "EUR")}
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Offerta"
          description="Qui puoi attivare, modificare o disattivare lo sconto del prodotto."
        >
          <AdminProductOfferControl
            productId={product.id}
            currentNetAmountMinor={product.netAmountMinor}
            vatRateBasisPoints={product.vatRateBasisPoints}
            currency={product.currency}
            offer={offer}
          />
        </Section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section
            title="Magazzino"
            description="Controlla le quantità disponibili e registra eventuali variazioni di stock."
          >
            <div className="grid gap-4">
              <StockItem label="Stock totale" value={product.stockQuantity} />

              <StockItem label="Riservati" value={product.reservedQuantity} />

              <StockItem
                label="Disponibili"
                value={product.availableQuantity}
                highlight
              />
            </div>

            <AdminProductStockControl
              productId={product.id}
              currentStockQuantity={product.stockQuantity}
              reservedQuantity={product.reservedQuantity}
            />
          </Section>

          <div className="space-y-6">
            <AdminProductActions
              productId={product.id}
              productName={product.name}
              currentStatus={product.status}
            />

            <Section
              title="Pubblicazione"
              description="Scegli se il prodotto deve essere visibile, restare in bozza o essere archiviato."
              emphasis
            >
            <AdminProductStatusControl
              productId={product.id}
              currentStatus={product.status}
            />

              <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-white/30">
                Gestisci qui lo stato e la visibilità del prodotto nello store.
              </p>
            </Section>
          </div>
        </div>
      </div>

      <AdminProductInventoryHistory movements={inventoryMovements} />
    </div>
  );
}

function Section({
  title,
  description,
  children,
  emphasis = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border",
        emphasis
          ? "border-orange-400/40 bg-gradient-to-br from-orange-500/[0.10] via-[#171717] to-[#171717] shadow-[0_0_0_1px_rgba(251,146,60,0.05)]"
          : "border-white/10 bg-[#171717]",
      ].join(" ")}
    >
      <div
        className={[
          "border-b px-5 py-4 sm:px-6",
          emphasis
            ? "border-orange-400/20 bg-orange-400/[0.06]"
            : "border-white/10 bg-white/[0.02]",
        ].join(" ")}
      >
        {emphasis ? (
          <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-orange-300 uppercase">
            Visibilità nello store
          </p>
        ) : null}

        <h2
          className={
            emphasis
              ? "text-lg font-semibold text-white sm:text-xl"
              : "text-base font-semibold text-white"
          }
        >
          {title}
        </h2>

        {description ? (
          <p
            className={[
              "mt-1 leading-5",
              emphasis ? "text-sm text-white/55" : "text-xs text-white/40",
            ].join(" ")}
          >
            {description}
          </p>
        ) : null}
      </div>

      <div className={emphasis ? "p-5 sm:p-7" : "p-5 sm:p-6"}>
        {children}
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  accent = "default",
}: {
  label: string;
  value: string;
  helper: string;
  accent?: "default" | "green" | "red";
}) {
  const valueClass =
    accent === "green"
      ? "text-emerald-300"
      : accent === "red"
        ? "text-red-300"
        : "text-white";

  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-medium text-white/40">{label}</p>

      <p
        className={[
          "mt-2 truncate text-lg font-semibold",
          valueClass,
        ].join(" ")}
        title={value}
      >
        {value}
      </p>

      <p className="mt-1 truncate text-xs text-white/30" title={helper}>
        {helper}
      </p>
    </div>
  );
}

function DataGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>;
}

function DataItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/10 px-4 py-3">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-1.5 text-sm font-medium break-words text-white/85">
        {value || "—"}
      </p>
    </div>
  );
}

function TextItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-b border-white/5 py-5 first:pt-0 last:border-0 last:pb-0">
      <p className="text-xs text-white/40">{label}</p>

      <p className="mt-2 text-sm leading-6 whitespace-pre-line text-white/70">
        {value?.trim() || "—"}
      </p>
    </div>
  );
}

function StockItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#111111] px-4 py-3">
      <span className="text-sm text-white/50">{label}</span>

      <span
        className={[
          "text-lg font-semibold",
          highlight
            ? value > 0
              ? "text-emerald-300"
              : "text-red-300"
            : "text-white",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-300">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config =
    status === "active"
      ? {
          label: "Attivo",
          className: "bg-emerald-500/10 text-emerald-300",
        }
      : status === "archived"
        ? {
            label: "Archiviato",
            className: "bg-red-500/10 text-red-300",
          }
        : {
            label: "Bozza",
            className: "bg-white/10 text-white/50",
          };

  return (
    <span
      className={[
        "rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
