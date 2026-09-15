import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAdminCustomerById,
  type AdminCustomerOrderItem,
} from "@/server/admin/admin-customers";

type AdminCustomerDetailPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export async function generateMetadata({
  params,
}: AdminCustomerDetailPageProps): Promise<Metadata> {
  const { customerId } = await params;
  const customer = await getAdminCustomerById(customerId);

  if (!customer) {
    return {
      title: "Cliente",
    };
  }

  const name = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    title: name || customer.email,
  };
}

function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amountMinor / 100);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function orderStatusLabel(status: AdminCustomerOrderItem["status"]) {
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

function paymentStatusLabel(status: AdminCustomerOrderItem["paymentStatus"]) {
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

function paymentMethodLabel(method: AdminCustomerOrderItem["paymentMethod"]) {
  switch (method) {
    case "stripe":
      return "Stripe";
    case "bank_transfer":
      return "Bonifico";
    case "satispay":
      return "Satispay";
  }
}

export default async function AdminCustomerDetailPage({
  params,
}: AdminCustomerDetailPageProps) {
  const { customerId } = await params;
  const customer = await getAdminCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const customerName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <Link
        href="/admin/clienti"
        className="inline-flex text-sm font-medium text-white/50 transition hover:text-orange-300"
      >
        ← Torna ai clienti
      </Link>

      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
            Dettaglio cliente
          </p>

          <h1 className="mt-2 max-w-full text-3xl font-semibold break-words text-white">
            {customerName || "Cliente"}
          </h1>

          <p className="mt-2 max-w-full text-sm break-all text-white/50">
            {customer.email}
          </p>
        </div>

        {customer.marketingConsent ? (
          <span className="inline-flex w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            Consenso marketing attivo
          </span>
        ) : (
          <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/40">
            Consenso marketing assente
          </span>
        )}
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Ordini" value={customer.orderCount} />
        <SummaryCard
          label="Ordini pagati"
          value={customer.paidOrderCount}
          emphasis
        />
        <SummaryCard
          label="Totale acquistato"
          value={formatMoney(customer.paidGrossAmountMinor)}
        />
        <SummaryCard
          label="Ultimo ordine"
          value={formatDate(customer.lastOrderAt)}
        />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#171717] p-4 sm:p-5">
          <h2 className="font-semibold text-white">Anagrafica</h2>

          <dl className="mt-5 grid min-w-0 gap-4 text-sm sm:grid-cols-2 xl:grid-cols-1">
            <InfoRow label="Nome" value={customer.firstName || "—"} />
            <InfoRow label="Cognome" value={customer.lastName || "—"} />
            <InfoRow label="Email" value={customer.email} />
            <InfoRow label="Telefono" value={customer.phone || "—"} />
            <InfoRow
              label="Data di nascita"
              value={customer.birthDate ? formatDate(customer.birthDate) : "—"}
            />
            <InfoRow
              label="Registrato il"
              value={formatDate(customer.createdAt)}
            />
            <InfoRow
              label="Ultimo aggiornamento"
              value={formatDate(customer.updatedAt)}
            />
            <InfoRow label="ID cliente" value={customer.id} mono />
          </dl>
        </section>

        <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#171717] p-4 sm:p-5">
          <h2 className="font-semibold text-white">Indirizzi salvati</h2>

          {customer.addresses.length === 0 ? (
            <p className="mt-4 text-sm text-white/40">
              Nessun indirizzo salvato.
            </p>
          ) : (
            <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2">
              {customer.addresses.map((address) => (
                <article
                  key={address.id}
                  className="min-w-0 overflow-hidden rounded-md border border-white/10 bg-[#111111] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold tracking-wide text-orange-300 uppercase">
                      {address.type === "shipping"
                        ? "Spedizione"
                        : "Fatturazione"}
                    </span>

                    {address.isDefaultShipping ? (
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                        Predefinito spedizione
                      </span>
                    ) : null}

                    {address.isDefaultBilling ? (
                      <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                        Predefinito fatturazione
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid min-w-0 gap-1 text-sm text-white/60 [&_p]:break-words">
                    <p className="text-xs font-medium text-white/35">
                      {address.label}
                    </p>

                    <p className="font-medium text-white">
                      {[address.firstName, address.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </p>

                    {address.company ? <p>{address.company}</p> : null}

                    <p>
                      {address.street} {address.streetNumber}
                    </p>

                    {address.line2 ? <p>{address.line2}</p> : null}

                    <p>
                      {[address.postalCode, address.city, address.province]
                        .filter(Boolean)
                        .join(" ")}
                    </p>

                    <p>{address.countryCode}</p>

                    {address.phone ? (
                      <p className="pt-2 text-white/45">Tel. {address.phone}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold text-white">Storico ordini</h2>
          <p className="mt-1 text-sm text-white/40">
            Tutti gli ordini associati a questo cliente.
          </p>
        </div>

        {customer.orders.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-white/40">
            Nessun ordine registrato.
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/10 xl:hidden">
              {customer.orders.map((order) => (
                <article key={order.id} className="min-w-0 p-4 sm:p-5">
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold break-all text-white">
                        Ordine {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs break-words text-white/40">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span className="inline-flex w-fit shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-white/65">
                      {orderStatusLabel(order.status)}
                    </span>
                  </div>

                  <dl className="mt-4 grid min-w-0 grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-md border border-white/[0.07] bg-[#111111] p-3">
                      <dt className="text-[11px] text-white/30">Pagamento</dt>
                      <dd className="mt-1 text-sm break-words text-white/70">
                        {paymentStatusLabel(order.paymentStatus)}
                      </dd>
                    </div>

                    <div className="min-w-0 rounded-md border border-white/[0.07] bg-[#111111] p-3">
                      <dt className="text-[11px] text-white/30">Metodo</dt>
                      <dd className="mt-1 text-sm break-words text-white/60">
                        {paymentMethodLabel(order.paymentMethod)}
                      </dd>
                    </div>

                    <div className="col-span-2 min-w-0 rounded-md border border-white/[0.07] bg-[#111111] p-3">
                      <dt className="text-[11px] text-white/30">Totale</dt>
                      <dd className="mt-1 text-lg font-semibold break-words text-orange-300">
                        {formatMoney(order.totalGrossAmountMinor)}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/admin/ordini/${encodeURIComponent(
                      order.orderNumber,
                    )}`}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-semibold text-black transition hover:bg-orange-400 sm:w-auto"
                  >
                    Apri ordine
                  </Link>
                </article>
              ))}
            </div>

            <div className="hidden xl:block">
              <table className="w-full min-w-[900px] divide-y divide-white/10 text-sm">
                <thead className="bg-white/[0.03]">
                  <tr className="text-left text-xs font-semibold tracking-wide text-white/40 uppercase">
                    <th className="px-5 py-4">Ordine</th>
                    <th className="px-5 py-4">Data</th>
                    <th className="px-5 py-4">Stato</th>
                    <th className="px-5 py-4">Pagamento</th>
                    <th className="px-5 py-4">Metodo</th>
                    <th className="px-5 py-4">Totale</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {customer.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4 font-semibold text-white">
                        {order.orderNumber}
                      </td>

                      <td className="px-5 py-4 text-white/55">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-white/70">
                        {orderStatusLabel(order.status)}
                      </td>

                      <td className="px-5 py-4 text-white/70">
                        {paymentStatusLabel(order.paymentStatus)}
                      </td>

                      <td className="px-5 py-4 text-white/55">
                        {paymentMethodLabel(order.paymentMethod)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-orange-300">
                        {formatMoney(order.totalGrossAmountMinor)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/ordini/${encodeURIComponent(
                            order.orderNumber,
                          )}`}
                          className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:border-orange-400/30 hover:text-white"
                        >
                          Apri ordine
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number | string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#171717] p-4 sm:p-5">
      <p className="text-xs font-medium tracking-wide text-white/40 uppercase">
        {label}
      </p>

      <p
        className={
          emphasis
            ? "mt-2 max-w-full text-xl leading-tight font-semibold break-words text-orange-300 tabular-nums sm:text-2xl"
            : "mt-2 max-w-full text-xl leading-tight font-semibold break-words text-white tabular-nums sm:text-2xl"
        }
      >
        {typeof value === "number" ? value.toLocaleString("it-IT") : value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-white/40">{label}</dt>
      <dd
        className={[
          "mt-1 max-w-full [overflow-wrap:anywhere] break-words text-white/75",
          mono ? "font-mono text-xs" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}
