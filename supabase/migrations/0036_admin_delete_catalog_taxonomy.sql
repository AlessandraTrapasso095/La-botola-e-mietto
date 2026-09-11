create or replace function public.admin_delete_brand(
  p_brand_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.brands
    where id = p_brand_id
      and deleted_at is null
  ) then
    raise exception 'BRAND_NOT_FOUND';
  end if;

  if exists (
    select 1
    from public.products
    where brand_id = p_brand_id
      and deleted_at is null
  ) then
    raise exception 'BRAND_IN_USE';
  end if;

  update public.brands
  set
    deleted_at = now(),
    updated_at = now()
  where id = p_brand_id
    and deleted_at is null;

  refresh materialized view public.catalog_products_projection;
end;
$$;

create or replace function public.admin_delete_category(
  p_category_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_parent_id uuid;
begin
  select parent_id
  into v_parent_id
  from public.categories
  where id = p_category_id
    and deleted_at is null;

  if not found then
    raise exception 'CATEGORY_NOT_FOUND';
  end if;

  if exists (
    select 1
    from public.products
    where deleted_at is null
      and (
        category_id = p_category_id
        or subcategory_id = p_category_id
      )
  ) then
    raise exception 'CATEGORY_IN_USE';
  end if;

  if v_parent_id is null and exists (
    select 1
    from public.categories
    where parent_id = p_category_id
      and deleted_at is null
  ) then
    raise exception 'CATEGORY_HAS_SUBCATEGORIES';
  end if;

  update public.categories
  set
    deleted_at = now(),
    updated_at = now()
  where id = p_category_id
    and deleted_at is null;

  refresh materialized view public.catalog_products_projection;
end;
$$;

revoke all on function public.admin_delete_brand(uuid)
from public, anon, authenticated;

revoke all on function public.admin_delete_category(uuid)
from public, anon, authenticated;

grant execute on function public.admin_delete_brand(uuid)
to service_role;

grant execute on function public.admin_delete_category(uuid)
to service_role;
