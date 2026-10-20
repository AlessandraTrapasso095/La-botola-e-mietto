create or replace function public.admin_delete_product(
  p_product_id uuid
)
returns table (
  product_id uuid,
  product_slug text,
  storage_path text,
  thumbnail_path text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_product_slug text;
  v_storage_path text;
  v_thumbnail_path text;
begin
  select
    product.slug
  into
    v_product_slug
  from public.products as product
  where product.id = p_product_id
    and product.deleted_at is null
  for update;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'PRODUCT_NOT_FOUND';
  end if;

  if exists (
    select 1
    from public.order_items as order_item
    where order_item.product_id = p_product_id
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'PRODUCT_HAS_ORDER_HISTORY';
  end if;

  if exists (
    select 1
    from public.inventory_movements as movement
    where movement.product_id = p_product_id
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'PRODUCT_HAS_INVENTORY_HISTORY';
  end if;

  select
    image.storage_path,
    image.thumbnail_path
  into
    v_storage_path,
    v_thumbnail_path
  from public.product_images as image
  where image.product_id = p_product_id
    and image.is_primary
  order by image.sort_order asc
  limit 1;

  delete from public.cart_items
  where cart_items.product_id = p_product_id;

  delete from public.products
  where products.id = p_product_id;

  refresh materialized view public.catalog_products_projection;

  return query
  select
    p_product_id,
    v_product_slug,
    v_storage_path,
    v_thumbnail_path;
end;
$$;

revoke all on function public.admin_delete_product(uuid)
from public, anon, authenticated;

grant execute on function public.admin_delete_product(uuid)
to service_role;

comment on function public.admin_delete_product(uuid) is
  'Privileged permanent product deletion. Refuses deletion when order or inventory history exists, removes transient cart references and refreshes the public catalog projection.';
