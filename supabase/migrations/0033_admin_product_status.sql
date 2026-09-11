create or replace function public.admin_set_product_status(
  p_product_id uuid,
  p_status public.product_status
)
returns table (
  product_id uuid,
  product_status public.product_status
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.products
  set status = p_status
  where id = p_product_id
    and deleted_at is null;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  refresh materialized view public.catalog_products_projection;

  return query
  select
    product.id,
    product.status
  from public.products as product
  where product.id = p_product_id;
end;
$$;

revoke all on function public.admin_set_product_status(
  uuid,
  public.product_status
) from public;

revoke all on function public.admin_set_product_status(
  uuid,
  public.product_status
) from anon;

revoke all on function public.admin_set_product_status(
  uuid,
  public.product_status
) from authenticated;

grant execute on function public.admin_set_product_status(
  uuid,
  public.product_status
) to service_role;

comment on function public.admin_set_product_status(
  uuid,
  public.product_status
) is
  'Privileged server-side product status update. Refreshes the public catalog projection atomically after the status change.';
