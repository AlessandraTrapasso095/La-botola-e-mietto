create or replace function public.admin_update_product(
  p_product_id uuid,
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
  p_net_amount_minor bigint,
  p_vat_rate_basis_points integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_price public.prices%rowtype;
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

  if p_capacity_ml is not null and p_capacity_ml <= 0 then
    raise exception 'PRODUCT_CAPACITY_INVALID';
  end if;

  if p_pack_quantity is not null and p_pack_quantity <= 0 then
    raise exception 'PRODUCT_PACK_INVALID';
  end if;

  if p_alcohol_percentage is not null
    and (p_alcohol_percentage < 0 or p_alcohol_percentage > 100)
  then
    raise exception 'PRODUCT_ALCOHOL_INVALID';
  end if;

  if p_net_amount_minor < 0 then
    raise exception 'PRODUCT_PRICE_INVALID';
  end if;

  if p_vat_rate_basis_points < 0
    or p_vat_rate_basis_points > 10000
  then
    raise exception 'PRODUCT_VAT_INVALID';
  end if;

  if p_subcategory_id is not null and not exists (
    select 1
    from public.categories as subcategory
    where subcategory.id = p_subcategory_id
      and subcategory.parent_id = p_category_id
      and subcategory.deleted_at is null
  ) then
    raise exception 'PRODUCT_SUBCATEGORY_INVALID';
  end if;

  update public.products
  set
    code = trim(p_code),
    name = trim(p_name),
    slug = trim(p_slug),
    brand_id = p_brand_id,
    category_id = p_category_id,
    subcategory_id = p_subcategory_id,
    description = nullif(trim(p_description), ''),
    tasting_notes = nullif(trim(p_tasting_notes), ''),
    service_notes = nullif(trim(p_service_notes), ''),
    origin = nullif(trim(p_origin), ''),
    producer = nullif(trim(p_producer), ''),
    country = nullif(trim(p_country), ''),
    capacity_ml = p_capacity_ml,
    capacity_label = trim(p_capacity_label),
    pack_quantity = p_pack_quantity,
    alcohol_percentage = p_alcohol_percentage,
    is_new = p_is_new,
    is_limited = p_is_limited,
    updated_at = now()
  where id = p_product_id
    and deleted_at is null;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  select *
  into v_current_price
  from public.prices
  where product_id = p_product_id
    and valid_to is null
  order by valid_from desc
  limit 1;

  if v_current_price.id is null then
    insert into public.prices (
      product_id,
      net_amount_minor,
      vat_rate_basis_points,
      currency
    )
    values (
      p_product_id,
      p_net_amount_minor,
      p_vat_rate_basis_points,
      'EUR'
    );
  elsif
    v_current_price.net_amount_minor <> p_net_amount_minor
    or v_current_price.vat_rate_basis_points <> p_vat_rate_basis_points
  then
    update public.prices
    set valid_to = now()
    where id = v_current_price.id;

    insert into public.prices (
      product_id,
      net_amount_minor,
      vat_rate_basis_points,
      currency
    )
    values (
      p_product_id,
      p_net_amount_minor,
      p_vat_rate_basis_points,
      'EUR'
    );
  end if;

  refresh materialized view public.catalog_products_projection;
end;
$$;

revoke all on function public.admin_update_product(
  uuid,
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
  bigint,
  integer
) from public, anon, authenticated;

grant execute on function public.admin_update_product(
  uuid,
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
  bigint,
  integer
) to service_role;
