create or replace function public.admin_preview_bulk_price_increase_v2(
  p_percentage numeric,
  p_query text default null,
  p_status text default null,
  p_brand_id uuid default null,
  p_category_id uuid default null,
  p_availability text default null
)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  with targets as (
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
  ),
  sample as (
    select *
    from targets
    order by name, code
    limit 10
  )
  select jsonb_build_object(
    'total_count',
      (select count(*) from targets),
    'active_offer_count',
      (select count(*) from targets where has_active_offer),
    'items',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'product_id', sample.product_id,
              'code', sample.code,
              'name', sample.name,
              'current_net_amount_minor', sample.current_net_amount_minor,
              'new_net_amount_minor', sample.new_net_amount_minor,
              'vat_rate_basis_points', sample.vat_rate_basis_points,
              'has_active_offer', sample.has_active_offer
            )
            order by sample.name, sample.code
          )
          from sample
        ),
        '[]'::jsonb
      )
  );
$$;

revoke all on function public.admin_preview_bulk_price_increase_v2(
  numeric, text, text, uuid, uuid, text
) from public, anon, authenticated;

grant execute on function public.admin_preview_bulk_price_increase_v2(
  numeric, text, text, uuid, uuid, text
) to service_role;
