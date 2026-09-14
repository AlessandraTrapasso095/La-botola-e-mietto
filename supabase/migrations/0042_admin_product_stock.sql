create or replace function public.admin_set_product_stock(
  p_product_id uuid,
  p_stock_quantity integer,
  p_note text,
  p_created_by uuid
)
returns table (
  product_id uuid,
  stock_quantity integer,
  reserved_quantity integer,
  available_quantity integer,
  movement_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_stock_before integer;
  v_reserved_quantity integer;
  v_movement_id uuid;
begin
  if p_stock_quantity is null or p_stock_quantity < 0 then
    raise exception using
      errcode = 'P0001',
      message = 'INVENTORY_STOCK_INVALID';
  end if;

  if
    length(trim(coalesce(p_note, ''))) < 3
    or length(trim(coalesce(p_note, ''))) > 500
  then
    raise exception using
      errcode = 'P0001',
      message = 'INVENTORY_NOTE_INVALID';
  end if;

  if p_created_by is null or not exists (
    select 1
    from public.profiles as profile
    where profile.id = p_created_by
      and profile.role = 'admin'
      and profile.deleted_at is null
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'ADMIN_USER_INVALID';
  end if;

  select
    product_inventory.stock_quantity,
    product_inventory.reserved_quantity
  into
    v_stock_before,
    v_reserved_quantity
  from public.inventory as product_inventory
  inner join public.products as product
    on product.id = product_inventory.product_id
  where product_inventory.product_id = p_product_id
    and product.deleted_at is null
  for update of product_inventory;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'PRODUCT_INVENTORY_NOT_FOUND';
  end if;

  if p_stock_quantity < v_reserved_quantity then
    raise exception using
      errcode = 'P0001',
      message = 'INVENTORY_STOCK_BELOW_RESERVED';
  end if;

  if p_stock_quantity = v_stock_before then
    raise exception using
      errcode = 'P0001',
      message = 'INVENTORY_STOCK_UNCHANGED';
  end if;

  update public.inventory
  set
    stock_quantity = p_stock_quantity,
    updated_at = now()
  where inventory.product_id = p_product_id;

  insert into public.inventory_movements (
    product_id,
    movement_type,
    stock_delta,
    reserved_delta,
    stock_before,
    stock_after,
    reserved_before,
    reserved_after,
    note,
    created_by
  )
  values (
    p_product_id,
    'admin_adjustment',
    p_stock_quantity - v_stock_before,
    0,
    v_stock_before,
    p_stock_quantity,
    v_reserved_quantity,
    v_reserved_quantity,
    trim(p_note),
    p_created_by
  )
  returning inventory_movements.id
  into v_movement_id;

  refresh materialized view public.catalog_products_projection;

  return query
  select
    product_inventory.product_id,
    product_inventory.stock_quantity,
    product_inventory.reserved_quantity,
    product_inventory.available_quantity,
    v_movement_id
  from public.inventory as product_inventory
  where product_inventory.product_id = p_product_id;
end;
$$;

revoke all on function public.admin_set_product_stock(
  uuid,
  integer,
  text,
  uuid
) from public, anon, authenticated;

grant execute on function public.admin_set_product_stock(
  uuid,
  integer,
  text,
  uuid
) to service_role;

comment on function public.admin_set_product_stock(
  uuid,
  integer,
  text,
  uuid
) is
  'Privileged atomic adjustment of physical product stock with audit movement.';
