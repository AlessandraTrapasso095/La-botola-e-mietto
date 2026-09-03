"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { businessInfo } from "@/config/business";
import { useCommerce } from "@/features/commerce/commerce-provider";
import {
  type PaymentMethod,
  type ShippingMethod,
} from "@/lib/validation/checkout";
import { formatEuroMinor } from "@/lib/money";
import { checkoutService } from "@/services/checkout/checkout-service";
import { stripeCheckoutService } from "@/services/checkout/stripe-checkout-service";
import type { Address } from "@/types/customer";

type CheckoutContentProps = {
  addresses: readonly Address[];
  loadError?: string;
};

function formatAddress(address: Address) {
  return [
    `${address.firstName} ${address.lastName}`,
    address.company,
    `${address.street} ${address.streetNumber}`,
    address.line2,
    `${address.postalCode} ${address.city}`,
    address.province,
  ]
    .filter(Boolean)
    .join(", ");
}

function findDefaultAddress(
  addresses: readonly Address[],
  type: "shipping" | "billing",
) {
  return (
    addresses.find((address) =>
      type === "shipping"
        ? address.isDefaultShipping
        : address.isDefaultBilling,
    ) ??
    addresses.find((address) => address.type === type) ??
    null
  );
}

export function CheckoutContent({
  addresses,
  loadError = "",
}: CheckoutContentProps) {
  const { cart, clearCartAfterCheckout } = useCommerce();

  const defaultShipping = useMemo(
    () => findDefaultAddress(addresses, "shipping"),
    [addresses],
  );

  const defaultBilling = useMemo(
    () => findDefaultAddress(addresses, "billing"),
    [addresses],
  );

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("tnt");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

  const [shippingAddressId, setShippingAddressId] = useState(
    defaultShipping?.id ?? "",
  );

  const [billingAddressId, setBillingAddressId] = useState(
    defaultBilling?.id ?? "",
  );

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [redirectingToPayment, setRedirectingToPayment] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<{
    number: string;
    totalMinor: number;
    paymentMethod: PaymentMethod;
    stripeRedirectFailed?: boolean;
  } | null>(null);

  const shippingAddresses = addresses.filter(
    (address) => address.type === "shipping",
  );

  const billingAddresses = addresses.filter(
    (address) => address.type === "billing",
  );

  const qualifiesForFreeShipping =
    cart.subtotalMinor >= Number(businessInfo.freeShippingThresholdMinor);

  const shippingMinor =
    shippingMethod === "store_pickup" || qualifiesForFreeShipping
      ? 0
      : Number(businessInfo.standardShippingGrossAmountMinor);

  const estimatedTotalMinor = cart.subtotalMinor + shippingMinor;

  const effectiveBillingAddressId =
    shippingMethod === "tnt" && billingSameAsShipping
      ? shippingAddressId
      : billingAddressId;

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (cart.lines.length === 0) {
      setError("Il carrello è vuoto.");
      return;
    }

    if (shippingMethod === "tnt" && !shippingAddressId) {
      setError("Seleziona un indirizzo di spedizione.");
      return;
    }

    if (!effectiveBillingAddressId) {
      setError("Seleziona un indirizzo di fatturazione.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await checkoutService.create({
        shippingAddressId: shippingMethod === "tnt" ? shippingAddressId : null,
        billingAddressId: effectiveBillingAddressId,
        shippingMethod,
        paymentMethod,
      });

      if (result.paymentMethod === "stripe") {
        setRedirectingToPayment(true);

        try {
          const stripeSession = await stripeCheckoutService.createSession(
            result.orderId,
          );

          window.location.assign(stripeSession.redirectUrl);
          return;
        } catch {
          setRedirectingToPayment(false);

          setCompletedOrder({
            number: result.orderNumber,
            totalMinor: result.totalGrossAmountMinor,
            paymentMethod: result.paymentMethod,
            stripeRedirectFailed: true,
          });

          return;
        }
      }

      if (result.paymentMethod === "bank_transfer") {
        clearCartAfterCheckout();
      }

      setCompletedOrder({
        number: result.orderNumber,
        totalMinor: result.totalGrossAmountMinor,
        paymentMethod: result.paymentMethod,
      });
    } catch (checkoutError: unknown) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Non è stato possibile completare il checkout.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (redirectingToPayment) {
    return (
      <div className="border-border-subtle bg-surface flex min-h-[32rem] flex-col items-center justify-center border px-6 text-center">
        <div
          className="border-border border-t-accent size-12 animate-spin rounded-full border-2"
          aria-hidden="true"
        />

        <p className="text-accent mt-7 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          Pagamento sicuro
        </p>

        <Heading as="h1" className="mt-4">
          Ti stiamo reindirizzando…
        </Heading>

        <p className="text-text-muted mt-4 max-w-md">
          Attendi qualche secondo. Stiamo preparando la pagina di pagamento
          sicuro Stripe.
        </p>

        <p className="text-text-muted mt-2 max-w-md text-sm">
          Non chiudere o aggiornare questa pagina.
        </p>
      </div>
    );
  }

  if (completedOrder) {
    return (
      <div className="border-border-subtle bg-surface border px-6 py-16 text-center sm:px-12">
        <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          Ordine ricevuto
        </p>

        <Heading as="h1" className="mt-4">
          Grazie per il tuo ordine.
        </Heading>

        <p className="text-text-muted mt-5">Il numero del tuo ordine è:</p>

        <p className="text-text-strong mt-2 font-serif text-2xl">
          {completedOrder.number}
        </p>

        <p className="text-text-muted mt-5">
          Totale:{" "}
          <strong className="text-text-strong">
            {formatEuroMinor(BigInt(completedOrder.totalMinor))}
          </strong>
        </p>

        {completedOrder.paymentMethod === "stripe" &&
        completedOrder.stripeRedirectFailed ? (
          <div className="border-border-subtle mx-auto mt-6 max-w-xl border p-5">
            <p className="text-text-strong font-semibold">
              L’ordine è stato registrato, ma non è stato possibile aprire
              Stripe.
            </p>
            <p className="text-text-muted mt-2 text-sm">
              Il pagamento non è stato addebitato. Potrai riprovare dalla pagina
              dell’ordine.
            </p>
          </div>
        ) : null}

        {completedOrder.paymentMethod === "bank_transfer" ? (
          <p className="text-text-muted mx-auto mt-6 max-w-xl">
            Riceverai le indicazioni necessarie per effettuare il bonifico
            bancario.
          </p>
        ) : null}

        {completedOrder.paymentMethod === "satispay" ? (
          <p className="text-text-muted mx-auto mt-6 max-w-xl">
            Riceverai le indicazioni necessarie per completare il pagamento
            tramite Satispay.
          </p>
        ) : null}

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/account/ordini"
            className="border-accent bg-accent hover:bg-accent-soft inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-colors"
          >
            Visualizza gli ordini
          </Link>

          <Link
            href="/catalogo"
            className="border-border text-text-strong hover:border-accent inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
          >
            Torna al catalogo
          </Link>
        </div>
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="border-border-subtle flex min-h-[30rem] flex-col items-center justify-center border px-6 text-center">
        <Heading as="h1">Il carrello è vuoto.</Heading>

        <p className="text-text-muted mt-4">
          Aggiungi almeno una bottiglia prima di procedere al checkout.
        </p>

        <Link
          href="/catalogo"
          className="border-accent bg-accent hover:bg-accent-soft mt-7 inline-flex min-h-12 items-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-colors"
        >
          Esplora il catalogo
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitCheckout}
      className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] xl:gap-20"
    >
      <div>
        <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          Conferma dell’ordine
        </p>

        <Heading as="h1" className="mt-4">
          Checkout
        </Heading>

        {loadError ? (
          <p
            role="alert"
            className="border-danger/30 bg-danger/5 text-danger mt-7 border p-4 text-sm"
          >
            {loadError}
          </p>
        ) : null}

        <section className="border-border-subtle mt-10 border p-5 sm:p-7">
          <h2 className="text-text-strong font-serif text-2xl">
            Metodo di consegna
          </h2>

          <div className="mt-6 grid gap-3">
            <label className="border-border-subtle has-checked:border-accent flex cursor-pointer items-start gap-4 border p-4">
              <input
                type="radio"
                name="shippingMethod"
                value="tnt"
                checked={shippingMethod === "tnt"}
                onChange={() => setShippingMethod("tnt")}
                className="mt-1"
              />

              <span className="flex-1">
                <span className="text-text-strong block font-semibold">
                  Spedizione TNT
                </span>

                <span className="text-text-muted mt-1 block text-sm">
                  Consegna indicativa entro 72 ore lavorative.
                </span>
              </span>

              <strong className="text-text-strong">
                {qualifiesForFreeShipping
                  ? "Gratuita"
                  : formatEuroMinor(
                      businessInfo.standardShippingGrossAmountMinor,
                    )}
              </strong>
            </label>

            <label className="border-border-subtle has-checked:border-accent flex cursor-pointer items-start gap-4 border p-4">
              <input
                type="radio"
                name="shippingMethod"
                value="store_pickup"
                checked={shippingMethod === "store_pickup"}
                onChange={() => setShippingMethod("store_pickup")}
                className="mt-1"
              />

              <span className="flex-1">
                <span className="text-text-strong block font-semibold">
                  Ritiro in negozio
                </span>

                <span className="text-text-muted mt-1 block text-sm">
                  Via Stradona 27, 35010 Campo San Martino (PD).
                </span>
              </span>

              <strong className="text-text-strong">Gratuito</strong>
            </label>
          </div>
        </section>

        {shippingMethod === "tnt" ? (
          <section className="border-border-subtle mt-6 border p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-text-strong font-serif text-2xl">
                Indirizzo di spedizione
              </h2>

              <Link
                href="/account/indirizzi"
                className="text-accent-soft text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
              >
                Gestisci indirizzi
              </Link>
            </div>

            {shippingAddresses.length === 0 ? (
              <p className="text-text-muted mt-5 text-sm">
                Non hai ancora inserito un indirizzo di spedizione.{" "}
                <Link
                  href="/account/indirizzi"
                  className="text-accent-soft underline"
                >
                  Aggiungilo ora
                </Link>
                .
              </p>
            ) : (
              <div className="mt-6 grid gap-3">
                {shippingAddresses.map((address) => (
                  <label
                    key={address.id}
                    className="border-border-subtle has-checked:border-accent flex cursor-pointer gap-4 border p-4"
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={address.id}
                      checked={shippingAddressId === address.id}
                      onChange={() => setShippingAddressId(address.id)}
                      className="mt-1"
                    />

                    <span>
                      <span className="text-text-strong block font-semibold">
                        {address.label}
                      </span>
                      <span className="text-text-muted mt-1 block text-sm">
                        {formatAddress(address)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        ) : null}

        <section className="border-border-subtle mt-6 border p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-text-strong font-serif text-2xl">
              Indirizzo di fatturazione
            </h2>

            <Link
              href="/account/indirizzi"
              className="text-accent-soft text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
            >
              Gestisci indirizzi
            </Link>
          </div>

          {shippingMethod === "tnt" ? (
            <label className="border-border-subtle mt-6 flex cursor-pointer items-start gap-3 border p-4">
              <input
                type="checkbox"
                checked={billingSameAsShipping}
                onChange={(event) =>
                  setBillingSameAsShipping(event.target.checked)
                }
                className="mt-1"
              />

              <span>
                <span className="text-text-strong block font-semibold">
                  L’indirizzo di fatturazione coincide con quello di spedizione
                </span>

                <span className="text-text-muted mt-1 block text-sm">
                  Lascia selezionata questa opzione se vuoi usare gli stessi
                  dati.
                </span>
              </span>
            </label>
          ) : null}

          {shippingMethod === "tnt" && billingSameAsShipping ? (
            <div className="border-border-subtle bg-surface-elevated mt-4 border p-4">
              <p className="text-text-muted text-sm">
                Verrà utilizzato automaticamente l’indirizzo di spedizione
                selezionato.
              </p>
            </div>
          ) : billingAddresses.length === 0 ? (
            <p className="text-text-muted mt-5 text-sm">
              Non hai ancora inserito un indirizzo di fatturazione.{" "}
              <Link
                href="/account/indirizzi"
                className="text-accent-soft underline"
              >
                Aggiungilo ora
              </Link>
              .
            </p>
          ) : (
            <div className="mt-6 grid gap-3">
              {billingAddresses.map((address) => (
                <label
                  key={address.id}
                  className="border-border-subtle has-checked:border-accent flex cursor-pointer gap-4 border p-4"
                >
                  <input
                    type="radio"
                    name="billingAddress"
                    value={address.id}
                    checked={billingAddressId === address.id}
                    onChange={() => setBillingAddressId(address.id)}
                    className="mt-1"
                  />

                  <span>
                    <span className="text-text-strong block font-semibold">
                      {address.label}
                    </span>

                    <span className="text-text-muted mt-1 block text-sm">
                      {formatAddress(address)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="border-border-subtle mt-6 border p-5 sm:p-7">
          <h2 className="text-text-strong font-serif text-2xl">
            Metodo di pagamento
          </h2>

          <div className="mt-6 grid gap-3">
            <label className="border-border-subtle has-checked:border-accent flex cursor-pointer gap-4 border p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
                className="mt-1"
              />

              <span>
                <span className="text-text-strong block font-semibold">
                  Carta o pagamento online
                </span>
                <span className="text-text-muted mt-1 block text-sm">
                  Pagamento sicuro gestito tramite Stripe.
                </span>
              </span>
            </label>

            <label className="border-border-subtle has-checked:border-accent flex cursor-pointer gap-4 border p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
                className="mt-1"
              />

              <span>
                <span className="text-text-strong block font-semibold">
                  Bonifico bancario
                </span>
                <span className="text-text-muted mt-1 block text-sm">
                  Riceverai i dati necessari dopo la conferma dell’ordine.
                </span>
              </span>
            </label>

            <label className="border-border-subtle has-checked:border-accent flex cursor-pointer gap-4 border p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="satispay"
                checked={paymentMethod === "satispay"}
                onChange={() => setPaymentMethod("satispay")}
                className="mt-1"
              />

              <span>
                <span className="text-text-strong block font-semibold">
                  Satispay
                </span>
                <span className="text-text-muted mt-1 block text-sm">
                  Completa il pagamento con il servizio Satispay.
                </span>
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside aria-label="Riepilogo ordine">
        <div className="border-border-subtle bg-surface sticky top-28 border p-6">
          <h2 className="text-text-strong font-serif text-2xl">
            Il tuo ordine
          </h2>

          <ul className="mt-6 grid gap-4">
            {cart.lines.map((line) => (
              <li
                key={line.product.slug}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-text-muted">
                  {line.quantity} × {line.product.name}
                </span>

                <strong className="text-text-strong whitespace-nowrap">
                  {formatEuroMinor(BigInt(line.lineTotalMinor))}
                </strong>
              </li>
            ))}
          </ul>

          <Divider className="my-5" />

          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Subtotale</dt>
              <dd className="text-text-strong">
                {formatEuroMinor(BigInt(cart.subtotalMinor))}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Spedizione</dt>
              <dd className="text-text-strong">
                {shippingMinor === 0
                  ? "Gratuita"
                  : formatEuroMinor(BigInt(shippingMinor))}
              </dd>
            </div>
          </dl>

          <Divider className="my-5" />

          <div className="flex items-end justify-between gap-4">
            <span className="text-text-strong font-serif text-xl">Totale</span>

            <div className="text-right">
              <strong className="text-text-strong text-xl">
                {formatEuroMinor(BigInt(estimatedTotalMinor))}
              </strong>

              <p className="text-text-muted text-[0.65rem] uppercase">
                IVA inclusa
              </p>
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-danger mt-5 text-sm">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            fullWidth
            className="mt-6"
            disabled={
              submitting ||
              !effectiveBillingAddressId ||
              (shippingMethod === "tnt" && !shippingAddressId)
            }
          >
            {submitting
              ? "Creazione ordine…"
              : paymentMethod === "stripe"
                ? "Continua con Stripe"
                : "Conferma ordine"}
          </Button>

          <p className="text-text-muted mt-4 text-center text-xs">
            Il totale definitivo viene ricalcolato in modo sicuro dal server.
          </p>
        </div>
      </aside>
    </form>
  );
}
