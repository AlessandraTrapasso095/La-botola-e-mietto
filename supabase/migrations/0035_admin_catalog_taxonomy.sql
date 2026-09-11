create or replace function public.admin_upsert_brand(
  p_id uuid,
  p_name text,
  p_slug text,
  p_country text,
  p_description text,
  p_status public.product_status
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if length(trim(p_name)) = 0 then
    raise exception 'BRAND_NAME_REQUIRED';
  end if;

  if length(trim(p_slug)) = 0 then
    raise exception 'BRAND_SLUG_REQUIRED';
  end if;

  if p_id is null then
    insert into public.brands (
      name,
      slug,
      country,
      description,
      status
    )
    values (
      trim(p_name),
      trim(p_slug),
      nullif(trim(p_country), ''),
      nullif(trim(p_description), ''),
      p_status
    )
    returning id into v_id;
  else
    update public.brands
    set
      name = trim(p_name),
      slug = trim(p_slug),
      country = nullif(trim(p_country), ''),
      description = nullif(trim(p_description), ''),
      status = p_status,
      updated_at = now()
    where id = p_id
      and deleted_at is null
    returning id into v_id;

    if v_id is null then
      raise exception 'BRAND_NOT_FOUND';
    end if;
  end if;

  refresh materialized view public.catalog_products_projection;

  return v_id;
end;
$$;

create or replace function public.admin_upsert_category(
  p_id uuid,
  p_parent_id uuid,
  p_name text,
  p_slug text,
  p_description text,
  p_sort_order integer,
  p_status public.product_status
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if length(trim(p_name)) = 0 then
    raise exception 'CATEGORY_NAME_REQUIRED';
  end if;

  if length(trim(p_slug)) = 0 then
    raise exception 'CATEGORY_SLUG_REQUIRED';
  end if;

  if p_sort_order < 0 then
    raise exception 'CATEGORY_SORT_INVALID';
  end if;

  if p_parent_id is not null and not exists (
    select 1
    from public.categories as parent
    where parent.id = p_parent_id
      and parent.parent_id is null
      and parent.deleted_at is null
  ) then
    raise exception 'CATEGORY_PARENT_INVALID';
  end if;

  if p_id is not null and p_parent_id = p_id then
    raise exception 'CATEGORY_SELF_PARENT';
  end if;

  if p_id is null then
    insert into public.categories (
      parent_id,
      name,
      slug,
      description,
      sort_order,
      status
    )
    values (
      p_parent_id,
      trim(p_name),
      trim(p_slug),
      nullif(trim(p_description), ''),
      p_sort_order,
      p_status
    )
    returning id into v_id;
  else
    update public.categories
    set
      parent_id = p_parent_id,
      name = trim(p_name),
      slug = trim(p_slug),
      description = nullif(trim(p_description), ''),
      sort_order = p_sort_order,
      status = p_status,
      updated_at = now()
    where id = p_id
      and deleted_at is null
    returning id into v_id;

    if v_id is null then
      raise exception 'CATEGORY_NOT_FOUND';
    end if;
  end if;

  refresh materialized view public.catalog_products_projection;

  return v_id;
end;
$$;

revoke all on function public.admin_upsert_brand(
  uuid,
  text,
  text,
  text,
  text,
  public.product_status
) from public, anon, authenticated;

revoke all on function public.admin_upsert_category(
  uuid,
  uuid,
  text,
  text,
  text,
  integer,
  public.product_status
) from public, anon, authenticated;

grant execute on function public.admin_upsert_brand(
  uuid,
  text,
  text,
  text,
  text,
  public.product_status
) to service_role;

grant execute on function public.admin_upsert_category(
  uuid,
  uuid,
  text,
  text,
  text,
  integer,
  public.product_status
) to service_role;
