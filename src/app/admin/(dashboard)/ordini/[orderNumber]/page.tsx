import type { Metadata } from "next";
import Link from "next/link";
import { AdminOrderStatusActions } from "@/features/admin/order-status-actions";
import { notFound } from "next/navigation";

import {
  getServerAdminOrderByNumber,
  type AdminCancellationRequestStatus,
  type AdminOrderStatus,
  type AdminPaymentMethod,
  type AdminPaymentStatus,
  type AdminShippingMethod,
} from "@/server/admin/orders";

type AdminOrderDetailPageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

type AddressView = {
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  city?: string;
  province?: string;
  country?: string;
  phone?: string;
};

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Ordine ${orderNumber}`,
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

function shippingMethodLabel(method: AdminShippingMethod) {
  switch (method) {
    case "store_pickup":
      return "Ritiro in negozio";
    case "tnt":
      return "Spedizione TNT";
  }
}

function cancellationLabel(status: AdminCancellationRequestStatus) {
  switch (status) {
    case "pending":
      return "Da gestire";
    case "approved":
      return "Approvata";
    case "rejected":
      return "Rifiutata";
    case null:
      return "Nessuna richiesta";
  }
}

function toAddressView(value: unknown): AddressView {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const source = value as Record<string, unknown>;

  const read = (...keys: string[]) => {
    for (const key of keys) {
      const candidate = source[key];

      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }

    return undefined;
  };

  return {
    firstName: read("firstName", "first_name"),
    lastName: read("lastName", "last_name"),
    company: read("company"),
    addressLine1: read(
      "addressLine1",
      "address_line_1",
      "address_line1",
      "street",
      "address",
    ),
    addressLine2: read("addressLine2", "address_line_2", "address_line2"),
    postalCode: read("postalCode", "postal_code", "zip"),
    city: read("city"),
    province: read("province", "state"),
    country: read("country", "country_code"),
    phone: read("phone"),
  };
}

function AddressCard({ title, value }: { title: string; value: unknown }) {
  const address = toAddressView(value);

  const fullName = [address.firstName, address.lastName]
    .filter(Boolean)
    .join(" ");

  const cityLine = [
    address.postalCode,
    address.city,
    address.province ? `(${address.province})` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="rounded-lg border border-white/10 bg-[#171717] p-5">
      <h2 className="font-semibold">{title}</h2>

      <div className="mt-4 grid gap-1 text-sm text-white/60">
        {fullName && <p className="font-medium text-white">{fullName}</p>}
        {address.company && <p>{address.company}</p>}
        {address.addressLine1 && <p>{address.addressLine1}</p>}
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        {cityLine && <p>{cityLine}</p>}
        {address.country && <p>{address.country}</p>}
        {address.phone && <p className="pt-2">Tel. {address.phone}</p>}

        {!fullName &&
          !address.addressLine1 &&
          !cityLine &&
          !address.country && <p>Indirizzo non disponibile.</p>}
      </div>
    </section>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { orderNumber } = await params;

  const order = await getServerAdminOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const customerName = [order.customer.firstName, order.customer.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <Link
        href="/admin/ordini"
        className="text-sm font-medium text-white/50 transition hover:text-orange-300"
      >
        ← Torna agli ordini
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
            Dettaglio ordine
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {order.orderNumber}
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Creato il {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold">
            {orderStatusLabel(order.status)}
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold">
            Pagamento: {paymentStatusLabel(order.paymentStatus)}
          </span>
        </div>
      </div>

      {order.cancellationRequestStatus === "pending" && (
        <div className="mt-7 rounded-lg border border-orange-400/30 bg-orange-400/10 p-5">
          <p className="font-semibold text-orange-300">
            Richiesta di annullamento da gestire
          </p>

          <p className="mt-2 text-sm text-orange-100/60">
            Il cliente ha richiesto l’annullamento il{" "}
            {formatDate(order.cancellationRequestedAt)}.
          </p>
        </div>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-xs text-white/40">Totale</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatMoney(order.totalGrossAmountMinor)}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-xs text-white/40">Articoli</p>
          <p className="mt-2 text-2xl font-semibold">{order.itemCount}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-xs text-white/40">Pagamento</p>
          <p className="mt-2 font-semibold">
            {paymentMethodLabel(order.paymentMethod)}
          </p>
          <p className="mt-1 text-xs text-white/40">
            {paymentStatusLabel(order.paymentStatus)}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
          <p className="text-xs text-white/40">Consegna</p>
          <p className="mt-2 font-semibold">
            {shippingMethodLabel(order.shippingMethod)}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <div className="grid gap-5">
          <section className="overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="font-semibold">Prodotti</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.025] text-xs text-white/40 uppercase">
                  <tr>
                    <th className="px-5 py-4 font-medium">Prodotto</th>
                    <th className="px-5 py-4 font-medium">Q.tà</th>
                    <th className="px-5 py-4 font-medium">IVA</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Unitario
                    </th>
                    <th className="px-5 py-4 text-right font-medium">Totale</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {order.products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium">{product.name}</p>
                        <p className="mt-1 text-xs text-white/40">
                          {product.code}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-white/70">
                        {product.quantity}
                      </td>

                      <td className="px-5 py-4 text-white/70">
                        {(product.vatRateBasisPoints / 100).toLocaleString(
                          "it-IT",
                        )}
                        %
                      </td>

                      <td className="px-5 py-4 text-right text-white/70">
                        {formatMoney(product.unitGrossAmountMinor)}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold">
                        {formatMoney(product.lineGrossAmountMinor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <AddressCard
              title="Indirizzo di spedizione"
              value={order.shippingAddress}
            />

            <AddressCard
              title="Indirizzo di fatturazione"
              value={order.billingAddress}
            />
          </div>
        </div>

        <div className="grid content-start gap-5">
          <section className="rounded-lg border border-white/10 bg-[#171717] p-5">
            <h2 className="font-semibold">Cliente</h2>

            <dl className="mt-4 grid gap-4 text-sm">
              <div>
                <dt className="text-xs text-white/40">Nome</dt>
                <dd className="mt-1 font-medium">
                  {customerName || "Cliente"}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-white/40">Email</dt>
                <dd className="mt-1 break-all text-white/70">
                  {order.customer.email}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-white/40">ID cliente</dt>
                <dd className="mt-1 font-mono text-xs break-all text-white/50">
                  {order.customer.id}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#171717] p-5">
            <h2 className="font-semibold">Riepilogo economico</h2>

            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">Imponibile</dt>
                <dd>{formatMoney(order.subtotalNetAmountMinor)}</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-white/50">IVA</dt>
                <dd>{formatMoney(order.vatAmountMinor)}</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-white/50">Spedizione</dt>
                <dd>{formatMoney(order.shippingGrossAmountMinor)}</dd>
              </div>

              <div className="mt-2 flex justify-between gap-4 border-t border-white/10 pt-4 text-base font-semibold">
                <dt>Totale</dt>
                <dd>{formatMoney(order.totalGrossAmountMinor)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#171717] p-5">
            <h2 className="font-semibold">Gestione ordine</h2>

            <div className="mt-4">
              <AdminOrderStatusActions
                orderId={order.id}
                status={order.status}
                paymentStatus={order.paymentStatus}
                cancellationRequestStatus={order.cancellationRequestStatus}
              />
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#171717] p-5">
            <h2 className="font-semibold">Stato amministrativo</h2>

            <dl className="mt-4 grid gap-4 text-sm">
              <div>
                <dt className="text-xs text-white/40">Ordine</dt>
                <dd className="mt-1">{orderStatusLabel(order.status)}</dd>
              </div>

              <div>
                <dt className="text-xs text-white/40">Pagamento</dt>
                <dd className="mt-1">
                  {paymentStatusLabel(order.paymentStatus)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-white/40">
                  Richiesta annullamento
                </dt>
                <dd className="mt-1">
                  {cancellationLabel(order.cancellationRequestStatus)}
                </dd>
              </div>

              {order.cancellationRequestedAt && (
                <div>
                  <dt className="text-xs text-white/40">Richiesta il</dt>
                  <dd className="mt-1">
                    {formatDate(order.cancellationRequestedAt)}
                  </dd>
                </div>
              )}

              {order.cancellationRequestResolvedAt && (
                <div>
                  <dt className="text-xs text-white/40">Risolta il</dt>
                  <dd className="mt-1">
                    {formatDate(order.cancellationRequestResolvedAt)}
                  </dd>
                </div>
              )}

              {order.cancelledAt && (
                <div>
                  <dt className="text-xs text-white/40">Annullato il</dt>
                  <dd className="mt-1">{formatDate(order.cancelledAt)}</dd>
                </div>
              )}

              <div>
                <dt className="text-xs text-white/40">Ultimo aggiornamento</dt>
                <dd className="mt-1">{formatDate(order.updatedAt)}</dd>
              </div>
            </dl>
          </section>

          {(order.paymentProviderReference ||
            order.stripePaymentIntentId ||
            order.stripeCheckoutSessionId) && (
            <section className="rounded-lg border border-white/10 bg-[#171717] p-5">
              <h2 className="font-semibold">Riferimenti pagamento</h2>

              <dl className="mt-4 grid gap-4 text-sm">
                {order.paymentProviderReference && (
                  <div>
                    <dt className="text-xs text-white/40">
                      Provider reference
                    </dt>
                    <dd className="mt-1 font-mono text-xs break-all text-white/60">
                      {order.paymentProviderReference}
                    </dd>
                  </div>
                )}

                {order.stripeCheckoutSessionId && (
                  <div>
                    <dt className="text-xs text-white/40">Stripe Session</dt>
                    <dd className="mt-1 font-mono text-xs break-all text-white/60">
                      {order.stripeCheckoutSessionId}
                    </dd>
                  </div>
                )}

                {order.stripePaymentIntentId && (
                  <div>
                    <dt className="text-xs text-white/40">Payment Intent</dt>
                    <dd className="mt-1 font-mono text-xs break-all text-white/60">
                      {order.stripePaymentIntentId}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
