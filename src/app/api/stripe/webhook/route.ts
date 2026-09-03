import { NextResponse } from "next/server";

import { getServerEnvironment } from "@/server/env";
import { getStripeClient } from "@/server/stripe/client";
import { handleStripeWebhookEvent } from "@/server/stripe/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { message: "Firma Stripe mancante." },
      { status: 400 },
    );
  }

  const { STRIPE_WEBHOOK_SECRET } = getServerEnvironment();

  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Webhook Stripe non configurato." },
      { status: 500 },
    );
  }

  const rawBody = await request.text();

  let event;

  try {
    event = getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json(
      { message: "Firma webhook Stripe non valida." },
      { status: 400 },
    );
  }

  try {
    await handleStripeWebhookEvent(event);
  } catch {
    return NextResponse.json(
      { message: "Gestione webhook non riuscita." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
