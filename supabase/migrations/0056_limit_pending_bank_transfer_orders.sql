-- Impedisce a un singolo account di accumulare più ordini
-- con bonifico ancora non pagati e con stock riservato.
--
-- La protezione ha due livelli:
--
-- 1. advisory transaction lock per serializzare i tentativi
--    concorrenti dello stesso profilo e restituire un errore
--    applicativo comprensibile;
--
-- 2. unique partial index come garanzia finale a livello DB.
--
-- Un ordine non blocca più nuovi bonifici quando:
-- - viene pagato;
-- - viene annullato;
-- - il pagamento fallisce;
-- - la prenotazione stock è già stata rilasciata.

create or replace function public.enforce_single_pending_bank_transfer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.payment_method = 'bank_transfer'
     and new.payment_status = 'pending'
     and new.status <> 'cancelled'
     and new.reservation_released_at is null
  then
    /*
     * Serializza esclusivamente i tentativi dello stesso account.
     *
     * In questo modo due richieste concorrenti non possono entrambe
     * superare il controllo prima che una delle due inserisca l'ordine.
     */
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(
        new.profile_id::text,
        4910
      )
    );

    if exists (
      select 1
      from public.orders as existing_order
      where existing_order.profile_id = new.profile_id
        and existing_order.id is distinct from new.id
        and existing_order.payment_method = 'bank_transfer'
        and existing_order.payment_status = 'pending'
        and existing_order.status <> 'cancelled'
        and existing_order.reservation_released_at is null
    ) then
      raise exception using
        errcode = 'P0001',
        message =
          'Hai già un ordine con bonifico in attesa di pagamento. Completa o annulla l’ordine prima di crearne un altro.';
    end if;
  end if;

  return new;
end;
$$;

revoke all
on function public.enforce_single_pending_bank_transfer()
from public, anon, authenticated;

drop trigger if exists orders_single_pending_bank_transfer
on public.orders;

create trigger orders_single_pending_bank_transfer
before insert or update of
  profile_id,
  payment_method,
  payment_status,
  status,
  reservation_released_at
on public.orders
for each row
execute function public.enforce_single_pending_bank_transfer();

create unique index if not exists
  orders_one_pending_bank_transfer_per_profile_uidx
on public.orders(profile_id)
where payment_method = 'bank_transfer'
  and payment_status = 'pending'
  and status <> 'cancelled'
  and reservation_released_at is null;
