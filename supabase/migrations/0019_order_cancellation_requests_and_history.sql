create type public.order_cancellation_request_status as enum (
  'pending',
  'approved',
  'rejected'
);

alter table public.orders
  add column if not exists cancellation_requested_at timestamptz,
  add column if not exists cancellation_request_status public.order_cancellation_request_status,
  add column if not exists cancellation_request_resolved_at timestamptz,
  add column if not exists hidden_from_customer_at timestamptz;

create index if not exists orders_cancellation_request_idx
  on public.orders (
    cancellation_request_status,
    cancellation_requested_at
  )
  where cancellation_request_status = 'pending';

drop function if exists public.cancel_account_order(uuid);

create or replace function public.cancel_account_order(
  p_order_id uuid
)
returns text
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
    return 'cancelled';
  end if;

  if v_order.status in ('shipped', 'delivered') then
    raise exception using
      errcode = 'P0001',
      message = 'L’ordine è già stato spedito e non può più essere annullato.';
  end if;

  if v_order.status not in ('received', 'preparing') then
    raise exception using
      errcode = 'P0001',
      message = 'L’ordine non può essere annullato.';
  end if;

  /*
   * Ordini già pagati o autorizzati:
   * il cliente può soltanto richiedere l'annullamento.
   * Sarà l'admin ad approvare o rifiutare.
   */
  if v_order.payment_status in ('paid', 'authorized') then
    if v_order.cancellation_request_status = 'pending' then
      return 'requested';
    end if;

    update public.orders
    set
      cancellation_requested_at = now(),
      cancellation_request_status = 'pending',
      cancellation_request_resolved_at = null,
      updated_at = now()
    where id = p_order_id;

    return 'requested';
  end if;

  if v_order.payment_status = 'refunded' then
    raise exception using
      errcode = 'P0001',
      message = 'L’ordine risulta già rimborsato.';
  end if;

  /*
   * Ordini non pagati:
   * annullamento immediato e rilascio della prenotazione stock.
   */
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
    cancelled_at = coalesce(cancelled_at, now()),
    reservation_released_at =
      coalesce(reservation_released_at, now()),
    cancellation_request_status = null,
    cancellation_requested_at = null,
    cancellation_request_resolved_at = null,
    updated_at = now()
  where id = p_order_id;

  return 'cancelled';
end;
$$;

create or replace function public.hide_cancelled_account_order(
  p_order_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_id uuid;
begin
  v_profile_id := auth.uid();

  if v_profile_id is null then
    raise exception using
      errcode = '42501',
      message = 'Accesso richiesto.';
  end if;

  update public.orders
  set
    hidden_from_customer_at = coalesce(hidden_from_customer_at, now()),
    updated_at = now()
  where id = p_order_id
    and profile_id = v_profile_id
    and status = 'cancelled';

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'Solo un ordine annullato può essere eliminato dalla cronologia.';
  end if;

  return true;
end;
$$;

revoke all on function public.cancel_account_order(uuid) from public;
revoke all on function public.hide_cancelled_account_order(uuid) from public;

grant execute on function public.cancel_account_order(uuid)
to authenticated;

grant execute on function public.hide_cancelled_account_order(uuid)
to authenticated;
