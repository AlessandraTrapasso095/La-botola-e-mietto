alter view public.catalog_products_view
rename to catalog_products_source_view;

revoke all on public.catalog_products_source_view from anon, authenticated;

create materialized view public.catalog_products_projection
as
select *
from public.catalog_products_source_view;

revoke all on public.catalog_products_projection from anon, authenticated;

create unique index catalog_products_projection_product_uidx
on public.catalog_products_projection (product_id);

create unique index catalog_products_projection_code_uidx
on public.catalog_products_projection (code);

create unique index catalog_products_projection_slug_uidx
on public.catalog_products_projection (slug);

create index catalog_products_projection_featured_idx
on public.catalog_products_projection (
  is_limited desc,
  is_new desc,
  name,
  code
);

create index catalog_products_projection_category_idx
on public.catalog_products_projection (
  category_id,
  is_limited desc,
  name,
  code
);

create index catalog_products_projection_category_slug_idx
on public.catalog_products_projection (category_slug, name, code);

create index catalog_products_projection_subcategory_slug_idx
on public.catalog_products_projection (subcategory_slug, name, code);

create index catalog_products_projection_brand_slug_idx
on public.catalog_products_projection (brand_slug, name, code);

create index catalog_products_projection_offer_idx
on public.catalog_products_projection (gross_amount_minor, code)
where offer_id is not null;

create index catalog_products_projection_limited_idx
on public.catalog_products_projection (gross_amount_minor desc, code)
where is_limited;

create index catalog_products_projection_new_idx
on public.catalog_products_projection (updated_at desc, code)
where is_new;

create view public.catalog_products_view
with (security_invoker = false, security_barrier = true)
as
select *
from public.catalog_products_projection;

comment on materialized view public.catalog_products_projection is
  'Server-side catalog read model. Refreshed by the local catalog import after its transaction commits.';

comment on view public.catalog_products_view is
  'Public catalog contract backed by the private indexed projection. Only active, non-deleted rows enter the projection through catalog_products_source_view.';

grant select on public.catalog_products_view to anon, authenticated;
