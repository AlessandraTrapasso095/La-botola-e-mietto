alter table public.orders
  add column if not exists customer_cancellation_note text;

comment on column public.orders.customer_cancellation_note is
  'Motivazione dell annullamento comunicata al cliente.';


create or replace function public.cancel_admin_received_order(
  p_order_id uuid,
  p_customer_note text,
  p_refund_provider text default null,
  p_refund_reference text default null,
  p_refund_amount_minor bigint default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_note text;
begin
  v_note := nullif(btrim(p_customer_note), '');

  if v_note is null then
    raise exception using
      errcode = 'P0001',
      message = 'Inserisci una motivazione per il cliente.';
  end if;

  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if v_order.id is null then
    raise exception using
      errcode = 'P0001',
      message = 'Ordine non disponibile.';
  end if;

  if v_order.status = 'cancelled' then
    return 'cancelled';
  end if;

  if v_order.status <> 'received' then
    raise exception using
      errcode = 'P0001',
      message = 'Solo un ordine ricevuto può essere annullato direttamente.';
  end if;

  if v_order.cancellation_request_status = 'pending' then
    raise exception using
      errcode = 'P0001',
      message = 'È già presente una richiesta di annullamento del cliente.';
  end if;

  if v_order.payment_status in ('paid', 'authorized')
     and nullif(btrim(p_refund_reference), '') is null
  then
    raise exception using
      errcode = 'P0001',
      message = 'Il rimborso deve essere completato prima dell annullamento.';
  end if;

  if p_refund_amount_minor is not null
     and p_refund_amount_minor < 0
  then
    raise exception using
      errcode = 'P0001',
      message = 'Importo rimborso non valido.';
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

    payment_status =
      case
        when v_order.payment_status in ('paid', 'authorized')
          then 'refunded'::public.payment_status
        else 'failed'::public.payment_status
      end,

    cancelled_at = coalesce(cancelled_at, now()),

    reservation_released_at =
      coalesce(reservation_released_at, now()),

    customer_cancellation_note = v_note,

    refund_provider =
      coalesce(
        nullif(btrim(p_refund_provider), ''),
        refund_provider
      ),

    refund_reference =
      coalesce(
        nullif(btrim(p_refund_reference), ''),
        refund_reference
      ),

    refund_amount_minor =
      coalesce(
        p_refund_amount_minor,
        refund_amount_minor
      ),

    refunded_at =
      case
        when v_order.payment_status in ('paid', 'authorized')
          then coalesce(refunded_at, now())
        else refunded_at
      end,

    updated_at = now()

  where id = p_order_id;

  return 'cancelled';
end;
$$;


revoke all
on function public.cancel_admin_received_order(
  uuid,
  text,
  text,
  text,
  bigint
)
from public, anon, authenticated;

grant execute
on function public.cancel_admin_received_order(
  uuid,
  text,
  text,
  text,
  bigint
)
to service_role;
