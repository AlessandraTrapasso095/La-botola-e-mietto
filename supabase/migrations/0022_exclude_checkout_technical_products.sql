create or replace view public.catalog_products_source_view
with (security_invoker = false, security_barrier = true)
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
  coalesce(
    offer.promotional_net_amount_minor,
    price.net_amount_minor
  )
  +
  (
    coalesce(
      offer.promotional_net_amount_minor,
      price.net_amount_minor
    )
    * price.vat_rate_basis_points
    + 5000
  ) / 10000 as gross_amount_minor,
  case
    when offer.promotional_net_amount_minor is not null
      then price.net_amount_minor
      +
      (
        price.net_amount_minor
        * price.vat_rate_basis_points
        + 5000
      ) / 10000
    else null::bigint
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
      case
        when offer.id is not null then 'In offerta'
        else null
      end
    )
  ) as search_text
from public.products product
left join public.brands brand
  on brand.id = product.brand_id
 and brand.status = 'active'
 and brand.deleted_at is null
join public.categories category
  on category.id = product.category_id
 and category.status = 'active'
 and category.deleted_at is null
left join public.categories subcategory
  on subcategory.id = product.subcategory_id
 and subcategory.status = 'active'
 and subcategory.deleted_at is null
left join public.inventory inventory
  on inventory.product_id = product.id
join public.prices price
  on price.product_id = product.id
 and price.valid_to is null
left join public.offers offer
  on offer.product_id = product.id
 and offer.is_active
 and (
   offer.starts_at is null
   or offer.starts_at <= now()
 )
 and (
   offer.ends_at is null
   or offer.ends_at > now()
 )
left join public.product_images image
  on image.product_id = product.id
 and image.is_primary
where product.status = 'active'
  and product.deleted_at is null
  and product.code not like 'CHECKOUT-TECHNICAL%';

refresh materialized view public.catalog_products_projection;
