-- La Botola e Mietto
-- Admin cancellation resolution + refund audit data.
--
-- Obiettivi:
-- - mantenere traccia del rimborso;
-- - approvare/rifiutare una richiesta in modo atomico;
-- - rilasciare lo stock prenotato solo quando l'annullamento
--   diventa definitivo;
-- - impedire di annullare ordini già spediti/consegnati;
-- - impedire di chiudere un ordine pagato senza una
--   registrazione del rimborso.

alter table public.orders
  add column if not exists refund_provider text,
  add column if not exists refund_reference text,
  add column if not exists refund_amount_minor bigint,
  add column if not exists refunded_at timestamptz,
  add column if not exists cancellation_resolution_note text;

alter table public.orders
  drop constraint if exists orders_refund_amount_minor_nonnegative;

alter table public.orders
  add constraint orders_refund_amount_minor_nonnegative
  check (
    refund_amount_minor is null
    or refund_amount_minor >= 0
  );

comment on column public.orders.refund_provider is
  'Provider o modalità con cui è stato eseguito il rimborso.';

comment on column public.orders.refund_reference is
  'Riferimento univoco del rimborso, ad esempio Stripe Refund ID.';

comment on column public.orders.refund_amount_minor is
  'Importo rimborsato espresso in unità minori della valuta ordine.';

comment on column public.orders.refunded_at is
  'Data e ora in cui il rimborso è stato registrato come completato.';

comment on column public.orders.cancellation_resolution_note is
  'Nota amministrativa relativa all approvazione o al rifiuto della richiesta.';


create or replace function public.resolve_admin_order_cancellation(
  p_order_id uuid,
  p_action text,
  p_refund_provider text default null,
  p_refund_reference text default null,
  p_refund_amount_minor bigint default null,
  p_resolution_note text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
begin
  if p_action not in ('approve', 'reject') then
    raise exception using
      errcode = 'P0001',
      message = 'Azione di annullamento non valida.';
  end if;

  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if v_order.id is null then
    raise exception using
      errcode = 'P0001',
      message = 'Ordine non disponibile.';
  end if;

  /*
   * Idempotenza applicativa:
   * se la richiesta è già stata risolta nello stesso modo,
   * restituiamo semplicemente l'esito.
   */
  if p_action = 'approve'
     and v_order.cancellation_request_status = 'approved'
     and v_order.status = 'cancelled'
  then
    return 'approved';
  end if;

  if p_action = 'reject'
     and v_order.cancellation_request_status = 'rejected'
  then
    return 'rejected';
  end if;

  if v_order.cancellation_request_status <> 'pending' then
    raise exception using
      errcode = 'P0001',
      message = 'Non esiste una richiesta di annullamento pendente.';
  end if;

  /*
   * RIFIUTO
   *
   * L'ordine continua normalmente.
   * Non viene modificato pagamento, stock o stato ordine.
   */
  if p_action = 'reject' then
    update public.orders
    set
      cancellation_request_status = 'rejected',
      cancellation_request_resolved_at = now(),
      cancellation_resolution_note =
        nullif(btrim(p_resolution_note), ''),
      updated_at = now()
    where id = p_order_id;

    return 'rejected';
  end if;

  /*
   * APPROVAZIONE
   */

  if v_order.status in ('shipped', 'delivered') then
    raise exception using
      errcode = 'P0001',
      message = 'Un ordine già spedito o consegnato non può essere annullato.';
  end if;

  if v_order.status not in ('received', 'preparing') then
    raise exception using
      errcode = 'P0001',
      message = 'Lo stato attuale dell ordine non consente l annullamento.';
  end if;

  /*
   * La richiesta admin nasce da un ordine pagato/autorizzato.
   * Non permettiamo che venga dichiarato annullato/rimborsato
   * senza un riferimento della relativa operazione finanziaria.
   *
   * Se l'ordine risultasse già refunded, il riferimento può
   * essere quello già salvato.
   */
  if v_order.payment_status in ('paid', 'authorized')
     and nullif(btrim(p_refund_reference), '') is null
  then
    raise exception using
      errcode = 'P0001',
      message = 'Il rimborso deve essere registrato prima di completare l annullamento.';
  end if;

  if p_refund_amount_minor is not null
     and p_refund_amount_minor < 0
  then
    raise exception using
      errcode = 'P0001',
      message = 'Importo di rimborso non valido.';
  end if;

  /*
   * Rilascia la prenotazione stock una sola volta.
   */
  if v_order.reservation_released_at is null then
    update public.inventory as inventory
    set
      reserved_quantity = greatest(
        inventory.reserved_quantity - quantities.quantity,
        0
      ),
      updated_at = now()
    from (
      select
        order_item.product_id,
        sum(order_item.quantity)::integer as quantity
      from public.order_items as order_item
      where order_item.order_id = p_order_id
        and order_item.product_id is not null
      group by order_item.product_id
    ) as quantities
    where inventory.product_id = quantities.product_id;
  end if;

  /*
   * Finalizzazione atomica.
   *
   * Il trigger della migration 0021 provvederà anche a
   * liberare source_cart_id quando lo status diventa cancelled.
   */
  update public.orders
  set
    status = 'cancelled',
    payment_status = 'refunded',
    cancelled_at = coalesce(cancelled_at, now()),
    reservation_released_at =
      coalesce(reservation_released_at, now()),
    cancellation_request_status = 'approved',
    cancellation_request_resolved_at = now(),
    cancellation_resolution_note =
      nullif(btrim(p_resolution_note), ''),
    refund_provider =
      coalesce(
        nullif(btrim(p_refund_provider), ''),
        refund_provider
      ),
    refund_reference =
      coalesce(
        nullif(btrim(p_refund_reference), ''),
        refund_reference
      ),
    refund_amount_minor =
      coalesce(
        p_refund_amount_minor,
        refund_amount_minor
      ),
    refunded_at =
      coalesce(
        refunded_at,
        now()
      ),
    updated_at = now()
  where id = p_order_id;

  return 'approved';
end;
$$;


revoke all
on function public.resolve_admin_order_cancellation(
  uuid,
  text,
  text,
  text,
  bigint,
  text
)
from public, anon, authenticated;

grant execute
on function public.resolve_admin_order_cancellation(
  uuid,
  text,
  text,
  text,
  bigint,
  text
)
to service_role;
