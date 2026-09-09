import type { Metadata } from "next";
import Link from "next/link";

import {
  getServerAdminOrders,
  type AdminPaymentMethod,
} from "@/server/admin/orders";

export const metadata: Metadata = {
  title: "Richieste annullamento",
};

function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amountMinor / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function paymentMethodLabel(method: AdminPaymentMethod) {
  switch (method) {
    case "stripe":
      return "Carta / Stripe";
    case "bank_transfer":
      return "Bonifico bancario";
    case "satispay":
      return "Satispay";
  }
}

export default async function AdminCancellationRequestsPage() {
  const orders = await getServerAdminOrders();

  const requests = orders.filter(
    (order) => order.cancellationRequestStatus === "pending",
  );

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
            Gestione ordini
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Richieste annullamento
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
            Verifica le richieste inviate dai clienti prima della spedizione e
            gestisci l’eventuale rimborso.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-orange-400/20 bg-orange-400/5 px-4 py-3 text-right">
          <p className="text-xs text-orange-300/70">Da gestire</p>
          <p className="mt-1 text-2xl font-semibold text-orange-300">
            {requests.length}
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <section className="mt-8 rounded-lg border border-white/10 bg-[#171717] px-5 py-14 text-center sm:px-8">
          <p className="font-semibold">Nessuna richiesta da gestire</p>

          <p className="mt-2 text-sm text-white/40">
            Al momento non risultano richieste di annullamento pendenti.
          </p>

          <Link
            href="/admin/ordini"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Vai agli ordini
          </Link>
        </section>
      ) : (
        <div className="mt-8 grid gap-4">
          {requests.map((order) => (
            <article
              key={order.id}
              className="min-w-0 rounded-lg border border-orange-400/20 bg-[#171717] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold break-all">
                      {order.orderNumber}
                    </h2>

                    <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                      Da gestire
                    </span>
                  </div>

                  <p className="mt-2 text-sm break-words text-white/70">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>

                  <p className="mt-1 text-xs break-all text-white/40">
                    {order.customer.email}
                  </p>

                  <p className="mt-2 text-xs text-white/40">
                    Ordine del {formatDate(order.createdAt)}
                  </p>
                </div>

                <dl className="grid min-w-0 gap-4 text-sm sm:grid-cols-3 lg:min-w-[420px]">
                  <div>
                    <dt className="text-xs text-white/40">Totale</dt>
                    <dd className="mt-1 font-semibold">
                      {formatMoney(order.totalGrossAmountMinor)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-white/40">Pagamento</dt>
                    <dd className="mt-1">
                      {paymentMethodLabel(order.paymentMethod)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-white/40">Articoli</dt>
                    <dd className="mt-1">{order.itemCount}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <Link
                  href={`/admin/ordini/${encodeURIComponent(
                    order.orderNumber,
                  )}`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-orange-400 px-4 text-sm font-semibold text-black transition hover:bg-orange-300 sm:w-auto"
                >
                  Gestisci richiesta
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
