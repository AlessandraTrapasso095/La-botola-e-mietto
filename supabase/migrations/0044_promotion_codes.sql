-- Promotion codes foundation.
--
-- I codici promozionali vengono validati e applicati dal checkout server-side.
-- Il client non accede direttamente alla tabella.
--
-- Tipologie supportate:
--   percentage -> discount_value rappresenta una percentuale intera
--                 compresa tra 1 e 90.
--   fixed      -> discount_value rappresenta un importo lordo in centesimi.
--
-- Gli ordini conservano uno snapshot del codice e dello sconto realmente
-- applicato, in modo che storico, email, rimborsi e contabilità non dipendano
-- da successive modifiche del codice promozionale.

create table public.promotion_codes (
  id uuid primary key default gen_random_uuid(),

  code text not null,

  description text,

  discount_type text not null
    check (
      discount_type in ('percentage', 'fixed')
    ),

  discount_value bigint not null
    check (
      (
        discount_type = 'percentage'
        and discount_value between 1 and 90
      )
      or
      (
        discount_type = 'fixed'
        and discount_value > 0
      )
    ),

  currency text not null default 'EUR'
    check (
      char_length(currency) = 3
      and currency = upper(currency)
    ),

  minimum_order_gross_amount_minor bigint not null default 0
    check (minimum_order_gross_amount_minor >= 0),

  starts_at timestamptz,
  ends_at timestamptz,

  usage_limit integer
    check (
      usage_limit is null
      or usage_limit > 0
    ),

  is_active boolean not null default true,

  stripe_coupon_id text,
  stripe_promotion_code_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint promotion_codes_code_format_check
    check (
      code = upper(btrim(code))
      and code ~ '^[A-Z0-9_-]{3,32}$'
    ),

  constraint promotion_codes_date_range_check
    check (
      ends_at is null
      or starts_at is null
      or ends_at > starts_at
    )
);

create unique index promotion_codes_code_unique_idx
  on public.promotion_codes (code);

create unique index promotion_codes_stripe_coupon_unique_idx
  on public.promotion_codes (stripe_coupon_id)
  where stripe_coupon_id is not null;

create unique index promotion_codes_stripe_promotion_code_unique_idx
  on public.promotion_codes (stripe_promotion_code_id)
  where stripe_promotion_code_id is not null;

create index promotion_codes_active_window_idx
  on public.promotion_codes (
    is_active,
    starts_at,
    ends_at
  );

alter table public.promotion_codes
  enable row level security;

revoke all
  on table public.promotion_codes
  from anon, authenticated;


-- Snapshot promozione applicata all'ordine.
--
-- promotion_code_id mantiene il collegamento logico al codice originale.
-- promotion_code conserva comunque il valore testuale usato dal cliente.
--
-- I tre importi permettono di mantenere distinta la riduzione:
--   imponibile
--   IVA
--   lordo
--
-- discount_gross_amount_minor deve sempre coincidere con
-- discount_net_amount_minor + discount_vat_amount_minor.

alter table public.orders
  add column promotion_code_id uuid
    references public.promotion_codes(id)
    on delete set null,

  add column promotion_code text,

  add column promotion_discount_type text
    check (
      promotion_discount_type is null
      or promotion_discount_type in ('percentage', 'fixed')
    ),

  add column promotion_discount_value bigint
    check (
      promotion_discount_value is null
      or promotion_discount_value > 0
    ),

  add column discount_net_amount_minor bigint not null default 0
    check (discount_net_amount_minor >= 0),

  add column discount_vat_amount_minor bigint not null default 0
    check (discount_vat_amount_minor >= 0),

  add column discount_gross_amount_minor bigint not null default 0
    check (discount_gross_amount_minor >= 0);


alter table public.orders
  add constraint orders_promotion_discount_amounts_check
  check (
    discount_gross_amount_minor =
      discount_net_amount_minor +
      discount_vat_amount_minor
  );


alter table public.orders
  add constraint orders_promotion_snapshot_check
  check (
    (
      promotion_code_id is null
      and promotion_code is null
      and promotion_discount_type is null
      and promotion_discount_value is null
      and discount_net_amount_minor = 0
      and discount_vat_amount_minor = 0
      and discount_gross_amount_minor = 0
    )
    or
    (
      promotion_code is not null
      and promotion_discount_type is not null
      and promotion_discount_value is not null
      and discount_gross_amount_minor > 0
    )
  );


create index orders_promotion_code_id_idx
  on public.orders (promotion_code_id)
  where promotion_code_id is not null;

create index orders_promotion_code_idx
  on public.orders (promotion_code)
  where promotion_code is not null;
