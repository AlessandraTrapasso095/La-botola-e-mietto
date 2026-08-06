create extension if not exists "unaccent" with schema extensions;

create function public.normalize_catalog_search(value text)
returns text
language sql
immutable
parallel safe
security invoker
set search_path = ''
as $$
  with without_apostrophes as (
    select replace(
      replace(
        replace(lower(extensions.unaccent(coalesce(value, ''))), '’', ''),
        '''',
        ''
      ),
      '`',
      ''
    ) as value
  ),
  with_separators as (
    select regexp_replace(value, '[&|_/-]+', ' ', 'g') as value
    from without_apostrophes
  ),
  without_conjunction as (
    select regexp_replace(
      ' ' || value || ' ',
      '[[:space:]]+e[[:space:]]+',
      ' ',
      'g'
    ) as value
    from with_separators
  )
  select trim(
    regexp_replace(
      regexp_replace(value, '[^a-z0-9]+', ' ', 'g'),
      '[[:space:]]+',
      ' ',
      'g'
    )
  )
  from without_conjunction;
$$;

create view public.catalog_products_view
with (security_invoker = true)
as
select
  product.id as product_id,
  product.code,
  product.slug,
  product.name,
  product.description,
  product.tasting_notes,
  product.service_notes,
  product.origin,
  product.producer,
  product.country,
  product.capacity_ml,
  product.capacity_label,
  product.pack_quantity,
  product.alcohol_percentage,
  product.is_new,
  product.is_limited,
  product.created_at,
  product.updated_at,
  brand.id as brand_id,
  brand.slug as brand_slug,
  brand.name as brand_name,
  brand.country as brand_country,
  category.id as category_id,
  category.slug as category_slug,
  category.name as category_name,
  subcategory.id as subcategory_id,
  subcategory.slug as subcategory_slug,
  subcategory.name as subcategory_name,
  inventory.stock_quantity,
  inventory.reserved_quantity,
  inventory.available_quantity,
  price.net_amount_minor as regular_net_amount_minor,
  price.vat_rate_basis_points,
  price.currency,
  offer.id as offer_id,
  offer.promotional_net_amount_minor,
  coalesce(
    offer.promotional_net_amount_minor,
    price.net_amount_minor
  ) as effective_net_amount_minor,
  (
    coalesce(offer.promotional_net_amount_minor, price.net_amount_minor) +
    (
      coalesce(offer.promotional_net_amount_minor, price.net_amount_minor) *
      price.vat_rate_basis_points + 5000
    ) / 10000
  )::bigint as gross_amount_minor,
  case
    when offer.promotional_net_amount_minor is not null then
      (
        price.net_amount_minor +
        (price.net_amount_minor * price.vat_rate_basis_points + 5000) / 10000
      )::bigint
    else null
  end as previous_gross_amount_minor,
  image.storage_path as image_path,
  image.thumbnail_path,
  image.alt_text as image_alt_text,
  image.width as image_width,
  image.height as image_height,
  public.normalize_catalog_search(
    concat_ws(
      ' ',
      product.code,
      product.name,
      brand.name,
      category.name,
      subcategory.name,
      product.capacity_label,
      product.producer,
      product.country,
      case when offer.id is not null then 'In offerta' end
    )
  ) as search_text
from public.products as product
left join public.brands as brand
  on brand.id = product.brand_id
  and brand.status = 'active'
  and brand.deleted_at is null
join public.categories as category
  on category.id = product.category_id
  and category.status = 'active'
  and category.deleted_at is null
left join public.categories as subcategory
  on subcategory.id = product.subcategory_id
  and subcategory.status = 'active'
  and subcategory.deleted_at is null
left join public.inventory as inventory
  on inventory.product_id = product.id
join public.prices as price
  on price.product_id = product.id
  and price.valid_to is null
left join public.offers as offer
  on offer.product_id = product.id
  and offer.is_active
  and (offer.starts_at is null or offer.starts_at <= now())
  and (offer.ends_at is null or offer.ends_at > now())
left join public.product_images as image
  on image.product_id = product.id
  and image.is_primary
where product.status = 'active'
  and product.deleted_at is null;

create view public.catalog_brands_view
with (security_invoker = true)
as
select
  brand.id as brand_id,
  brand.slug,
  brand.name,
  brand.country,
  brand.description,
  count(distinct product.id)::bigint as product_count,
  public.normalize_catalog_search(
    concat_ws(' ', brand.name, brand.country)
  ) as search_text
from public.brands as brand
join public.products as product
  on product.brand_id = brand.id
  and product.status = 'active'
  and product.deleted_at is null
where brand.status = 'active'
  and brand.deleted_at is null
group by brand.id, brand.slug, brand.name, brand.country, brand.description;

create view public.catalog_categories_view
with (security_invoker = true)
as
select
  category.id as category_id,
  category.slug,
  category.name,
  category.description,
  category.sort_order,
  coalesce(
    array_agg(distinct subcategory.name order by subcategory.name)
      filter (where subcategory.id is not null),
    '{}'::text[]
  ) as subcategories,
  count(distinct product.id)::bigint as product_count,
  public.normalize_catalog_search(
    concat_ws(
      ' ',
      category.name,
      string_agg(distinct subcategory.name, ' ')
    )
  ) as search_text
from public.categories as category
left join public.categories as subcategory
  on subcategory.parent_id = category.id
  and subcategory.status = 'active'
  and subcategory.deleted_at is null
left join public.products as product
  on product.category_id = category.id
  and product.status = 'active'
  and product.deleted_at is null
where category.parent_id is null
  and category.status = 'active'
  and category.deleted_at is null
group by
  category.id,
  category.slug,
  category.name,
  category.description,
  category.sort_order;

create function public.catalog_filter_options(
  category_slug text default null,
  subcategory_slug text default null,
  brand_slug text default null,
  product_slugs text[] default null,
  only_offers boolean default false
)
returns table (
  kind text,
  value text,
  label text
)
language sql
stable
security invoker
set search_path = ''
as $$
  with scoped as (
    select product.*
    from public.catalog_products_view as product
    where (category_slug is null or product.category_slug = category_slug)
      and (
        subcategory_slug is null or
        product.subcategory_slug = subcategory_slug
      )
      and (brand_slug is null or product.brand_slug = brand_slug)
      and (product_slugs is null or product.slug = any(product_slugs))
      and (not only_offers or product.offer_id is not null)
  ),
  options as (
    select distinct
      'brand'::text as kind,
      scoped.brand_slug as value,
      scoped.brand_name as label
    from scoped
    where scoped.brand_slug is not null
      and scoped.brand_name is not null

    union all

    select
      'category'::text,
      category.slug,
      category.name
    from public.catalog_categories_view as category

    union all

    select distinct
      'country'::text,
      scoped.country,
      scoped.country
    from scoped
    where scoped.country is not null
      and trim(scoped.country) <> ''
  )
  select options.kind, options.value, options.label
  from options
  where options.value is not null
    and options.label is not null
  order by options.kind, options.label;
$$;

create index products_featured_idx
on public.products (is_limited desc, is_new desc, name, code)
where status = 'active' and deleted_at is null;

create index prices_current_amount_idx
on public.prices (net_amount_minor, product_id)
where valid_to is null;

grant execute on function public.normalize_catalog_search(text)
to anon, authenticated;
grant execute on function public.catalog_filter_options(
  text,
  text,
  text,
  text[],
  boolean
) to anon, authenticated;

grant select on public.catalog_products_view to anon, authenticated;
grant select on public.catalog_brands_view to anon, authenticated;
grant select on public.catalog_categories_view to anon, authenticated;
