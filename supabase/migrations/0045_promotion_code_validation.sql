-- Validazione server-side dei codici promozionali.
--
-- Questa funzione NON modifica ordini e NON registra utilizzi.
-- Serve esclusivamente a validare un codice e calcolare lo sconto lordo
-- applicabile a un determinato subtotale.
--
-- Il checkout effettivo dovrà comunque ripetere la validazione nella stessa
-- transazione in cui crea l'ordine, così da evitare race condition.

create or replace function public.validate_promotion_code(
  p_code text,
  p_subtotal_gross_amount_minor bigint,
  p_currency text default 'EUR'
)
returns table (
  promotion_code_id uuid,
  promotion_code text,
  discount_type text,
  discount_value bigint,
  discount_gross_amount_minor bigint,
  minimum_order_gross_amount_minor bigint,
  usage_limit integer,
  usage_count bigint
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_normalized_code text;
  v_promotion public.promotion_codes%rowtype;
  v_usage_count bigint;
  v_discount_gross_amount_minor bigint;
begin
  v_normalized_code := upper(btrim(coalesce(p_code, '')));

  if v_normalized_code = '' then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale non valido.';
  end if;

  if v_normalized_code !~ '^[A-Z0-9_-]{3,32}$' then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale non valido.';
  end if;

  if p_subtotal_gross_amount_minor is null
    or p_subtotal_gross_amount_minor <= 0 then
    raise exception using
      errcode = '22023',
      message = 'Subtotale ordine non valido.';
  end if;

  if p_currency is null
    or upper(btrim(p_currency)) <> 'EUR' then
    raise exception using
      errcode = '22023',
      message = 'Valuta non supportata.';
  end if;

  select promotion.*
  into v_promotion
  from public.promotion_codes as promotion
  where promotion.code = v_normalized_code
  limit 1;

  if v_promotion.id is null then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale non valido.';
  end if;

  if not v_promotion.is_active then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale non attivo.';
  end if;

  if v_promotion.starts_at is not null
    and v_promotion.starts_at > now() then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale non ancora valido.';
  end if;

  if v_promotion.ends_at is not null
    and v_promotion.ends_at <= now() then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale scaduto.';
  end if;

  if upper(v_promotion.currency) <> upper(btrim(p_currency)) then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale non valido per questa valuta.';
  end if;

  if p_subtotal_gross_amount_minor <
    v_promotion.minimum_order_gross_amount_minor then
    raise exception using
      errcode = 'P0001',
      message = 'Importo minimo ordine non raggiunto per questo codice promozionale.';
  end if;

  select count(*)::bigint
  into v_usage_count
  from public.orders as existing_order
  where existing_order.promotion_code_id = v_promotion.id
    and existing_order.status <> 'cancelled'
    and existing_order.payment_status in (
      'pending',
      'authorized',
      'paid'
    );

  if v_promotion.usage_limit is not null
    and v_usage_count >= v_promotion.usage_limit then
    raise exception using
      errcode = 'P0001',
      message = 'Codice promozionale non più disponibile.';
  end if;

  if v_promotion.discount_type = 'percentage' then
    v_discount_gross_amount_minor :=
      round(
        p_subtotal_gross_amount_minor::numeric
        * v_promotion.discount_value::numeric
        / 100
      )::bigint;

  elsif v_promotion.discount_type = 'fixed' then
    v_discount_gross_amount_minor :=
      least(
        v_promotion.discount_value,
        p_subtotal_gross_amount_minor
      );

  else
    raise exception using
      errcode = 'P0001',
      message = 'Configurazione codice promozionale non valida.';
  end if;

  if v_discount_gross_amount_minor <= 0 then
    raise exception using
      errcode = 'P0001',
      message = 'Il codice promozionale non genera uno sconto valido.';
  end if;

  return query
  select
    v_promotion.id,
    v_promotion.code,
    v_promotion.discount_type,
    v_promotion.discount_value,
    v_discount_gross_amount_minor,
    v_promotion.minimum_order_gross_amount_minor,
    v_promotion.usage_limit,
    v_usage_count;
end;
$$;


revoke all on function public.validate_promotion_code(
  text,
  bigint,
  text
) from public;

revoke execute on function public.validate_promotion_code(
  text,
  bigint,
  text
) from anon, authenticated;

grant execute on function public.validate_promotion_code(
  text,
  bigint,
  text
) to service_role;
