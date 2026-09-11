import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminProductEditForm } from "@/features/admin/admin-product-edit-form";
import { AdminProductImagePreview } from "@/features/admin/admin-product-image-preview";
import { AdminProductStatusControl } from "@/features/admin/admin-product-status-control";
import {
  getAdminProductDetail,
  getAdminProductEditOptions,
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

  const [product, editOptions] = await Promise.all([
    getAdminProductDetail(id),
    getAdminProductEditOptions(),
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
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/prodotti"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Torna ai prodotti
        </Link>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
              Catalogo · Dettaglio prodotto
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-white">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-white/40">
                {product.code}
              </span>

              <StatusBadge status={product.status} />

              {product.isNew ? <Badge>Nuovo</Badge> : null}

              {product.isLimited ? <Badge>Edizione limitata</Badge> : null}
            </div>
          </div>

          <Link
            href={`/prodotto/${product.slug}`}
            target="_blank"
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Vedi nello store ↗
          </Link>
        </div>
      </div>

      <AdminProductImagePreview
        productId={product.id}
        productName={product.name}
        image={product.primaryImage}
      />

      <AdminProductEditForm product={product} options={editOptions} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Section title="Anagrafica">
            <DataGrid>
              <DataItem label="Codice" value={product.code} />
              <DataItem label="Slug" value={product.slug} />
              <DataItem label="Marchio" value={product.brandName} />
              <DataItem label="Categoria" value={product.categoryName} />
              <DataItem
                label="Sottocategoria"
                value={product.subcategoryName}
              />
              <DataItem label="Produttore" value={product.producer} />
              <DataItem label="Paese" value={product.country} />
              <DataItem label="Origine" value={product.origin} />
            </DataGrid>
          </Section>

          <Section title="Caratteristiche">
            <DataGrid>
              <DataItem label="Formato" value={product.capacityLabel} />

              <DataItem
                label="Capacità"
                value={product.capacityMl ? `${product.capacityMl} ml` : null}
              />

              <DataItem
                label="Quantità confezione"
                value={
                  product.packQuantity ? String(product.packQuantity) : null
                }
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

          <Section title="Contenuti prodotto">
            <TextItem label="Descrizione" value={product.description} />

            <TextItem
              label="Note di degustazione"
              value={product.tastingNotes}
            />

            <TextItem label="Note di servizio" value={product.serviceNotes} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Prezzo corrente">
            <div className="space-y-5">
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

              <div className="border-t border-white/10 pt-5">
                <p className="text-xs text-white/40">Prezzo lordo</p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {formatMoney(grossAmountMinor, product.currency ?? "EUR")}
                </p>
              </div>
            </div>
          </Section>

          <Section title="Magazzino">
            <div className="grid gap-4">
              <StockItem label="Stock totale" value={product.stockQuantity} />

              <StockItem label="Riservati" value={product.reservedQuantity} />

              <StockItem
                label="Disponibili"
                value={product.availableQuantity}
                highlight
              />
            </div>

            <p className="mt-5 text-xs leading-5 text-white/30">
              La modifica delle quantità verrà gestita nello Step 35 — Stock
              Management.
            </p>
          </Section>

          <Section title="Gestione">
            <AdminProductStatusControl
              productId={product.id}
              currentStatus={product.status}
            />

            <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-white/30">
              La modifica dell’anagrafica prodotto verrà gestita nei prossimi
              passaggi.
            </p>
          </Section>
        </div>
      </div>
    </div>
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
    <section className="rounded-lg border border-white/10 bg-[#171717] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function DataGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>;
}

function DataItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1.5 text-sm break-words text-white/80">{value || "—"}</p>
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
