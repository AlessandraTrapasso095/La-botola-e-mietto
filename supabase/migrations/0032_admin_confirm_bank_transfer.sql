alter table public.orders
  add column if not exists paid_at timestamptz;

comment on column public.orders.paid_at is
  'Data e ora in cui il pagamento dell''ordine è stato confermato come ricevuto.';

create or replace function public.confirm_admin_bank_transfer(
  p_order_id uuid
)
returns table (
  order_id uuid,
  order_number text,
  order_status public.order_status,
  payment_status public.payment_status,
  paid_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'Ordine non trovato.';
  end if;

  if v_order.payment_method <> 'bank_transfer' then
    raise exception using
      errcode = 'P0001',
      message = 'Questo ordine non utilizza il bonifico bancario.';
  end if;

  if v_order.status = 'cancelled' then
    raise exception using
      errcode = 'P0001',
      message = 'Non è possibile confermare il pagamento di un ordine annullato.';
  end if;

  if v_order.payment_status = 'paid' then
    return query
    select
      v_order.id,
      v_order.order_number,
      v_order.status,
      v_order.payment_status,
      v_order.paid_at;

    return;
  end if;

  if v_order.payment_status <> 'pending' then
    raise exception using
      errcode = 'P0001',
      message = 'Lo stato del pagamento non consente la conferma del bonifico.';
  end if;

  update public.orders
  set
    payment_status = 'paid',
    paid_at = now(),
    updated_at = now()
  where id = p_order_id
  returning *
  into v_order;

  return query
  select
    v_order.id,
    v_order.order_number,
    v_order.status,
    v_order.payment_status,
    v_order.paid_at;
end;
$$;

revoke all on function public.confirm_admin_bank_transfer(uuid) from public;
revoke all on function public.confirm_admin_bank_transfer(uuid) from anon;
revoke all on function public.confirm_admin_bank_transfer(uuid) from authenticated;

grant execute
on function public.confirm_admin_bank_transfer(uuid)
to service_role;
