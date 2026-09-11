create or replace function public.admin_create_product(
  p_code text,
  p_name text,
  p_slug text,
  p_brand_id uuid,
  p_category_id uuid,
  p_subcategory_id uuid,
  p_description text,
  p_tasting_notes text,
  p_service_notes text,
  p_origin text,
  p_producer text,
  p_country text,
  p_capacity_ml integer,
  p_capacity_label text,
  p_pack_quantity integer,
  p_alcohol_percentage numeric,
  p_is_new boolean,
  p_is_limited boolean,
  p_net_amount_minor integer,
  p_vat_rate_basis_points integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_product_id uuid;
begin
  if length(trim(p_code)) = 0 then
    raise exception 'PRODUCT_CODE_REQUIRED';
  end if;

  if length(trim(p_name)) = 0 then
    raise exception 'PRODUCT_NAME_REQUIRED';
  end if;

  if length(trim(p_slug)) = 0 then
    raise exception 'PRODUCT_SLUG_REQUIRED';
  end if;

  if length(trim(p_capacity_label)) = 0 then
    raise exception 'PRODUCT_CAPACITY_LABEL_REQUIRED';
  end if;

  if p_category_id is null then
    raise exception 'PRODUCT_CATEGORY_REQUIRED';
  end if;

  if not exists (
    select 1
    from public.categories
    where id = p_category_id
      and parent_id is null
      and deleted_at is null
  ) then
    raise exception 'PRODUCT_CATEGORY_INVALID';
  end if;

  if p_brand_id is not null and not exists (
    select 1
    from public.brands
    where id = p_brand_id
      and deleted_at is null
  ) then
    raise exception 'PRODUCT_BRAND_INVALID';
  end if;

  if p_subcategory_id is not null and not exists (
    select 1
    from public.categories
    where id = p_subcategory_id
      and parent_id = p_category_id
      and deleted_at is null
  ) then
    raise exception 'PRODUCT_SUBCATEGORY_INVALID';
  end if;

  if p_capacity_ml is not null and p_capacity_ml <= 0 then
    raise exception 'PRODUCT_CAPACITY_INVALID';
  end if;

  if p_pack_quantity is null or p_pack_quantity <= 0 then
    raise exception 'PRODUCT_PACK_INVALID';
  end if;

  if p_alcohol_percentage is not null
    and (p_alcohol_percentage < 0 or p_alcohol_percentage > 100) then
    raise exception 'PRODUCT_ALCOHOL_INVALID';
  end if;

  if p_net_amount_minor < 0 then
    raise exception 'PRODUCT_PRICE_INVALID';
  end if;

  if p_vat_rate_basis_points < 0
    or p_vat_rate_basis_points > 10000 then
    raise exception 'PRODUCT_VAT_INVALID';
  end if;

  insert into public.products (
    code,
    name,
    slug,
    brand_id,
    category_id,
    subcategory_id,
    description,
    tasting_notes,
    service_notes,
    origin,
    producer,
    country,
    capacity_ml,
    capacity_label,
    pack_quantity,
    alcohol_percentage,
    is_new,
    is_limited,
    status
  )
  values (
    trim(p_code),
    trim(p_name),
    trim(p_slug),
    p_brand_id,
    p_category_id,
    p_subcategory_id,
    nullif(trim(p_description), ''),
    nullif(trim(p_tasting_notes), ''),
    nullif(trim(p_service_notes), ''),
    nullif(trim(p_origin), ''),
    nullif(trim(p_producer), ''),
    nullif(trim(p_country), ''),
    p_capacity_ml,
    trim(p_capacity_label),
    p_pack_quantity,
    p_alcohol_percentage,
    p_is_new,
    p_is_limited,
    'draft'
  )
  returning id into v_product_id;

  insert into public.inventory (
    product_id,
    stock_quantity,
    reserved_quantity
  )
  values (
    v_product_id,
    0,
    0
  );

  insert into public.prices (
    product_id,
    net_amount_minor,
    vat_rate_basis_points,
    currency,
    valid_from
  )
  values (
    v_product_id,
    p_net_amount_minor,
    p_vat_rate_basis_points,
    'EUR',
    now()
  );

  refresh materialized view public.catalog_products_projection;

  return v_product_id;
end;
$$;

revoke all on function public.admin_create_product(
  text,
  text,
  text,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  text,
  integer,
  numeric,
  boolean,
  boolean,
  integer,
  integer
) from public, anon, authenticated;

grant execute on function public.admin_create_product(
  text,
  text,
  text,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  text,
  integer,
  numeric,
  boolean,
  boolean,
  integer,
  integer
) to service_role;
