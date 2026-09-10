-- Satispay non è più disponibile per i nuovi checkout.
--
-- Questa migration ripara eventuali ordini Satispay legacy rimasti
-- pending e ancora collegati a un carrello active.
--
-- Senza questa correzione checkout_account_cart restituisce il vecchio
-- ordine invece di creare un nuovo ordine Stripe / bonifico.

do $$
declare
  stale_order record;
begin
  for stale_order in
    select
      o.id,
      o.source_cart_id
    from public.orders as o
    inner join public.carts as c
      on c.id = o.source_cart_id
    where o.payment_method = 'satispay'
      and o.payment_status = 'pending'
      and o.status = 'received'
      and o.source_cart_id is not null
      and c.status = 'active'
    for update of o
  loop

    -- Restituisce al magazzino le quantità che il vecchio ordine
    -- Satispay aveva solamente riservato.
    update public.inventory as inventory
    set
      reserved_quantity = greatest(
        0,
        inventory.reserved_quantity - reserved.quantity
      ),
      updated_at = now()
    from (
      select
        oi.product_id,
        sum(oi.quantity)::integer as quantity
      from public.order_items as oi
      where oi.order_id = stale_order.id
        and oi.product_id is not null
      group by oi.product_id
    ) as reserved
    where inventory.product_id = reserved.product_id;

    -- L'ordine legacy non deve più bloccare source_cart_id.
    --
    -- Il carrello rimane active con i suoi articoli: il cliente può
    -- quindi effettuare un nuovo checkout usando un metodo supportato.
    update public.orders
    set
      status = 'cancelled',
      payment_status = 'failed',
      source_cart_id = null,
      hidden_from_customer_at =
        coalesce(hidden_from_customer_at, now()),
      updated_at = now()
    where id = stale_order.id;

  end loop;
end;
$$;
