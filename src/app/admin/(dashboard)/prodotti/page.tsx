import Link from "next/link";

import { getAdminProducts } from "@/server/admin/admin-products";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  const activeCount = products.filter(
    (product) => product.status === "active",
  ).length;

  const draftCount = products.filter(
    (product) => product.status === "draft",
  ).length;

  const unavailableCount = products.filter(
    (product) => product.availableQuantity <= 0,
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
            Catalogo
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-white">Prodotti</h1>

          <p className="mt-2 max-w-2xl text-sm text-white/50">
            Gestisci il catalogo prodotti di La Botola e Mietto.
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
          {products.length} prodotti caricati
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Prodotti visualizzati" value={products.length} />

        <SummaryCard label="Attivi" value={activeCount} />

        <SummaryCard label="Bozze" value={draftCount} />

        <SummaryCard label="Non disponibili" value={unavailableCount} />
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-xs font-semibold tracking-wide text-white/40 uppercase">
                <th className="px-5 py-4">Codice</th>
                <th className="px-5 py-4">Prodotto</th>
                <th className="px-5 py-4">Marchio</th>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Stato</th>
                <th className="px-5 py-4 text-right">Disponibili</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-white/[0.025]"
                >
                  <td className="px-5 py-4 font-mono text-xs whitespace-nowrap text-white/50">
                    {product.code}
                  </td>

                  <td className="px-5 py-4">
                    <p className="max-w-md font-medium text-white">
                      {product.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-white/60">
                    {product.brandName ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-white/60">
                    {product.categoryName ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span
                      className={
                        product.availableQuantity > 0
                          ? "text-emerald-300"
                          : "text-red-300"
                      }
                    >
                      {product.availableQuantity}
                    </span>

                    {product.reservedQuantity > 0 ? (
                      <p className="mt-1 text-xs text-white/30">
                        {product.reservedQuantity} riservati
                      </p>
                    ) : null}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/prodotti/${product.id}`}
                      className="text-sm font-medium text-orange-300 transition hover:text-orange-200"
                    >
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-white/40">
            Nessun prodotto disponibile.
          </div>
        ) : null}
      </div>

      {products.length >= 250 ? (
        <p className="text-xs text-white/30">
          Per ora vengono mostrati i primi 250 prodotti. La paginazione verrà
          aggiunta nel prossimo passaggio.
        </p>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">
        {value.toLocaleString("it-IT")}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-white/10 text-white/50",
      ].join(" ")}
    >
      {active ? "Attivo" : "Bozza"}
    </span>
  );
}
