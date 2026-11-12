create or replace function public.admin_preview_bulk_price_increase(
  p_percentage numeric,
  p_query text default null,
  p_status text default null,
  p_brand_id uuid default null,
  p_category_id uuid default null,
  p_availability text default null
)
returns table (
  product_id uuid,
  code text,
  name text,
  current_net_amount_minor bigint,
  new_net_amount_minor bigint,
  vat_rate_basis_points integer,
  has_active_offer boolean
)
language sql
security definer
set search_path = ''
as $$
  select
    product.id as product_id,
    product.code,
    product.name,
    price.net_amount_minor as current_net_amount_minor,
    greatest(
      0,
      round(
        price.net_amount_minor::numeric * (1 + p_percentage / 100)
      )::bigint
    ) as new_net_amount_minor,
    price.vat_rate_basis_points,
    exists (
      select 1
      from public.offers as offer
      where offer.product_id = product.id
        and offer.is_active = true
        and offer.promotional_net_amount_minor is not null
        and (offer.starts_at is null or offer.starts_at <= now())
        and (offer.ends_at is null or offer.ends_at > now())
    ) as has_active_offer
  from public.products as product
  join public.prices as price
    on price.product_id = product.id
   and price.valid_to is null
  left join public.inventory as inventory
    on inventory.product_id = product.id
  where product.deleted_at is null
    and p_percentage > 0
    and p_percentage <= 100
    and (
      nullif(trim(coalesce(p_query, '')), '') is null
      or product.name ilike '%' || trim(p_query) || '%'
      or product.code ilike '%' || trim(p_query) || '%'
    )
    and (
      nullif(trim(coalesce(p_status, '')), '') is null
      or p_status = 'all'
      or product.status::text = p_status
    )
    and (p_brand_id is null or product.brand_id = p_brand_id)
    and (p_category_id is null or product.category_id = p_category_id)
    and (
      nullif(trim(coalesce(p_availability, '')), '') is null
      or p_availability = 'all'
      or (
        p_availability = 'available'
        and coalesce(inventory.available_quantity, 0) > 0
      )
      or (
        p_availability = 'unavailable'
        and coalesce(inventory.available_quantity, 0) <= 0
      )
    )
  order by product.name, product.code;
$$;

create or replace function public.admin_apply_bulk_price_increase(
  p_percentage numeric,
  p_query text default null,
  p_status text default null,
  p_brand_id uuid default null,
  p_category_id uuid default null,
  p_availability text default null
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_count integer := 0;
begin
  if p_percentage <= 0 or p_percentage > 100 then
    raise exception 'BULK_PRICE_PERCENTAGE_INVALID';
  end if;

  create temporary table if not exists pg_temp.bulk_price_targets (
    product_id uuid primary key,
    current_price_id uuid not null,
    new_net_amount_minor bigint not null,
    vat_rate_basis_points integer not null,
    currency text not null
  ) on commit drop;

  truncate pg_temp.bulk_price_targets;

  insert into pg_temp.bulk_price_targets (
    product_id,
    current_price_id,
    new_net_amount_minor,
    vat_rate_basis_points,
    currency
  )
  select
    product.id,
    price.id,
    greatest(
      0,
      round(
        price.net_amount_minor::numeric * (1 + p_percentage / 100)
      )::bigint
    ),
    price.vat_rate_basis_points,
    price.currency
  from public.products as product
  join public.prices as price
    on price.product_id = product.id
   and price.valid_to is null
  left join public.inventory as inventory
    on inventory.product_id = product.id
  where product.deleted_at is null
    and (
      nullif(trim(coalesce(p_query, '')), '') is null
      or product.name ilike '%' || trim(p_query) || '%'
      or product.code ilike '%' || trim(p_query) || '%'
    )
    and (
      nullif(trim(coalesce(p_status, '')), '') is null
      or p_status = 'all'
      or product.status::text = p_status
    )
    and (p_brand_id is null or product.brand_id = p_brand_id)
    and (p_category_id is null or product.category_id = p_category_id)
    and (
      nullif(trim(coalesce(p_availability, '')), '') is null
      or p_availability = 'all'
      or (
        p_availability = 'available'
        and coalesce(inventory.available_quantity, 0) > 0
      )
      or (
        p_availability = 'unavailable'
        and coalesce(inventory.available_quantity, 0) <= 0
      )
    );

  select count(*) into v_count
  from pg_temp.bulk_price_targets;

  update public.prices as price
  set valid_to = v_now
  from pg_temp.bulk_price_targets as target
  where price.id = target.current_price_id;

  insert into public.prices (
    product_id,
    net_amount_minor,
    vat_rate_basis_points,
    currency,
    valid_from
  )
  select
    target.product_id,
    target.new_net_amount_minor,
    target.vat_rate_basis_points,
    target.currency,
    v_now
  from pg_temp.bulk_price_targets as target;

  if v_count > 0 then
    refresh materialized view public.catalog_products_projection;
  end if;

  return v_count;
end;
$$;

revoke all on function public.admin_preview_bulk_price_increase(
  numeric, text, text, uuid, uuid, text
) from public, anon, authenticated;

revoke all on function public.admin_apply_bulk_price_increase(
  numeric, text, text, uuid, uuid, text
) from public, anon, authenticated;

grant execute on function public.admin_preview_bulk_price_increase(
  numeric, text, text, uuid, uuid, text
) to service_role;

grant execute on function public.admin_apply_bulk_price_increase(
  numeric, text, text, uuid, uuid, text
) to service_role;
