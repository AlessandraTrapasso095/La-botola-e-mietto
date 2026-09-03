import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import type { AccountOrderView } from "@/server/account/orders";

function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amountMinor / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function orderStatusLabel(status: AccountOrderView["status"]) {
  switch (status) {
    case "received":
      return "Ricevuto";
    case "preparing":
      return "In preparazione";
    case "shipped":
      return "Spedito";
    case "delivered":
      return "Consegnato";
    case "cancelled":
      return "Annullato";
  }
}

function paymentStatusLabel(status: AccountOrderView["paymentStatus"]) {
  switch (status) {
    case "pending":
      return "In attesa";
    case "authorized":
      return "Autorizzato";
    case "paid":
      return "Pagato";
    case "failed":
      return "Non riuscito";
    case "refunded":
      return "Rimborsato";
  }
}

function paymentMethodLabel(method: AccountOrderView["paymentMethod"]) {
  switch (method) {
    case "stripe":
      return "Carta / Stripe";
    case "bank_transfer":
      return "Bonifico bancario";
    case "satispay":
      return "Satispay";
  }
}

export function OrdersList({
  orders,
}: {
  orders: readonly AccountOrderView[];
}) {
  if (orders.length === 0) {
    return (
      <div className="border-border-subtle border px-6 py-20 text-center">
        <Heading as="h1">Nessun ordine</Heading>

        <p className="text-text-muted mt-4">
          Non hai ancora effettuato alcun ordine.
        </p>

        <Link
          href="/catalogo"
          className="border-accent bg-accent mt-8 inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase"
        >
          Vai al catalogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
        Area personale
      </p>

      <Heading as="h1" size="xl" className="mt-4">
        I miei ordini
      </Heading>

      <p className="text-text-muted mt-4">
        Consulta i tuoi ordini, lo stato del pagamento e l’avanzamento della
        spedizione.
      </p>

      <div className="mt-10 grid gap-5">
        {orders.map((order) => (
          <article
            key={order.id}
            className="border-border-subtle bg-surface border p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-text-muted text-xs tracking-wide uppercase">
                  Ordine
                </p>

                <h2 className="text-text-strong mt-1 font-serif text-xl">
                  {order.orderNumber}
                </h2>

                <time
                  dateTime={order.createdAt}
                  className="text-text-muted mt-2 block text-sm"
                >
                  {formatDate(order.createdAt)}
                </time>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>{orderStatusLabel(order.status)}</Badge>

                <Badge>
                  Pagamento: {paymentStatusLabel(order.paymentStatus)}
                </Badge>
              </div>
            </div>

            <dl className="border-border-subtle mt-6 grid gap-5 border-t pt-5 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-text-muted">Articoli</dt>
                <dd className="text-text-strong mt-1">{order.itemCount}</dd>
              </div>

              <div>
                <dt className="text-text-muted">Totale</dt>
                <dd className="text-text-strong mt-1 font-semibold">
                  {formatMoney(order.totalGrossAmountMinor)}
                </dd>
              </div>

              <div>
                <dt className="text-text-muted">Pagamento</dt>
                <dd className="text-text-strong mt-1">
                  {paymentMethodLabel(order.paymentMethod)}
                </dd>
              </div>

              <div>
                <dt className="text-text-muted">Consegna</dt>
                <dd className="text-text-strong mt-1">
                  {order.shippingMethod === "tnt"
                    ? "Spedizione TNT"
                    : "Ritiro in negozio"}
                </dd>
              </div>
            </dl>

            <div className="border-border-subtle mt-6 border-t pt-5">
              <details>
                <summary className="text-accent-soft cursor-pointer text-sm font-semibold">
                  Mostra articoli
                </summary>

                <ul className="mt-4 grid gap-3">
                  {order.products.map((product) => (
                    <li
                      key={product.id}
                      className="flex justify-between gap-5 text-sm"
                    >
                      <span className="text-text-muted">
                        {product.quantity} × {product.name}
                      </span>

                      <span className="text-text-muted">{product.code}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            {order.paymentMethod === "bank_transfer" &&
              order.paymentStatus === "pending" && (
                <div className="border-border-subtle bg-surface-soft mt-6 border p-4">
                  <p className="text-text-strong text-sm font-semibold">
                    In attesa del bonifico
                  </p>

                  <p className="text-text-muted mt-2 text-sm">
                    L’ordine è stato ricevuto e verrà lavorato secondo le
                    condizioni previste per il pagamento tramite bonifico.
                  </p>
                </div>
              )}

            {order.paymentMethod === "stripe" &&
              order.paymentStatus === "pending" && (
                <div className="border-border-subtle mt-6 border-t pt-5">
                  <p className="text-text-muted text-sm">
                    Il pagamento Stripe non risulta ancora completato.
                  </p>
                </div>
              )}

            <div className="mt-6">
              <Link
                href={`/account/ordini/${order.orderNumber}`}
                className="text-accent-soft inline-flex min-h-11 items-center text-sm font-semibold"
              >
                Vedi dettaglio ordine →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
