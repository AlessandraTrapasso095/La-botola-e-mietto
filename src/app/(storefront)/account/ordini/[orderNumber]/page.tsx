import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { CancelOrderButton } from "@/features/account/cancel-order-button";
import { HideOrderButton } from "@/features/account/hide-order-button";
import { StripeOrderPaymentButton } from "@/features/account/stripe-order-payment-button";
import { getServerAccountOrderByNumber } from "@/server/account/orders";

export const metadata: Metadata = {
  title: "Dettaglio ordine",
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function orderStatusLabel(status: string) {
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

    default:
      return status;
  }
}

function paymentStatusLabel(status: string) {
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

    default:
      return status;
  }
}

function getAddressLines(value: unknown) {
  if (!value || typeof value !== "object") {
    return [];
  }

  const address = value as Record<string, unknown>;

  const name = [address.firstName, address.lastName]
    .filter(
      (part): part is string =>
        typeof part === "string" && part.length > 0,
    )
    .join(" ");

  const street = [address.street, address.streetNumber]
    .filter(
      (part): part is string =>
        typeof part === "string" && part.length > 0,
    )
    .join(" ");

  const city = [address.postalCode, address.city, address.province]
    .filter(
      (part): part is string =>
        typeof part === "string" && part.length > 0,
    )
    .join(" ");

  return [
    name,
    typeof address.company === "string" ? address.company : "",
    street,
    typeof address.line2 === "string" ? address.line2 : "",
    city,
    typeof address.phone === "string" ? address.phone : "",
  ].filter(Boolean);
}

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await getServerAccountOrderByNumber(
    decodeURIComponent(orderNumber),
  );

  if (!order) {
    notFound();
  }

  const shippingAddress = getAddressLines(order.shippingAddress);
  const billingAddress = getAddressLines(order.billingAddress);

  const cancellationPending =
    order.cancellationRequestStatus === "pending" &&
    order.status !== "cancelled";

  const stripePending =
    order.paymentMethod === "stripe" &&
    order.paymentStatus === "pending" &&
    order.status !== "cancelled" &&
    !cancellationPending;

  const stripeFailed =
    order.paymentMethod === "stripe" &&
    order.paymentStatus === "failed" &&
    order.status !== "cancelled" &&
    !cancellationPending;

  const bankTransferPending =
    order.paymentMethod === "bank_transfer" &&
    order.paymentStatus === "pending" &&
    order.status !== "cancelled" &&
    !cancellationPending;

  const canRequestCancellation =
    (order.paymentStatus === "paid" ||
      order.paymentStatus === "authorized") &&
    (order.status === "received" || order.status === "preparing") &&
    order.cancellationRequestStatus !== "pending";

  return (
    <div>
      <Link
        href="/account/ordini"
        className="text-accent-soft inline-flex min-h-11 items-center text-sm font-semibold"
      >
        ← Torna ai miei ordini
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Dettaglio ordine
          </p>

          <Heading as="h1" size="xl" className="mt-3">
            {order.orderNumber}
          </Heading>

          <time
            dateTime={order.createdAt}
            className="text-text-muted mt-3 block text-sm"
          >
            {formatDate(order.createdAt)}
          </time>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{orderStatusLabel(order.status)}</Badge>

          <Badge>
            Pagamento: {paymentStatusLabel(order.paymentStatus)}
          </Badge>

          {order.cancellationRequestStatus === "pending" && (
            <Badge>Annullamento richiesto</Badge>
          )}
        </div>
      </div>

      {stripePending && (
        <div className="border-border-subtle bg-surface mt-8 border p-5 sm:p-6">
          <p className="text-text-strong font-semibold">
            Pagamento da completare
          </p>

          <p className="text-text-muted mt-2 text-sm">
            L’ordine è già stato registrato. Puoi completare il pagamento
            senza creare un nuovo ordine oppure annullarlo.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <StripeOrderPaymentButton orderId={order.id} />

            <CancelOrderButton orderId={order.id} />
          </div>
        </div>
      )}

      {stripeFailed && (
        <div className="border-border-subtle bg-surface mt-8 border p-5 sm:p-6">
          <p className="text-text-strong font-semibold">
            Pagamento non completato
          </p>

          <p className="text-text-muted mt-2 text-sm">
            Il tentativo di pagamento non è andato a buon fine. Puoi
            annullare questo ordine.
          </p>

          <div className="mt-5">
            <CancelOrderButton orderId={order.id} />
          </div>
        </div>
      )}

      {canRequestCancellation && (
        <div className="border-border-subtle bg-surface mt-8 border p-5 sm:p-6">
          <p className="text-text-strong font-semibold">
            Vuoi annullare l’ordine?
          </p>

          <p className="text-text-muted mt-2 text-sm">
            Il pagamento è già stato effettuato. Puoi inviare una richiesta
            di annullamento. La richiesta dovrà essere verificata e
            approvata prima che l’ordine venga effettivamente annullato.
          </p>

          <div className="mt-5">
            <CancelOrderButton
              orderId={order.id}
              requiresAdminApproval
            />
          </div>
        </div>
      )}

      {cancellationPending && (
        <div className="border-border-subtle bg-surface mt-8 border p-5 sm:p-6">
          <p className="text-text-strong font-semibold">
            Richiesta di annullamento inviata
          </p>

          <p className="text-text-muted mt-2 text-sm">
            La tua richiesta è in attesa di verifica da parte
            dell’amministrazione. L’ordine non è ancora annullato.
          </p>
        </div>
      )}

      {order.cancellationRequestStatus === "rejected" &&
        order.status !== "cancelled" && (
          <div className="border-border-subtle bg-surface mt-8 border p-5 sm:p-6">
            <p className="text-text-strong font-semibold">
              Richiesta di annullamento non approvata
            </p>

            <p className="text-text-muted mt-2 text-sm">
              La richiesta di annullamento è stata verificata ma non è stata
              approvata. L’ordine prosegue normalmente.
            </p>
          </div>
        )}

      {bankTransferPending && (
        <div className="border-border-subtle bg-surface mt-8 border p-5 sm:p-6">
          <p className="text-text-strong font-semibold">
            Bonifico in attesa
          </p>

          <p className="text-text-muted mt-2 text-sm">
            Il tuo ordine è stato ricevuto ed è in attesa della verifica del
            pagamento tramite bonifico.
          </p>
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="border-border-subtle bg-surface mt-8 border p-5 sm:p-6">
          <p className="text-text-strong font-semibold">
            Ordine annullato
          </p>

          <p className="text-text-muted mt-2 text-sm">
            Questo ordine è stato annullato e non può più essere elaborato.
          </p>

          <div className="mt-5">
            <HideOrderButton orderId={order.id} />
          </div>
        </div>
      )}

      <section className="border-border-subtle mt-8 border">
        <div className="border-border-subtle border-b p-5 sm:p-6">
          <h2 className="text-text-strong font-serif text-xl">
            Articoli ordinati
          </h2>
        </div>

        <div className="divide-border-subtle divide-y">
          {order.products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-start justify-between gap-5 p-5 sm:p-6"
            >
              <div>
                <p className="text-text-strong font-semibold">
                  {product.name}
                </p>

                <p className="text-text-muted mt-1 text-sm">
                  Codice {product.code}
                </p>

                <p className="text-text-muted mt-1 text-sm">
                  Quantità: {product.quantity}
                </p>
              </div>

              <div className="text-right text-sm">
                <p className="text-text-muted">
                  {formatMoney(product.unitGrossAmountMinor)} cad.
                </p>

                <p className="text-text-strong mt-1 font-semibold">
                  {formatMoney(product.lineGrossAmountMinor)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border-border-subtle border p-5 sm:p-6">
          <h2 className="text-text-strong font-serif text-xl">
            {order.shippingMethod === "tnt"
              ? "Indirizzo di spedizione"
              : "Ritiro"}
          </h2>

          <div className="text-text-muted mt-4 grid gap-1 text-sm">
            {shippingAddress.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className="border-border-subtle border p-5 sm:p-6">
          <h2 className="text-text-strong font-serif text-xl">
            Fatturazione
          </h2>

          <div className="text-text-muted mt-4 grid gap-1 text-sm">
            {billingAddress.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
      </div>

      <section className="border-border-subtle mt-8 border p-5 sm:p-6">
        <h2 className="text-text-strong font-serif text-xl">
          Riepilogo
        </h2>

        <dl className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between gap-5">
            <dt className="text-text-muted">Imponibile</dt>

            <dd className="text-text-strong">
              {formatMoney(order.subtotalNetAmountMinor)}
            </dd>
          </div>

          <div className="flex justify-between gap-5">
            <dt className="text-text-muted">IVA</dt>

            <dd className="text-text-strong">
              {formatMoney(order.vatAmountMinor)}
            </dd>
          </div>

          <div className="flex justify-between gap-5">
            <dt className="text-text-muted">Spedizione</dt>

            <dd className="text-text-strong">
              {order.shippingGrossAmountMinor === 0
                ? "Gratuita"
                : formatMoney(order.shippingGrossAmountMinor)}
            </dd>
          </div>

          <div className="border-border-subtle mt-2 flex justify-between gap-5 border-t pt-4 text-base">
            <dt className="text-text-strong font-semibold">
              Totale
            </dt>

            <dd className="text-text-strong font-semibold">
              {formatMoney(order.totalGrossAmountMinor)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
