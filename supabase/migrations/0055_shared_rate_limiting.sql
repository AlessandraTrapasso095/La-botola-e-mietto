-- Shared application rate limiting.
--
-- Lo stato del limiter vive nel database e non nella memoria
-- della singola istanza serverless.
--
-- Nessun indirizzo IP o identificatore applicativo viene salvato
-- in chiaro: l'applicazione passa esclusivamente un hash SHA-256.
--
-- Una singola riga viene riutilizzata per ogni coppia:
-- scope + identifier_hash.
-- Alla scadenza della finestra il contatore viene azzerato
-- atomicamente dalla stessa RPC.

create table public.rate_limit_buckets (
  scope text not null,
  identifier_hash text not null,

  window_started_at timestamptz not null,
  request_count integer not null,

  updated_at timestamptz not null default now(),

  constraint rate_limit_buckets_pkey
    primary key (scope, identifier_hash),

  constraint rate_limit_buckets_scope_valid
    check (
      char_length(scope) between 1 and 100
      and scope ~ '^[a-z0-9:_-]+$'
    ),

  constraint rate_limit_buckets_identifier_hash_valid
    check (
      identifier_hash ~ '^[a-f0-9]{64}$'
    ),

  constraint rate_limit_buckets_request_count_valid
    check (
      request_count >= 1
    )
);

create index rate_limit_buckets_updated_at_idx
on public.rate_limit_buckets(updated_at);

comment on table public.rate_limit_buckets is
  'Bucket condivisi per rate limiting applicativo. Gli identificatori sono memorizzati esclusivamente come hash SHA-256.';

comment on column public.rate_limit_buckets.scope is
  'Azione o gruppo di endpoint sottoposto a rate limiting.';

comment on column public.rate_limit_buckets.identifier_hash is
  'Hash SHA-256 dell identificatore del chiamante; nessun IP o user id viene conservato in chiaro.';

alter table public.rate_limit_buckets
enable row level security;

revoke all
on table public.rate_limit_buckets
from public, anon, authenticated;

grant select, delete
on table public.rate_limit_buckets
to service_role;

create or replace function public.consume_rate_limit(
  p_scope text,
  p_identifier_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns table (
  allowed boolean,
  remaining integer,
  retry_after_seconds integer,
  reset_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window interval;
  v_bucket public.rate_limit_buckets%rowtype;
  v_reset_at timestamptz;
begin
  if p_scope is null
    or char_length(p_scope) < 1
    or char_length(p_scope) > 100
    or p_scope !~ '^[a-z0-9:_-]+$'
  then
    raise exception using
      errcode = '22023',
      message = 'Rate limit scope non valido.';
  end if;

  if p_identifier_hash is null
    or p_identifier_hash !~ '^[a-f0-9]{64}$'
  then
    raise exception using
      errcode = '22023',
      message = 'Rate limit identifier non valido.';
  end if;

  if p_limit is null
    or p_limit < 1
    or p_limit > 10000
  then
    raise exception using
      errcode = '22023',
      message = 'Rate limit non valido.';
  end if;

  if p_window_seconds is null
    or p_window_seconds < 1
    or p_window_seconds > 86400
  then
    raise exception using
      errcode = '22023',
      message = 'Rate limit window non valida.';
  end if;

  v_window :=
    pg_catalog.make_interval(secs => p_window_seconds);

  insert into public.rate_limit_buckets (
    scope,
    identifier_hash,
    window_started_at,
    request_count,
    updated_at
  )
  values (
    p_scope,
    p_identifier_hash,
    v_now,
    1,
    v_now
  )
  on conflict (scope, identifier_hash)
  do update
  set
    window_started_at =
      case
        when
          public.rate_limit_buckets.window_started_at + v_window <= v_now
        then v_now
        else public.rate_limit_buckets.window_started_at
      end,

    request_count =
      case
        when
          public.rate_limit_buckets.window_started_at + v_window <= v_now
        then 1
        else public.rate_limit_buckets.request_count + 1
      end,

    updated_at = v_now
  returning *
  into v_bucket;

  v_reset_at :=
    v_bucket.window_started_at + v_window;

  return query
  select
    v_bucket.request_count <= p_limit,

    greatest(
      p_limit - v_bucket.request_count,
      0
    ),

    case
      when v_bucket.request_count <= p_limit then 0
      else greatest(
        ceil(
          extract(
            epoch from (v_reset_at - v_now)
          )
        )::integer,
        1
      )
    end,

    v_reset_at;
end;
$$;

revoke all
on function public.consume_rate_limit(
  text,
  text,
  integer,
  integer
)
from public, anon, authenticated;

grant execute
on function public.consume_rate_limit(
  text,
  text,
  integer,
  integer
)
to service_role;
