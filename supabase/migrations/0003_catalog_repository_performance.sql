create or replace function public.catalog_filter_options(
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
  with scoped_products as materialized (
    select product.brand_id, product.country
    from public.products as product
    where product.status = 'active'
      and product.deleted_at is null
      and (
        category_slug is null or exists (
          select 1
          from public.categories as category
          where category.id = product.category_id
            and category.slug = category_slug
        )
      )
      and (
        subcategory_slug is null or exists (
          select 1
          from public.categories as subcategory
          where subcategory.id = product.subcategory_id
            and subcategory.slug = subcategory_slug
        )
      )
      and (
        brand_slug is null or exists (
          select 1
          from public.brands as brand
          where brand.id = product.brand_id
            and brand.slug = brand_slug
        )
      )
      and (product_slugs is null or product.slug = any(product_slugs))
      and (
        not only_offers or exists (
          select 1
          from public.offers as offer
          where offer.product_id = product.id
            and offer.is_active
            and (offer.starts_at is null or offer.starts_at <= now())
            and (offer.ends_at is null or offer.ends_at > now())
        )
      )
  ),
  options as (
    select distinct
      'brand'::text as kind,
      brand.slug as value,
      brand.name as label
    from scoped_products
    join public.brands as brand on brand.id = scoped_products.brand_id

    union all

    select
      'category'::text,
      category.slug,
      category.name
    from public.categories as category
    where category.parent_id is null
      and category.status = 'active'
      and category.deleted_at is null

    union all

    select distinct
      'country'::text,
      scoped_products.country,
      scoped_products.country
    from scoped_products
    where scoped_products.country is not null
      and trim(scoped_products.country) <> ''
  )
  select options.kind, options.value, options.label
  from options
  where options.value is not null
    and options.label is not null
  order by options.kind, options.label;
$$;
