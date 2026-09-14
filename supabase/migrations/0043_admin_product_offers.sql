create or replace function public.admin_set_product_offer(
  p_product_id uuid,
  p_discount_percentage integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_regular_net_amount_minor bigint;
  v_promotional_net_amount_minor bigint;
  v_offer_id uuid;
begin
  if p_product_id is null then
    raise exception 'PRODUCT_ID_REQUIRED';
  end if;

  if
    p_discount_percentage is null
    or p_discount_percentage < 1
    or p_discount_percentage > 90
  then
    raise exception 'OFFER_DISCOUNT_INVALID';
  end if;

  perform 1
  from public.products
  where id = p_product_id
    and deleted_at is null
  for update;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  select price.net_amount_minor
  into v_regular_net_amount_minor
  from public.prices as price
  where price.product_id = p_product_id
    and price.valid_to is null
  for update;

  if v_regular_net_amount_minor is null then
    raise exception 'PRODUCT_CURRENT_PRICE_NOT_FOUND';
  end if;

  v_promotional_net_amount_minor := round(
    v_regular_net_amount_minor::numeric
    * (100 - p_discount_percentage)
    / 100
  )::bigint;

  if
    v_promotional_net_amount_minor <= 0
    or v_promotional_net_amount_minor >= v_regular_net_amount_minor
  then
    raise exception 'OFFER_PROMOTIONAL_PRICE_INVALID';
  end if;

  update public.offers
  set
    is_active = false,
    updated_at = now()
  where product_id = p_product_id
    and is_active;

  insert into public.offers (
    product_id,
    promotional_net_amount_minor,
    starts_at,
    ends_at,
    is_active
  )
  values (
    p_product_id,
    v_promotional_net_amount_minor,
    null,
    null,
    true
  )
  returning id into v_offer_id;

  refresh materialized view public.catalog_products_projection;

  return v_offer_id;
end;
$$;

create or replace function public.admin_deactivate_product_offer(
  p_product_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_offer_id uuid;
begin
  if p_product_id is null then
    raise exception 'PRODUCT_ID_REQUIRED';
  end if;

  perform 1
  from public.products
  where id = p_product_id
    and deleted_at is null
  for update;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  update public.offers
  set
    is_active = false,
    updated_at = now()
  where product_id = p_product_id
    and is_active
  returning id into v_offer_id;

  if v_offer_id is null then
    raise exception 'PRODUCT_OFFER_NOT_FOUND';
  end if;

  refresh materialized view public.catalog_products_projection;

  return v_offer_id;
end;
$$;

revoke all on function public.admin_set_product_offer(
  uuid,
  integer
) from public, anon, authenticated;

revoke all on function public.admin_deactivate_product_offer(
  uuid
) from public, anon, authenticated;

grant execute on function public.admin_set_product_offer(
  uuid,
  integer
) to service_role;

grant execute on function public.admin_deactivate_product_offer(
  uuid
) to service_role;

comment on function public.admin_set_product_offer(uuid, integer) is
  'Replaces the active product offer with a real percentage discount calculated from the current net price.';

comment on function public.admin_deactivate_product_offer(uuid) is
  'Deactivates the current product offer without deleting its historical row.';
