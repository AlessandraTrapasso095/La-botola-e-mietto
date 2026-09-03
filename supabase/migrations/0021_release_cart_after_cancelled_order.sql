-- Un ordine annullato non deve continuare a bloccare il carrello
-- da cui era stato generato.
--
-- source_cart_id viene usato come vincolo tecnico per evitare la
-- creazione concorrente di più ordini sullo stesso carrello.
-- Quando l'ordine diventa definitivamente cancelled, il carrello
-- deve poter essere utilizzato per un nuovo tentativo di checkout.

create or replace function public.release_source_cart_from_cancelled_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'cancelled'
     and old.status is distinct from new.status
     and new.source_cart_id is not null
  then
    new.source_cart_id := null;
  end if;

  return new;
end;
$$;

drop trigger if exists release_source_cart_from_cancelled_order
on public.orders;

create trigger release_source_cart_from_cancelled_order
before update of status
on public.orders
for each row
execute function public.release_source_cart_from_cancelled_order();

-- Ripara eventuali ordini annullati creati prima di questa migration.
update public.orders
set source_cart_id = null
where status = 'cancelled'
  and source_cart_id is not null;

revoke all
on function public.release_source_cart_from_cancelled_order()
from public, anon, authenticated;
