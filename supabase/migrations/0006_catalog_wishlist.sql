alter view public.catalog_products_view set (
  security_invoker = false,
  security_barrier = true
);

comment on view public.catalog_products_view is
  'Catalog projection with an explicit active-product boundary. The fixed columns and predicates are the public contract; the security barrier prevents caller predicates from being evaluated before that boundary.';

create or replace view public.catalog_categories_view
with (security_invoker = true)
as
select
  category.id as category_id,
  category.slug,
  category.name,
  category.description,
  category.sort_order,
  coalesce(subcategories.names, '{}'::text[]) as subcategories,
  coalesce(product_totals.product_count, 0)::bigint as product_count,
  public.normalize_catalog_search(
    concat_ws(' ', category.name, subcategories.search_names)
  ) as search_text
from public.categories as category
left join lateral (
  select
    array_agg(subcategory.name order by subcategory.name) as names,
    string_agg(subcategory.name, ' ' order by subcategory.name) as search_names
  from public.categories as subcategory
  where subcategory.parent_id = category.id
    and subcategory.status = 'active'
    and subcategory.deleted_at is null
) as subcategories on true
left join lateral (
  select count(*)::bigint as product_count
  from public.products as product
  where product.category_id = category.id
    and product.status = 'active'
    and product.deleted_at is null
) as product_totals on true
where category.parent_id is null
  and category.status = 'active'
  and category.deleted_at is null;

create or replace function public.account_wishlist_slugs()
returns table (slug text)
language sql
stable
security invoker
set search_path = ''
as $$
  select product.slug
  from public.wishlists as wishlist
  join public.wishlist_items as wishlist_item
    on wishlist_item.wishlist_id = wishlist.id
  join public.products as product
    on product.id = wishlist_item.product_id
  where wishlist.profile_id = auth.uid()
    and product.status = 'active'
    and product.deleted_at is null
  order by wishlist_item.created_at, product.slug;
$$;

create or replace function public.merge_account_wishlist(product_slugs text[])
returns table (slug text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_wishlist_id uuid;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Accesso richiesto.';
  end if;

  insert into public.wishlists (profile_id)
  values (current_user_id)
  on conflict (profile_id) do update
    set updated_at = now()
  returning id into current_wishlist_id;

  insert into public.wishlist_items (wishlist_id, product_id)
  select current_wishlist_id, product.id
  from public.products as product
  where product.slug = any(coalesce(product_slugs, '{}'::text[]))
    and product.status = 'active'
    and product.deleted_at is null
  on conflict (wishlist_id, product_id) do nothing;

  return query select account_item.slug
  from public.account_wishlist_slugs() as account_item;
end;
$$;

create or replace function public.remove_account_wishlist_item(product_slug text)
returns table (slug text)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise insufficient_privilege using message = 'Accesso richiesto.';
  end if;

  delete from public.wishlist_items as wishlist_item
  using public.wishlists as wishlist, public.products as product
  where wishlist_item.wishlist_id = wishlist.id
    and wishlist_item.product_id = product.id
    and wishlist.profile_id = auth.uid()
    and product.slug = product_slug;

  return query select account_item.slug
  from public.account_wishlist_slugs() as account_item;
end;
$$;

revoke all on function public.account_wishlist_slugs() from public;
revoke all on function public.merge_account_wishlist(text[]) from public;
revoke all on function public.remove_account_wishlist_item(text) from public;

grant execute on function public.account_wishlist_slugs() to authenticated;
grant execute on function public.merge_account_wishlist(text[]) to authenticated;
grant execute on function public.remove_account_wishlist_item(text) to authenticated;
