create or replace function public.cancel_account_order(
  p_order_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_id uuid;
  v_order public.orders%rowtype;
begin
  v_profile_id := auth.uid();

  if v_profile_id is null then
    raise exception using
      errcode = '42501',
      message = 'Accesso richiesto.';
  end if;

  select *
  into v_order
  from public.orders
  where id = p_order_id
    and profile_id = v_profile_id
  for update;

  if v_order.id is null then
    raise exception using
      errcode = 'P0001',
      message = 'Ordine non disponibile.';
  end if;

  if v_order.status = 'cancelled' then
    return true;
  end if;

  if v_order.payment_method <> 'stripe' then
    raise exception using
      errcode = 'P0001',
      message = 'Questo ordine non può essere annullato da questa procedura.';
  end if;

  if v_order.payment_status in ('paid', 'refunded') then
    raise exception using
      errcode = 'P0001',
      message = 'Un ordine già pagato non può essere annullato.';
  end if;

  if v_order.status <> 'received' then
    raise exception using
      errcode = 'P0001',
      message = 'L’ordine non può più essere annullato.';
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
  end if;

  update public.orders
  set
    status = 'cancelled',
    payment_status = 'failed',
    cancelled_at = now(),
    reservation_released_at =
      coalesce(reservation_released_at, now()),
    updated_at = now()
  where id = p_order_id;

  return true;
end;
$$;

revoke all on function public.cancel_account_order(uuid) from public;

grant execute on function public.cancel_account_order(uuid)
to authenticated;
