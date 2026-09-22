-- Webhook hardening:
-- un evento failure/expired appartenente a una Checkout Session Stripe
-- non più associata all'ordine deve essere ignorato.
--
-- In questo modo un webhook vecchio o fuori ordine non può:
-- - marcare failed un ordine collegato a una sessione più recente
-- - rilasciare erroneamente la prenotazione di magazzino.

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

  if
    v_order.stripe_checkout_session_id is not null
    and v_order.stripe_checkout_session_id <> p_checkout_session_id
  then
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

revoke all on function public.fail_stripe_order_payment(
  uuid,
  text
) from public, anon, authenticated;

grant execute on function public.fail_stripe_order_payment(
  uuid,
  text
) to service_role;
