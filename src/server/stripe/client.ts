import "server-only";

import Stripe from "stripe";

import { getServerEnvironment } from "@/server/env";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (stripeClient) {
    return stripeClient;
  }

  const { STRIPE_SECRET_KEY } = getServerEnvironment();

  if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY non configurata.");
  }

  stripeClient = new Stripe(STRIPE_SECRET_KEY, {
    maxNetworkRetries: 2,
    timeout: 20_000,
  });

  return stripeClient;
}
