create type public.shipping_method as enum (
  'store_pickup',
  'tnt'
);

create type public.payment_method as enum (
  'stripe',
  'bank_transfer',
  'satispay'
);

alter table public.orders
add column shipping_method public.shipping_method
not null default 'tnt';

alter table public.orders
add column payment_method public.payment_method
not null default 'bank_transfer';

create sequence public.order_number_sequence
start with 1
increment by 1
minvalue 1;

create or replace function public.checkout_account_cart(
  p_shipping_address_id uuid,
  p_billing_address_id uuid,
  p_shipping_method public.shipping_method,
  p_payment_method public.payment_method
)
returns table (
  order_id uuid,
  order_number text,
  order_status public.order_status,
  payment_status public.payment_status,
  shipping_method public.shipping_method,
  payment_method public.payment_method,
  subtotal_net_amount_minor bigint,
  vat_amount_minor bigint,
  shipping_gross_amount_minor bigint,
  total_gross_amount_minor bigint,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_id uuid;
  v_cart_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_shipping_address jsonb;
  v_billing_address jsonb;
  v_cart_item_count integer;
  v_valid_item_count integer;
  v_subtotal_net_amount_minor bigint;
  v_vat_amount_minor bigint;
  v_subtotal_gross_amount_minor bigint;
  v_shipping_gross_amount_minor bigint;
  v_total_gross_amount_minor bigint;
  v_created_at timestamptz;
begin
  v_profile_id := auth.uid();

  if v_profile_id is null then
    raise exception using
      errcode = '42501',
      message = 'Accesso richiesto.';
  end if;

  if p_shipping_method is null then
    raise exception using
      errcode = '22023',
      message = 'Metodo di spedizione non valido.';
  end if;

  if p_payment_method is null then
    raise exception using
      errcode = '22023',
      message = 'Metodo di pagamento non valido.';
  end if;

  select
    jsonb_build_object(
      'id', address.id,
      'type', address.type,
      'recipientName', address.recipient_name,
      'line1', address.line1,
      'line2', address.line2,
      'postalCode', address.postal_code,
      'city', address.city,
      'province', address.province,
      'countryCode', address.country_code
    )
  into v_billing_address
  from public.addresses as address
  where address.id = p_billing_address_id
    and address.profile_id = v_profile_id
    and address.type = 'billing'
    and address.deleted_at is null;

  if v_billing_address is null then
    raise exception using
      errcode = 'P0001',
      message = 'Indirizzo di fatturazione non valido.';
  end if;

  if p_shipping_method = 'tnt' then
    select
      jsonb_build_object(
        'id', address.id,
        'type', address.type,
        'recipientName', address.recipient_name,
        'line1', address.line1,
        'line2', address.line2,
        'postalCode', address.postal_code,
        'city', address.city,
        'province', address.province,
        'countryCode', address.country_code
      )
    into v_shipping_address
    from public.addresses as address
    where address.id = p_shipping_address_id
      and address.profile_id = v_profile_id
      and address.type = 'shipping'
      and address.deleted_at is null;

    if v_shipping_address is null then
      raise exception using
        errcode = 'P0001',
        message = 'Indirizzo di spedizione non valido.';
    end if;
  else
    v_shipping_address := jsonb_build_object(
      'id', null,
      'type', 'shipping',
      'recipientName', 'La Botola e Mietto',
      'line1', 'Via Stradona 27',
      'line2', 'Ritiro in negozio',
      'postalCode', '35010',
      'city', 'Campo San Martino',
      'province', 'PD',
      'countryCode', 'IT',
      'storePickup', true
    );
  end if;

  select cart.id
  into v_cart_id
  from public.carts as cart
  where cart.profile_id = v_profile_id
    and cart.status = 'active'
  for update;

  if v_cart_id is null then
    raise exception using
      errcode = 'P0001',
      message = 'Carrello vuoto.';
  end if;

  select count(*)::integer
  into v_cart_item_count
  from public.cart_items
  where cart_id = v_cart_id;

  if v_cart_item_count = 0 then
    raise exception using
      errcode = 'P0001',
      message = 'Carrello vuoto.';
  end if;

  perform inventory.product_id
  from public.inventory as inventory
  inner join public.cart_items as cart_item
    on cart_item.product_id = inventory.product_id
  where cart_item.cart_id = v_cart_id
  for update of inventory;

  with valid_lines as (
    select
      cart_item.product_id,
      cart_item.quantity,
      coalesce(
        active_offer.promotional_net_amount_minor,
        current_price.net_amount_minor
      )::bigint as unit_net_amount_minor,
      current_price.vat_rate_basis_points,
      (
        coalesce(
          active_offer.promotional_net_amount_minor,
          current_price.net_amount_minor
        ) +
        (
          coalesce(
            active_offer.promotional_net_amount_minor,
            current_price.net_amount_minor
          ) * current_price.vat_rate_basis_points + 5000
        ) / 10000
      )::bigint as unit_gross_amount_minor
    from public.cart_items as cart_item
    inner join public.products as product
      on product.id = cart_item.product_id
     and product.status = 'active'
     and product.deleted_at is null
    inner join public.inventory as inventory
      on inventory.product_id = product.id
     and inventory.available_quantity >= cart_item.quantity
    inner join lateral (
      select
        price.net_amount_minor,
        price.vat_rate_basis_points
      from public.prices as price
      where price.product_id = product.id
        and price.currency = 'EUR'
        and price.valid_from <= now()
        and (
          price.valid_to is null
          or price.valid_to > now()
        )
      order by price.valid_from desc
      limit 1
    ) as current_price on true
    left join lateral (
      select offer.promotional_net_amount_minor
      from public.offers as offer
      where offer.product_id = product.id
        and offer.is_active
        and offer.promotional_net_amount_minor is not null
        and (
          offer.starts_at is null
          or offer.starts_at <= now()
        )
        and (
          offer.ends_at is null
          or offer.ends_at > now()
        )
      order by
        offer.starts_at desc nulls last,
        offer.created_at desc
      limit 1
    ) as active_offer on true
    where cart_item.cart_id = v_cart_id
  )
  select
    count(*)::integer,
    coalesce(
      sum(unit_net_amount_minor * quantity),
      0
    )::bigint,
    coalesce(
      sum(
        (
          unit_gross_amount_minor -
          unit_net_amount_minor
        ) * quantity
      ),
      0
    )::bigint,
    coalesce(
      sum(unit_gross_amount_minor * quantity),
      0
    )::bigint
  into
    v_valid_item_count,
    v_subtotal_net_amount_minor,
    v_vat_amount_minor,
    v_subtotal_gross_amount_minor
  from valid_lines;

  if v_valid_item_count <> v_cart_item_count then
    raise exception using
      errcode = 'P0001',
      message = 'Uno o più prodotti non sono più disponibili nella quantità richiesta.';
  end if;

  if p_shipping_method = 'store_pickup' then
    v_shipping_gross_amount_minor := 0;
  elsif v_subtotal_gross_amount_minor >= 6000 then
    v_shipping_gross_amount_minor := 0;
  else
    v_shipping_gross_amount_minor := 750;
  end if;

  v_total_gross_amount_minor :=
    v_subtotal_gross_amount_minor +
    v_shipping_gross_amount_minor;

  v_order_id := gen_random_uuid();

  v_order_number :=
    'LBM-' ||
    to_char(clock_timestamp(), 'YYYYMMDD') ||
    '-' ||
    lpad(
      nextval('public.order_number_sequence')::text,
      6,
      '0'
    );

  insert into public.orders (
    id,
    order_number,
    profile_id,
    status,
    payment_status,
    currency,
    subtotal_net_amount_minor,
    vat_amount_minor,
    shipping_gross_amount_minor,
    total_gross_amount_minor,
    shipping_address,
    billing_address,
    shipping_method,
    payment_method
  )
  values (
    v_order_id,
    v_order_number,
    v_profile_id,
    'received',
    'pending',
    'EUR',
    v_subtotal_net_amount_minor,
    v_vat_amount_minor,
    v_shipping_gross_amount_minor,
    v_total_gross_amount_minor,
    v_shipping_address,
    v_billing_address,
    p_shipping_method,
    p_payment_method
  )
  returning public.orders.created_at
  into v_created_at;

  insert into public.order_items (
    order_id,
    product_id,
    product_code,
    product_name,
    quantity,
    unit_net_amount_minor,
    vat_rate_basis_points,
    unit_gross_amount_minor,
    line_gross_amount_minor
  )
  select
    v_order_id,
    product.id,
    product.code,
    product.name,
    cart_item.quantity,
    coalesce(
      active_offer.promotional_net_amount_minor,
      current_price.net_amount_minor
    )::bigint,
    current_price.vat_rate_basis_points,
    (
      coalesce(
        active_offer.promotional_net_amount_minor,
        current_price.net_amount_minor
      ) +
      (
        coalesce(
          active_offer.promotional_net_amount_minor,
          current_price.net_amount_minor
        ) * current_price.vat_rate_basis_points + 5000
      ) / 10000
    )::bigint,
    (
      (
        coalesce(
          active_offer.promotional_net_amount_minor,
          current_price.net_amount_minor
        ) +
        (
          coalesce(
            active_offer.promotional_net_amount_minor,
            current_price.net_amount_minor
          ) * current_price.vat_rate_basis_points + 5000
        ) / 10000
      ) * cart_item.quantity
    )::bigint
  from public.cart_items as cart_item
  inner join public.products as product
    on product.id = cart_item.product_id
  inner join lateral (
    select
      price.net_amount_minor,
      price.vat_rate_basis_points
    from public.prices as price
    where price.product_id = product.id
      and price.currency = 'EUR'
      and price.valid_from <= now()
      and (
        price.valid_to is null
        or price.valid_to > now()
      )
    order by price.valid_from desc
    limit 1
  ) as current_price on true
  left join lateral (
    select offer.promotional_net_amount_minor
    from public.offers as offer
    where offer.product_id = product.id
      and offer.is_active
      and offer.promotional_net_amount_minor is not null
      and (
        offer.starts_at is null
        or offer.starts_at <= now()
      )
      and (
        offer.ends_at is null
        or offer.ends_at > now()
      )
    order by
      offer.starts_at desc nulls last,
      offer.created_at desc
    limit 1
  ) as active_offer on true
  where cart_item.cart_id = v_cart_id;

  update public.inventory as inventory
  set
    reserved_quantity =
      inventory.reserved_quantity + cart_item.quantity,
    updated_at = now()
  from public.cart_items as cart_item
  where cart_item.cart_id = v_cart_id
    and inventory.product_id = cart_item.product_id;

  delete from public.cart_items
  where cart_id = v_cart_id;

  update public.carts
  set
    status = 'converted',
    updated_at = now()
  where id = v_cart_id;

  return query
  select
    created_order.id,
    created_order.order_number,
    created_order.status,
    created_order.payment_status,
    created_order.shipping_method,
    created_order.payment_method,
    created_order.subtotal_net_amount_minor,
    created_order.vat_amount_minor,
    created_order.shipping_gross_amount_minor,
    created_order.total_gross_amount_minor,
    created_order.created_at
  from public.orders as created_order
  where created_order.id = v_order_id;
end;
$$;

revoke all on function public.checkout_account_cart(
  uuid,
  uuid,
  public.shipping_method,
  public.payment_method
) from public;

grant usage on type public.shipping_method
to authenticated;

grant usage on type public.payment_method
to authenticated;

grant execute on function public.checkout_account_cart(
  uuid,
  uuid,
  public.shipping_method,
  public.payment_method
) to authenticated;
