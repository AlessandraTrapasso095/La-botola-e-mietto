import type { Metadata } from "next";
import Link from "next/link";

import { getServerAdminDashboard } from "@/server/admin/dashboard";
import type {
  AdminOrderStatus,
  AdminPaymentStatus,
} from "@/server/admin/orders";

export const metadata: Metadata = {
  title: "Dashboard",
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

function orderStatusLabel(status: AdminOrderStatus) {
  switch (status) {
    case "received":
      return "Ricevuto";
    case "preparing":
      return "Preso in carico";
    case "shipped":
      return "Spedito";
    case "delivered":
      return "Consegnato";
    case "cancelled":
      return "Annullato";
  }
}

function paymentStatusLabel(status: AdminPaymentStatus) {
  switch (status) {
    case "pending":
      return "In attesa";
    case "authorized":
      return "Autorizzato";
    case "paid":
      return "Pagato";
    case "failed":
      return "Fallito";
    case "refunded":
      return "Rimborsato";
  }
}

export default async function AdminDashboardPage() {
  const dashboard = await getServerAdminDashboard();

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
            Panoramica
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
            Controlla ordini, pagamenti e richieste che richiedono attenzione da
            un unico pannello.
          </p>
        </div>

        <Link
          href="/admin/ordini"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          Tutti gli ordini
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/ordini"
          className="rounded-lg border border-white/10 bg-[#171717] p-5 transition hover:border-orange-400/40"
        >
          <p className="text-sm text-white/50">Ordini da gestire</p>

          <p className="mt-3 text-3xl font-semibold">
            {dashboard.ordersToManageCount}
          </p>

          <p className="mt-2 text-xs text-white/35">
            Ricevuti o in preparazione
          </p>
        </Link>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-sm text-white/50">Incassato</p>

          <p className="mt-3 text-3xl font-semibold">
            {formatMoney(dashboard.paidRevenueMinor)}
          </p>

          <p className="mt-2 text-xs text-white/35">
            Solo pagamenti attualmente acquisiti
          </p>
        </div>

        <Link
          href="/admin/richieste-annullamento"
          className="rounded-lg border border-orange-400/20 bg-orange-400/5 p-5 transition hover:border-orange-400/50"
        >
          <p className="text-sm text-orange-300/70">Annullamenti da gestire</p>

          <p className="mt-3 text-3xl font-semibold text-orange-300">
            {dashboard.pendingCancellationCount}
          </p>

          <p className="mt-2 text-xs text-orange-200/35">
            Richieste ancora pendenti
          </p>
        </Link>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-sm text-white/50">Clienti con ordini</p>

          <p className="mt-3 text-3xl font-semibold">
            {dashboard.customerCount}
          </p>

          <p className="mt-2 text-xs text-white/35">
            Clienti unici presenti negli ordini
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
          <p className="text-xs text-white/40">Ricevuti</p>
          <p className="mt-2 text-2xl font-semibold">
            {dashboard.receivedCount}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
          <p className="text-xs text-white/40">In preparazione</p>
          <p className="mt-2 text-2xl font-semibold">
            {dashboard.preparingCount}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
          <p className="text-xs text-white/40">Spediti</p>
          <p className="mt-2 text-2xl font-semibold">
            {dashboard.shippedCount}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
          <p className="text-xs text-white/40">Consegnati</p>
          <p className="mt-2 text-2xl font-semibold">
            {dashboard.deliveredCount}
          </p>
        </div>
      </section>

      <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-2">
        <section className="min-w-0 rounded-lg border border-white/10 bg-[#171717]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-semibold">Ultimi ordini</h2>
              <p className="mt-1 text-xs text-white/40">
                Gli ultimi cinque ordini ricevuti.
              </p>
            </div>

            <Link
              href="/admin/ordini"
              className="text-xs font-semibold text-orange-300 hover:text-orange-200"
            >
              Vedi tutti →
            </Link>
          </div>

          {dashboard.recentOrders.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-white/40">
                Nessun ordine disponibile.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {dashboard.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/ordini/${encodeURIComponent(
                    order.orderNumber,
                  )}`}
                  className="grid min-w-0 gap-3 px-4 py-4 transition hover:bg-white/[0.025] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold break-all">
                        {order.orderNumber}
                      </p>

                      {order.cancellationRequestStatus === "pending" && (
                        <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2 py-0.5 text-[11px] font-semibold text-orange-300">
                          Annullamento
                        </span>
                      )}
                    </div>

                    <p className="mt-1 truncate text-sm text-white/55">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="min-w-0 sm:text-right">
                    <p className="font-semibold">
                      {formatMoney(order.totalGrossAmountMinor)}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      {orderStatusLabel(order.status)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="min-w-0 rounded-lg border border-white/10 bg-[#171717]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-semibold">Richiede attenzione</h2>
              <p className="mt-1 text-xs text-white/40">
                Ordini con azioni ancora da completare.
              </p>
            </div>

            <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
              {dashboard.attentionOrders.length}
            </span>
          </div>

          {dashboard.attentionOrders.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-medium">Tutto sotto controllo</p>

              <p className="mt-2 text-sm text-white/40">
                Non ci sono ordini che richiedono attenzione immediata.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {dashboard.attentionOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/ordini/${encodeURIComponent(
                    order.orderNumber,
                  )}`}
                  className="grid min-w-0 gap-3 px-4 py-4 transition hover:bg-white/[0.025] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="font-semibold break-all">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 truncate text-sm text-white/55">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:max-w-[210px] sm:justify-end">
                    {order.status === "received" && (
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/60">
                        Da prendere in carico
                      </span>
                    )}

                    {(order.paymentStatus === "pending" ||
                      order.paymentStatus === "authorized") && (
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/60">
                        {paymentStatusLabel(order.paymentStatus)}
                      </span>
                    )}

                    {order.cancellationRequestStatus === "pending" && (
                      <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2 py-1 text-[11px] text-orange-300">
                        Annullamento
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-8">
        <div>
          <h2 className="font-semibold">Pagamenti</h2>

          <p className="mt-1 text-xs text-white/40">
            Stato economico sintetico degli ordini.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/admin/ordini?payment=pending"
            className="rounded-lg border border-white/10 bg-[#171717] p-4 transition hover:border-orange-400/40"
          >
            <p className="text-xs text-white/40">In attesa / autorizzati</p>

            <p className="mt-2 text-2xl font-semibold">
              {dashboard.pendingPaymentCount}
            </p>
          </Link>

          <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
            <p className="text-xs text-white/40">Ordini totali</p>

            <p className="mt-2 text-2xl font-semibold">
              {dashboard.orderCount}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
            <p className="text-xs text-white/40">Ordini rimborsati</p>

            <p className="mt-2 text-2xl font-semibold">
              {dashboard.refundedOrderCount}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
            <p className="text-xs text-white/40">Totale rimborsato</p>

            <p className="mt-2 text-2xl font-semibold">
              {formatMoney(dashboard.refundedAmountMinor)}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Azioni rapide</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/admin/ordini"
            className="rounded-lg border border-white/10 bg-[#171717] p-5 transition hover:border-orange-400/50"
          >
            <p className="font-semibold">Gestisci ordini</p>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Consulta gli ordini e aggiorna preparazione, spedizione e
              consegna.
            </p>
          </Link>

          <Link
            href="/admin/richieste-annullamento"
            className="rounded-lg border border-white/10 bg-[#171717] p-5 transition hover:border-orange-400/50"
          >
            <p className="font-semibold">Richieste annullamento</p>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Approva o rifiuta le richieste e gestisci gli eventuali rimborsi.
            </p>
          </Link>

          <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
            <p className="font-semibold text-white/60">Catalogo e magazzino</p>

            <p className="mt-2 text-sm leading-6 text-white/35">
              La gestione completa di prodotti, immagini e stock verrà attivata
              nei prossimi step.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
