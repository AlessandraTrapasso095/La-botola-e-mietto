alter table public.orders
  add column if not exists inventory_committed_at timestamptz;

comment on column public.orders.inventory_committed_at is
  'Data e ora dello scarico definitivo dalla giacenza fisica.';

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null
    references public.products(id)
    on delete cascade,
  order_id uuid
    references public.orders(id)
    on delete set null,
  movement_type text not null
    check (
      movement_type in (
        'admin_adjustment',
        'order_fulfilled',
        'reservation_reconciliation'
      )
    ),
  stock_delta integer not null default 0,
  reserved_delta integer not null default 0,
  stock_before integer not null check (stock_before >= 0),
  stock_after integer not null check (stock_after >= 0),
  reserved_before integer not null check (reserved_before >= 0),
  reserved_after integer not null check (reserved_after >= 0),
  note text,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint inventory_movements_has_change
    check (stock_delta <> 0 or reserved_delta <> 0),
  constraint inventory_movements_stock_delta_valid
    check (stock_after = stock_before + stock_delta),
  constraint inventory_movements_reserved_delta_valid
    check (reserved_after = reserved_before + reserved_delta),
  constraint inventory_movements_reservation_valid
    check (reserved_after <= stock_after)
);

create index if not exists inventory_movements_product_created_idx
on public.inventory_movements (product_id, created_at desc);

create index if not exists inventory_movements_order_idx
on public.inventory_movements (order_id)
where order_id is not null;

alter table public.inventory_movements enable row level security;

revoke all
on table public.inventory_movements
from public, anon, authenticated;

grant select, insert
on table public.inventory_movements
to service_role;

update public.orders
set inventory_committed_at = coalesce(
  shipped_at,
  delivered_at,
  updated_at,
  now()
)
where status in ('shipped', 'delivered')
  and inventory_committed_at is null;

with expected_reservations as (
  select
    order_item.product_id,
    sum(order_item.quantity)::integer as expected_reserved
  from public.orders as customer_order
  inner join public.order_items as order_item
    on order_item.order_id = customer_order.id
  where customer_order.status in ('received', 'preparing')
    and customer_order.reservation_released_at is null
    and customer_order.inventory_committed_at is null
    and order_item.product_id is not null
  group by order_item.product_id
),
reservation_changes as (
  select
    inventory.product_id,
    inventory.stock_quantity,
    inventory.reserved_quantity as reserved_before,
    coalesce(
      expected_reservations.expected_reserved,
      0
    )::integer as reserved_after
  from public.inventory as inventory
  left join expected_reservations
    on expected_reservations.product_id = inventory.product_id
  where inventory.reserved_quantity <> coalesce(
    expected_reservations.expected_reserved,
    0
  )
),
updated_inventory as (
  update public.inventory as inventory
  set
    reserved_quantity = reservation_changes.reserved_after,
    updated_at = now()
  from reservation_changes
  where inventory.product_id = reservation_changes.product_id
  returning
    inventory.product_id,
    inventory.stock_quantity,
    reservation_changes.reserved_before,
    inventory.reserved_quantity as reserved_after
)
insert into public.inventory_movements (
  product_id,
  movement_type,
  stock_delta,
  reserved_delta,
  stock_before,
  stock_after,
  reserved_before,
  reserved_after,
  note
)
select
  updated_inventory.product_id,
  'reservation_reconciliation',
  0,
  updated_inventory.reserved_after
    - updated_inventory.reserved_before,
  updated_inventory.stock_quantity,
  updated_inventory.stock_quantity,
  updated_inventory.reserved_before,
  updated_inventory.reserved_after,
  'Riconciliazione prenotazioni precedente alla gestione stock.'
from updated_inventory;

create or replace function public.commit_order_inventory_on_fulfillment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item record;
  v_stock_before integer;
  v_reserved_before integer;
  v_has_products boolean := false;
begin
  if new.inventory_committed_at is not null then
    return new;
  end if;

  if new.status not in ('shipped', 'delivered') then
    return new;
  end if;

  if old.status in ('shipped', 'delivered') then
    return new;
  end if;

  if new.payment_status not in ('paid', 'authorized') then
    raise exception using
      errcode = 'P0001',
      message = 'ORDER_PAYMENT_NOT_ACQUIRED';
  end if;

  for v_item in
    select
      order_item.product_id,
      sum(order_item.quantity)::integer as quantity
    from public.order_items as order_item
    where order_item.order_id = new.id
      and order_item.product_id is not null
    group by order_item.product_id
    order by order_item.product_id
  loop
    v_has_products := true;

    select
      inventory.stock_quantity,
      inventory.reserved_quantity
    into
      v_stock_before,
      v_reserved_before
    from public.inventory as inventory
    where inventory.product_id = v_item.product_id
    for update;

    if not found then
      raise exception using
        errcode = 'P0001',
        message = 'ORDER_INVENTORY_MISSING';
    end if;

    if v_stock_before < v_item.quantity then
      raise exception using
        errcode = 'P0001',
        message = 'ORDER_STOCK_INSUFFICIENT';
    end if;

    if v_reserved_before < v_item.quantity then
      raise exception using
        errcode = 'P0001',
        message = 'ORDER_RESERVATION_INCONSISTENT';
    end if;

    update public.inventory
    set
      stock_quantity = v_stock_before - v_item.quantity,
      reserved_quantity = v_reserved_before - v_item.quantity,
      updated_at = now()
    where product_id = v_item.product_id;

    insert into public.inventory_movements (
      product_id,
      order_id,
      movement_type,
      stock_delta,
      reserved_delta,
      stock_before,
      stock_after,
      reserved_before,
      reserved_after,
      note
    )
    values (
      v_item.product_id,
      new.id,
      'order_fulfilled',
      -v_item.quantity,
      -v_item.quantity,
      v_stock_before,
      v_stock_before - v_item.quantity,
      v_reserved_before,
      v_reserved_before - v_item.quantity,
      'Scarico automatico per evasione ordine.'
    );
  end loop;

  if not v_has_products then
    raise exception using
      errcode = 'P0001',
      message = 'ORDER_PRODUCTS_MISSING';
  end if;

  new.inventory_committed_at := now();

  return new;
end;
$$;

revoke all
on function public.commit_order_inventory_on_fulfillment()
from public, anon, authenticated;

grant execute
on function public.commit_order_inventory_on_fulfillment()
to service_role;

drop trigger if exists orders_commit_inventory_before_fulfillment
on public.orders;

create trigger orders_commit_inventory_before_fulfillment
before update of status
on public.orders
for each row
execute function public.commit_order_inventory_on_fulfillment();

refresh materialized view public.catalog_products_projection;
