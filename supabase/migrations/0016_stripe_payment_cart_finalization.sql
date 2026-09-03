alter table public.orders
  add column if not exists reservation_released_at timestamptz;

create or replace function public.complete_stripe_order_payment(
  p_order_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
begin
  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if v_order.id is null then
    raise exception 'Ordine non disponibile.';
  end if;

  if v_order.payment_method <> 'stripe' then
    raise exception 'Metodo di pagamento ordine non valido.';
  end if;

  if
    v_order.stripe_checkout_session_id is not null
    and v_order.stripe_checkout_session_id <> p_checkout_session_id
  then
    raise exception 'Checkout Session Stripe non coerente.';
  end if;

  if v_order.payment_status = 'paid' then
    return true;
  end if;

  if v_order.reservation_released_at is not null then
    raise exception 'La prenotazione di magazzino dell''ordine è già stata rilasciata.';
  end if;

  update public.orders
  set
    payment_status = 'paid',
    stripe_checkout_session_id = p_checkout_session_id,
    stripe_payment_intent_id = p_payment_intent_id,
    payment_provider_reference =
      coalesce(p_payment_intent_id, p_checkout_session_id),
    updated_at = now()
  where id = p_order_id;

  if v_order.source_cart_id is not null then
    delete from public.cart_items
    where cart_id = v_order.source_cart_id;

    update public.carts
    set
      status = 'converted',
      updated_at = now()
    where id = v_order.source_cart_id
      and status = 'active';
  end if;

  return true;
end;
$$;

create or replace function public.fail_stripe_order_payment(
  p_order_id uuid,
  p_checkout_session_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
begin
  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if v_order.id is null then
    raise exception 'Ordine non disponibile.';
  end if;

  if v_order.payment_method <> 'stripe' then
    raise exception 'Metodo di pagamento ordine non valido.';
  end if;

  if v_order.payment_status = 'paid' then
    return false;
  end if;

  if v_order.reservation_released_at is null then
    update public.inventory as inventory
    set
      reserved_quantity = greatest(
        inventory.reserved_quantity - quantities.quantity,
        0
      ),
      updated_at = now()
    from (
      select
        order_item.product_id,
        sum(order_item.quantity)::integer as quantity
      from public.order_items as order_item
      where order_item.order_id = p_order_id
        and order_item.product_id is not null
      group by order_item.product_id
    ) as quantities
    where inventory.product_id = quantities.product_id;

    update public.orders
    set
      payment_status = 'failed',
      stripe_checkout_session_id =
        coalesce(stripe_checkout_session_id, p_checkout_session_id),
      reservation_released_at = now(),
      updated_at = now()
    where id = p_order_id;
  end if;

  return true;
end;
$$;

revoke all on function public.complete_stripe_order_payment(
  uuid,
  text,
  text
) from public;

revoke all on function public.fail_stripe_order_payment(
  uuid,
  text
) from public;

grant execute on function public.complete_stripe_order_payment(
  uuid,
  text,
  text
) to service_role;

grant execute on function public.fail_stripe_order_payment(
  uuid,
  text
) to service_role;
