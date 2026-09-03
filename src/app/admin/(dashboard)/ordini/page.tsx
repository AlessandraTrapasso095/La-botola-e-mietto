import type { Metadata } from "next";
import Link from "next/link";

import {
  getServerAdminOrders,
  type AdminOrderView,
} from "@/server/admin/orders";

export const metadata: Metadata = {
  title: "Ordini",
};

type AdminOrdersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    payment?: string;
    method?: string;
    cancellation?: string;
  }>;
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

function orderStatusLabel(status: AdminOrderView["status"]) {
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

function paymentStatusLabel(status: AdminOrderView["paymentStatus"]) {
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

function paymentMethodLabel(method: AdminOrderView["paymentMethod"]) {
  switch (method) {
    case "stripe":
      return "Stripe";
    case "bank_transfer":
      return "Bonifico";
    case "satispay":
      return "Satispay";
  }
}

function shippingMethodLabel(method: AdminOrderView["shippingMethod"]) {
  switch (method) {
    case "store_pickup":
      return "Ritiro";
    case "tnt":
      return "TNT";
  }
}

function statusClasses(status: AdminOrderView["status"]) {
  switch (status) {
    case "received":
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
    case "preparing":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "shipped":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";
    case "delivered":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "cancelled":
      return "border-red-400/20 bg-red-400/10 text-red-300";
  }
}

function paymentClasses(status: AdminOrderView["paymentStatus"]) {
  switch (status) {
    case "paid":
      return "text-emerald-300";
    case "authorized":
      return "text-blue-300";
    case "pending":
      return "text-amber-300";
    case "failed":
      return "text-red-300";
    case "refunded":
      return "text-violet-300";
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const filters = await searchParams;
  const orders = await getServerAdminOrders();

  const query = filters.q?.trim().toLocaleLowerCase("it-IT") ?? "";

  const filteredOrders = orders.filter((order) => {
    if (
      query &&
      ![
        order.orderNumber,
        order.customer.email,
        order.customer.firstName,
        order.customer.lastName,
        `${order.customer.firstName} ${order.customer.lastName}`,
      ].some((value) => value.toLocaleLowerCase("it-IT").includes(query))
    ) {
      return false;
    }

    if (filters.status && order.status !== filters.status) {
      return false;
    }

    if (filters.payment && order.paymentStatus !== filters.payment) {
      return false;
    }

    if (filters.method && order.paymentMethod !== filters.method) {
      return false;
    }

    if (
      filters.cancellation === "pending" &&
      order.cancellationRequestStatus !== "pending"
    ) {
      return false;
    }

    return true;
  });

  const pendingCancellationCount = orders.filter(
    (order) => order.cancellationRequestStatus === "pending",
  ).length;

  const receivedCount = orders.filter(
    (order) => order.status === "received",
  ).length;

  const pendingPaymentCount = orders.filter(
    (order) => order.paymentStatus === "pending",
  ).length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
            Gestione ordini
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Ordini</h1>

          <p className="mt-2 text-sm text-white/50">
            Consulta e gestisci tutti gli ordini ricevuti dal negozio.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] px-4 py-3 text-right">
          <p className="text-xs text-white/40">Ordini visualizzati</p>
          <p className="mt-1 text-2xl font-semibold">{filteredOrders.length}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
          <p className="text-xs text-white/40">Nuovi / ricevuti</p>
          <p className="mt-2 text-2xl font-semibold">{receivedCount}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-4">
          <p className="text-xs text-white/40">Pagamenti in attesa</p>
          <p className="mt-2 text-2xl font-semibold">{pendingPaymentCount}</p>
        </div>

        <div className="rounded-lg border border-orange-400/20 bg-orange-400/5 p-4">
          <p className="text-xs text-orange-300/70">
            Annullamenti da verificare
          </p>
          <p className="mt-2 text-2xl font-semibold text-orange-300">
            {pendingCancellationCount}
          </p>
        </div>
      </div>

      <form
        method="GET"
        className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-[#171717] p-4 md:grid-cols-2 xl:grid-cols-6"
      >
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          placeholder="Ordine, cliente o email..."
          className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-400 xl:col-span-2"
        />

        <select
          name="status"
          defaultValue={filters.status ?? ""}
          className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400"
        >
          <option value="">Tutti gli stati</option>
          <option value="received">Ricevuto</option>
          <option value="preparing">Preso in carico</option>
          <option value="shipped">Spedito</option>
          <option value="delivered">Consegnato</option>
          <option value="cancelled">Annullato</option>
        </select>

        <select
          name="payment"
          defaultValue={filters.payment ?? ""}
          className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400"
        >
          <option value="">Tutti i pagamenti</option>
          <option value="pending">In attesa</option>
          <option value="authorized">Autorizzato</option>
          <option value="paid">Pagato</option>
          <option value="failed">Fallito</option>
          <option value="refunded">Rimborsato</option>
        </select>

        <select
          name="method"
          defaultValue={filters.method ?? ""}
          className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400"
        >
          <option value="">Tutti i metodi</option>
          <option value="stripe">Stripe</option>
          <option value="bank_transfer">Bonifico</option>
          <option value="satispay">Satispay</option>
        </select>

        <button
          type="submit"
          className="min-h-11 rounded-md bg-orange-400 px-4 text-sm font-semibold text-black transition hover:bg-orange-300"
        >
          Filtra
        </button>

        <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-6">
          <Link
            href="/admin/ordini"
            className="inline-flex min-h-9 items-center rounded-md border border-white/10 px-3 text-xs font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Azzera filtri
          </Link>

          <Link
            href="/admin/ordini?cancellation=pending"
            className="inline-flex min-h-9 items-center rounded-md border border-orange-400/20 bg-orange-400/5 px-3 text-xs font-medium text-orange-300 transition hover:bg-orange-400/10"
          >
            Solo annullamenti richiesti
          </Link>
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
        {filteredOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium">Nessun ordine trovato</p>
            <p className="mt-2 text-sm text-white/40">
              Prova a modificare i filtri di ricerca.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed border-collapse text-left text-[13px]">
              <colgroup>
                <col className="w-[16%]" />
                <col className="w-[13%]" />
                <col className="w-[20%]" />
                <col className="w-[6%]" />
                <col className="w-[9%]" />
                <col className="w-[11%]" />
                <col className="w-[10%]" />
                <col className="w-[7%]" />
                <col className="w-[8%]" />
              </colgroup>
              <thead className="border-b border-white/10 bg-white/[0.025] text-xs text-white/40 uppercase">
                <tr>
                  <th className="px-3 py-4 font-medium">Ordine</th>
                  <th className="px-3 py-4 font-medium">Data</th>
                  <th className="px-3 py-4 font-medium">Cliente</th>
                  <th className="px-3 py-4 font-medium">Articoli</th>
                  <th className="px-3 py-4 font-medium">Totale</th>
                  <th className="px-3 py-4 font-medium">Pagamento</th>
                  <th className="px-3 py-4 font-medium">Stato</th>
                  <th className="px-3 py-4 font-medium">Consegna</th>
                  <th className="px-3 py-4 font-medium">Azioni</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const customerName = [
                    order.customer.firstName,
                    order.customer.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-3 py-4">
                        <p className="truncate font-semibold text-white">
                          {order.orderNumber}
                        </p>

                        {order.cancellationRequestStatus === "pending" && (
                          <span className="mt-2 inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-2 py-1 text-[11px] font-semibold text-orange-300">
                            Annullamento richiesto
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-4 text-white/60">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-3 py-4">
                        <p className="font-medium text-white">
                          {customerName || "Cliente"}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/40">
                          {order.customer.email}
                        </p>
                      </td>

                      <td className="px-3 py-4 text-white/70">
                        {order.itemCount}
                      </td>

                      <td className="px-3 py-4 font-semibold text-white">
                        {formatMoney(order.totalGrossAmountMinor)}
                      </td>

                      <td className="px-3 py-4">
                        <p
                          className={`font-medium ${paymentClasses(
                            order.paymentStatus,
                          )}`}
                        >
                          {paymentStatusLabel(order.paymentStatus)}
                        </p>

                        <p className="mt-1 truncate text-xs text-white/40">
                          {paymentMethodLabel(order.paymentMethod)}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                            order.status,
                          )}`}
                        >
                          {orderStatusLabel(order.status)}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-white/60">
                        {shippingMethodLabel(order.shippingMethod)}
                      </td>

                      <td className="px-3 py-4">
                        <Link
                          href={`/admin/ordini/${encodeURIComponent(
                            order.orderNumber,
                          )}`}
                          className="inline-flex min-h-9 items-center rounded-md border border-white/10 px-3 text-xs font-semibold text-white/70 transition hover:border-orange-400/40 hover:text-orange-300"
                        >
                          Apri
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
