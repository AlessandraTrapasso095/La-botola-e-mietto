create or replace function public.ensure_account_cart()
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_cart_id uuid;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Accesso richiesto.';
  end if;

  insert into public.carts (
    profile_id,
    status,
    currency
  )
  values (
    current_user_id,
    'active',
    'EUR'
  )
  on conflict (profile_id)
    where profile_id is not null and status = 'active'
  do update
    set updated_at = now()
  returning id into current_cart_id;

  return current_cart_id;
end;
$$;

create or replace function public.account_cart_lines()
returns table (
  slug text,
  quantity integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    product.slug,
    least(
      cart_item.quantity,
      greatest(
        inventory.stock_quantity - inventory.reserved_quantity,
        0
      ),
      99
    )::integer as quantity
  from public.carts as cart
  join public.cart_items as cart_item
    on cart_item.cart_id = cart.id
  join public.products as product
    on product.id = cart_item.product_id
  join public.inventory as inventory
    on inventory.product_id = product.id
  where cart.profile_id = auth.uid()
    and cart.status = 'active'
    and product.status = 'active'
    and product.deleted_at is null
    and inventory.stock_quantity - inventory.reserved_quantity > 0
  order by cart_item.created_at, product.slug;
$$;

create or replace function public.add_account_cart_item(
  product_slug text,
  requested_quantity integer default 1
)
returns table (
  slug text,
  quantity integer
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_cart_id uuid;
  current_product_id uuid;
  available_quantity integer;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Accesso richiesto.';
  end if;

  if requested_quantity is null
    or requested_quantity < 1
    or requested_quantity > 99
  then
    raise exception using
      errcode = '22023',
      message = 'Quantità non valida.';
  end if;

  select
    product.id,
    greatest(
      inventory.stock_quantity - inventory.reserved_quantity,
      0
    )::integer
  into
    current_product_id,
    available_quantity
  from public.products as product
  join public.inventory as inventory
    on inventory.product_id = product.id
  where product.slug = product_slug
    and product.status = 'active'
    and product.deleted_at is null
  limit 1;

  if current_product_id is null or available_quantity < 1 then
    raise exception using
      errcode = 'P0001',
      message = 'Prodotto non disponibile.';
  end if;

  current_cart_id := public.ensure_account_cart();

  insert into public.cart_items (
    cart_id,
    product_id,
    quantity
  )
  values (
    current_cart_id,
    current_product_id,
    least(requested_quantity, available_quantity, 99)
  )
  on conflict (cart_id, product_id)
  do update
    set
      quantity = least(
        public.cart_items.quantity + excluded.quantity,
        available_quantity,
        99
      ),
      updated_at = now();

  return query
  select account_line.slug, account_line.quantity
  from public.account_cart_lines() as account_line;
end;
$$;

create or replace function public.set_account_cart_item_quantity(
  product_slug text,
  requested_quantity integer
)
returns table (
  slug text,
  quantity integer
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_cart_id uuid;
  current_product_id uuid;
  available_quantity integer;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Accesso richiesto.';
  end if;

  if requested_quantity is null or requested_quantity > 99 then
    raise exception using
      errcode = '22023',
      message = 'Quantità non valida.';
  end if;

  if requested_quantity < 1 then
    delete from public.cart_items as cart_item
    using public.carts as cart, public.products as product
    where cart_item.cart_id = cart.id
      and cart_item.product_id = product.id
      and cart.profile_id = current_user_id
      and cart.status = 'active'
      and product.slug = product_slug;

    return query
    select account_line.slug, account_line.quantity
    from public.account_cart_lines() as account_line;

    return;
  end if;

  select
    product.id,
    greatest(
      inventory.stock_quantity - inventory.reserved_quantity,
      0
    )::integer
  into
    current_product_id,
    available_quantity
  from public.products as product
  join public.inventory as inventory
    on inventory.product_id = product.id
  where product.slug = product_slug
    and product.status = 'active'
    and product.deleted_at is null
  limit 1;

  if current_product_id is null or available_quantity < 1 then
    raise exception using
      errcode = 'P0001',
      message = 'Prodotto non disponibile.';
  end if;

  current_cart_id := public.ensure_account_cart();

  insert into public.cart_items (
    cart_id,
    product_id,
    quantity
  )
  values (
    current_cart_id,
    current_product_id,
    least(requested_quantity, available_quantity, 99)
  )
  on conflict (cart_id, product_id)
  do update
    set
      quantity = least(
        excluded.quantity,
        available_quantity,
        99
      ),
      updated_at = now();

  return query
  select account_line.slug, account_line.quantity
  from public.account_cart_lines() as account_line;
end;
$$;

create or replace function public.remove_account_cart_item(
  product_slug text
)
returns table (
  slug text,
  quantity integer
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise insufficient_privilege using message = 'Accesso richiesto.';
  end if;

  delete from public.cart_items as cart_item
  using public.carts as cart, public.products as product
  where cart_item.cart_id = cart.id
    and cart_item.product_id = product.id
    and cart.profile_id = auth.uid()
    and cart.status = 'active'
    and product.slug = product_slug;

  return query
  select account_line.slug, account_line.quantity
  from public.account_cart_lines() as account_line;
end;
$$;

create or replace function public.merge_account_cart_items(
  local_items jsonb
)
returns table (
  slug text,
  quantity integer
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_cart_id uuid;
begin
  if current_user_id is null then
    raise insufficient_privilege using message = 'Accesso richiesto.';
  end if;

  if local_items is null then
    local_items := '[]'::jsonb;
  end if;

  if jsonb_typeof(local_items) <> 'array' then
    raise exception using
      errcode = '22023',
      message = 'Carrello non valido.';
  end if;

  current_cart_id := public.ensure_account_cart();

  delete from public.cart_items as cart_item
  where cart_item.cart_id = current_cart_id
    and not exists (
      select 1
      from public.products as product
      join public.inventory as inventory
        on inventory.product_id = product.id
      where product.id = cart_item.product_id
        and product.status = 'active'
        and product.deleted_at is null
        and inventory.stock_quantity - inventory.reserved_quantity > 0
    );

  update public.cart_items as cart_item
  set
    quantity = least(
      cart_item.quantity,
      greatest(
        inventory.stock_quantity - inventory.reserved_quantity,
        0
      ),
      99
    ),
    updated_at = now()
  from public.inventory as inventory
  where cart_item.cart_id = current_cart_id
    and inventory.product_id = cart_item.product_id
    and cart_item.quantity <> least(
      cart_item.quantity,
      greatest(
        inventory.stock_quantity - inventory.reserved_quantity,
        0
      ),
      99
    );

  insert into public.cart_items (
    cart_id,
    product_id,
    quantity
  )
  select
    current_cart_id,
    product.id,
    least(
      greatest(max(input_item.quantity), 1),
      greatest(
        inventory.stock_quantity - inventory.reserved_quantity,
        0
      ),
      99
    )::integer
  from jsonb_to_recordset(local_items)
    as input_item(slug text, quantity integer)
  join public.products as product
    on product.slug = input_item.slug
  join public.inventory as inventory
    on inventory.product_id = product.id
  where input_item.quantity between 1 and 99
    and product.status = 'active'
    and product.deleted_at is null
    and inventory.stock_quantity - inventory.reserved_quantity > 0
  group by
    product.id,
    inventory.stock_quantity,
    inventory.reserved_quantity
  on conflict (cart_id, product_id)
  do update
    set
      quantity = least(
        greatest(
          public.cart_items.quantity,
          excluded.quantity
        ),
        (
          select greatest(
            current_inventory.stock_quantity
              - current_inventory.reserved_quantity,
            0
          )
          from public.inventory as current_inventory
          where current_inventory.product_id =
            public.cart_items.product_id
        ),
        99
      ),
      updated_at = now();

  return query
  select account_line.slug, account_line.quantity
  from public.account_cart_lines() as account_line;
end;
$$;

revoke all on function public.ensure_account_cart() from public;
revoke all on function public.account_cart_lines() from public;
revoke all on function public.add_account_cart_item(text, integer) from public;
revoke all on function public.set_account_cart_item_quantity(text, integer)
  from public;
revoke all on function public.remove_account_cart_item(text) from public;
revoke all on function public.merge_account_cart_items(jsonb) from public;

grant execute on function public.account_cart_lines()
  to authenticated;
grant execute on function public.add_account_cart_item(text, integer)
  to authenticated;
grant execute on function public.set_account_cart_item_quantity(text, integer)
  to authenticated;
grant execute on function public.remove_account_cart_item(text)
  to authenticated;
grant execute on function public.merge_account_cart_items(jsonb)
  to authenticated;
