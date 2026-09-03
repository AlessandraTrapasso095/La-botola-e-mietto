alter table public.orders
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

create unique index if not exists orders_stripe_checkout_session_id_key
  on public.orders (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create unique index if not exists orders_stripe_payment_intent_id_key
  on public.orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

comment on column public.orders.stripe_checkout_session_id is
  'Identificativo della Checkout Session Stripe associata all’ordine.';

comment on column public.orders.stripe_payment_intent_id is
  'Identificativo del Payment Intent Stripe associato all’ordine.';
